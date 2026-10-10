
import { NextResponse } from "next/server";
import { bugReportSchema } from "@/lib/validation/bug-report";
import { analyzeBugReport } from "@/lib/ai/gemini";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          error: "Content-Type must be application/json.",
        },
        { status: 415 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const validation = bugReportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const analysis = await analyzeBugReport(validation.data);

    return NextResponse.json({
      success: true,
      message: "Bug report analysed successfully.",
      data: validation.data,
      analysis,
    });
  } catch (error) {
    console.error("BugLens AI error:", error);

    const message = error instanceof Error ? error.message : "";

    const errors: Record<string, { error: string; status: number }> = {
      "OLLAMA_API_KEY is not configured.": {
        error: "Ollama Cloud API key is missing from server configuration.",
        status: 500,
      },
      OLLAMA_AUTH_FAILED: {
        error: "Ollama authentication failed. Check your API key.",
        status: 502,
      },
      OLLAMA_MODEL_NOT_FOUND: {
        error: "The configured Ollama model is unavailable. Check model access.",
        status: 502,
      },
      OLLAMA_RATE_LIMITED: {
        error: "Ollama rate limit reached. Please try again later.",
        status: 429,
      },
      OLLAMA_SERVICE_UNAVAILABLE: {
        error: "Ollama Cloud is temporarily unavailable. Try again later.",
        status: 503,
      },
      OLLAMA_CONNECTION_FAILED: {
        error: "Could not connect to Ollama Cloud. Please retry.",
        status: 502,
      },
      OLLAMA_INVALID_RESPONSE: {
        error: "Ollama returned an unexpected response.",
        status: 502,
      },
      OLLAMA_INVALID_JSON: {
        error: "AI returned invalid JSON. Please try again.",
        status: 502,
      },
      OLLAMA_REQUEST_FAILED: {
        error: "Ollama rejected the request. Check the model and request settings.",
        status: 502,
      },
    };

    const mapped = errors[message];

    if (mapped) {
      return NextResponse.json(
        { success: false, error: mapped.error },
        {
          status: mapped.status,
          headers:
            mapped.status === 429 || mapped.status === 503
              ? { "Retry-After": "10" }
              : undefined,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "AI analysis failed. Please try again.",
      },
      { status: 502 }
    );
  }
}
