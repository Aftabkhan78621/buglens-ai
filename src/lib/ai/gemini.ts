
import { z } from "zod";
import type { BugReportInput } from "@/types/bug-report";

const bugAnalysisSchema = z.object({
  severity: z.enum(["Critical", "High", "Medium", "Low"]),

  category: z.enum([
    "Frontend",
    "Backend",
    "API/Integration",
    "UI/UX",
    "Performance",
    "Database",
    "Authentication",
    "Other",
  ]),

  summary: z.string(),

  missingInformation: z.array(
    z.object({
      item: z.string(),
      reason: z.string(),
    })
  ),

  possibleCauses: z.array(
    z.object({
      hypothesis: z.string(),
      evidence: z.string(),
      confidence: z.enum(["Low", "Medium", "High"]),
    })
  ),

  suggestedActions: z.array(
    z.object({
      action: z.string(),
      reason: z.string(),
    })
  ),

  reproductionSteps: z.array(z.string()),
});

export type BugAnalysis = z.infer<typeof bugAnalysisSchema>;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function analyzeBugReport(
  report: BugReportInput
): Promise<BugAnalysis> {
  const apiKey = process.env.OLLAMA_API_KEY;
  const model = process.env.OLLAMA_MODEL || "gemma4:31b";

  if (!apiKey) {
    throw new Error("OLLAMA_API_KEY is not configured.");
  }

  const prompt = `
You are BugLens AI, a software bug triage assistant.

Analyse this bug report and return only valid JSON.

Title: ${report.title}
Description: ${report.description}
Environment: ${report.environment}
Expected behavior: ${report.expectedBehavior || "Not provided"}
Actual behavior: ${report.actualBehavior || "Not provided"}
Logs: ${report.logs || "No logs provided"}

Rules:
- Estimate severity based on evidence and potential impact.
- Never invent facts, logs, or reproduction results.
- Possible causes are hypotheses, not confirmed root causes.
- Explain the evidence supporting each hypothesis.
- Use Low confidence when evidence is insufficient.
- Identify missing information and explain why it matters.
- Recommend concrete, safe debugging actions.
- Do not invent reproduction steps.
- Critical severity requires evidence of severe impact.
- Return JSON only. Do not use Markdown fences.

Required JSON structure:
{
  "severity": "Critical | High | Medium | Low",
  "category": "Frontend | Backend | API/Integration | UI/UX | Performance | Database | Authentication | Other",
  "summary": "Concise summary",
  "missingInformation": [
    { "item": "Information needed", "reason": "Why it matters" }
  ],
  "possibleCauses": [
    {
      "hypothesis": "Potential explanation",
      "evidence": "Supporting evidence or evidence gap",
      "confidence": "Low | Medium | High"
    }
  ],
  "suggestedActions": [
    { "action": "Debugging step", "reason": "Why to do it" }
  ],
  "reproductionSteps": ["Evidence-based step"]
}
`;

  const requestBody = {
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: false,
    format: "json",
    options: {
      temperature: 0.2,
    },
  };

  let response: Response | undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      response = await fetch("https://ollama.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(60000),
        cache: "no-store",
      });

      if (
        response.ok ||
        ![429, 500, 502, 503, 504].includes(response.status) ||
        attempt === 1
      ) {
        break;
      }

      await wait(1000);
    } catch (error) {
      if (attempt === 1) {
        throw error;
      }

      await wait(1000);
    }
  }

  if (!response) {
    throw new Error("OLLAMA_CONNECTION_FAILED");
  }

  if (!response.ok) {
    console.error("Ollama Cloud HTTP status:", response.status);

    if (response.status === 401 || response.status === 403) {
      throw new Error("OLLAMA_AUTH_FAILED");
    }

    if (response.status === 404) {
      throw new Error("OLLAMA_MODEL_NOT_FOUND");
    }

    if (response.status === 429) {
      throw new Error("OLLAMA_RATE_LIMITED");
    }

    if (response.status >= 500) {
      throw new Error("OLLAMA_SERVICE_UNAVAILABLE");
    }

    throw new Error("OLLAMA_REQUEST_FAILED");
  }

  const payload: unknown = await response.json();

  const chatResponseSchema = z.object({
    message: z.object({
      content: z.string(),
    }),
  });

  const parsedPayload = chatResponseSchema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new Error("OLLAMA_INVALID_RESPONSE");
  }

  let output: unknown;

  try {
    output = JSON.parse(parsedPayload.data.message.content);
  } catch {
    throw new Error("OLLAMA_INVALID_JSON");
  }

  return bugAnalysisSchema.parse(output);
}
