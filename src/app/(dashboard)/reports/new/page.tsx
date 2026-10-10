
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  AlertTriangle,
  Bug,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  LoaderCircle,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

import { bugReportSchema } from "@/lib/validation/bug-report";
import type { BugReportInput } from "@/types/bug-report";
import type { BugAnalysis } from "@/lib/ai/gemini";

export default function NewBugReportPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] =
    useState<BugReportInput["environment"]>("Development");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [logs, setLogs] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof BugReportInput, string>>
  >({});

  const [analysis, setAnalysis] = useState<BugAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAnalysis(null);
    setApiError("");

    const result = bugReportSchema.safeParse({
      title,
      description,
      environment,
      expectedBehavior: expected,
      actualBehavior: actual,
      logs,
    });

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof BugReportInput, string>
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof BugReportInput;

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(
          responseData.error || "Unable to analyse the bug report."
        );
      }

      setAnalysis(responseData.analysis as BugAnalysis);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-slate-700 bg-[#0c1422] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  function getFieldClass(field: keyof BugReportInput) {
    return `${fieldClass} ${
      errors[field] ? "border-red-500" : ""
    }`;
  }

  function clearFieldError(field: keyof BugReportInput) {
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
    setApiError("");
  }

  function severityClass(severity: BugAnalysis["severity"]) {
    switch (severity) {
      case "Critical":
        return "border-red-500/30 bg-red-500/10 text-red-300";
      case "High":
        return "border-orange-500/30 bg-orange-500/10 text-orange-300";
      case "Medium":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      default:
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }
  }

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
          <Bug size={23} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            New Bug Analysis
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Describe the issue and let AI help organize the evidence,
            identify possible causes, and suggest debugging steps.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-white">
              Bug Information
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Describe the issue as clearly as possible.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="text-sm font-medium text-slate-200"
              >
                Bug Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearFieldError("title");
                }}
                placeholder="e.g. Login fails after password reset"
                className={getFieldClass("title")}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-200"
              >
                Bug Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  clearFieldError("description");
                }}
                placeholder="Explain the issue and how to reproduce it..."
                rows={5}
                className={`${getFieldClass("description")} resize-y`}
                aria-invalid={Boolean(errors.description)}
              />
              <div className="mt-2 flex items-start justify-between gap-3">
                {errors.description ? (
                  <p className="text-sm text-red-400">
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Include the steps that lead to the error.
                  </p>
                )}
                <span className="shrink-0 text-xs text-slate-500">
                  {description.length}/5000
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="environment"
                className="text-sm font-medium text-slate-200"
              >
                Environment
              </label>
              <select
                id="environment"
                name="environment"
                value={environment}
                onChange={(event) =>
                  setEnvironment(
                    event.target.value as BugReportInput["environment"]
                  )
                }
                className={getFieldClass("environment")}
              >
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Staging">Staging</option>
                <option value="Production">Production</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:p-7">
          <h2 className="text-base font-semibold text-white">
            Expected vs Actual Behavior
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Explain what should happen and what actually happens.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="expected"
                className="text-sm font-medium text-slate-200"
              >
                Expected Behavior
              </label>
              <textarea
                id="expected"
                name="expectedBehavior"
                value={expected}
                onChange={(event) => {
                  setExpected(event.target.value);
                  clearFieldError("expectedBehavior");
                }}
                placeholder="What should have happened?"
                rows={3}
                className={`${getFieldClass("expectedBehavior")} resize-y`}
              />
              {errors.expectedBehavior && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.expectedBehavior}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="actual"
                className="text-sm font-medium text-slate-200"
              >
                Actual Behavior
              </label>
              <textarea
                id="actual"
                name="actualBehavior"
                value={actual}
                onChange={(event) => {
                  setActual(event.target.value);
                  clearFieldError("actualBehavior");
                }}
                placeholder="What actually happened?"
                rows={3}
                className={`${getFieldClass("actualBehavior")} resize-y`}
              />
              {errors.actualBehavior && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.actualBehavior}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:p-7">
          <h2 className="text-base font-semibold text-white">
            Logs & Technical Details
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Add error messages or stack traces if available.
          </p>

          <div className="mt-6">
            <label
              htmlFor="logs"
              className="text-sm font-medium text-slate-200"
            >
              Error Logs{" "}
              <span className="text-slate-500">(Optional)</span>
            </label>
            <textarea
              id="logs"
              name="logs"
              value={logs}
              onChange={(event) => {
                setLogs(event.target.value);
                clearFieldError("logs");
              }}
              placeholder="Paste error messages or stack traces here..."
              rows={5}
              spellCheck={false}
              className={`${getFieldClass("logs")} resize-y font-mono text-xs leading-6`}
            />
            <div className="mt-2 flex justify-between gap-3">
              {errors.logs && (
                <p className="text-sm text-red-400">{errors.logs}</p>
              )}
              <span className="ml-auto text-xs text-slate-500">
                {logs.length}/10000
              </span>
            </div>
          </div>
        </section>

        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
          >
            <XCircle className="mt-0.5 shrink-0 text-red-400" size={19} />
            <div>
              <p className="text-sm font-semibold text-red-300">
                Analysis failed
              </p>
              <p className="mt-1 text-sm text-red-200/80">{apiError}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" size={18} />
                Analysing Bug...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyse Bug with AI
              </>
            )}
          </button>
        </div>
      </form>

      {analysis && (
        <section
          aria-live="polite"
          className="mt-10 space-y-6"
          id="analysis-results"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Analysis Results
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                AI-generated recommendations based on the submitted evidence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5">
              <p className="text-sm text-slate-400">Suggested Severity</p>
              <span
                className={`mt-3 inline-flex rounded-lg border px-3 py-1.5 text-sm font-semibold ${severityClass(analysis.severity)}`}
              >
                {analysis.severity}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:col-span-2">
              <p className="text-sm text-slate-400">Detected Category</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {analysis.category}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:p-7">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <ClipboardList size={18} className="text-blue-400" />
              Summary
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {analysis.summary}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:p-7">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <CircleHelp size={18} className="text-amber-400" />
              Missing Information
            </h3>

            {analysis.missingInformation.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                No additional information was identified as necessary by the
                model. This does not guarantee the report is complete.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {analysis.missingInformation.map((item, index) => (
                  <div
                    key={`${item.item}-${index}`}
                    className="rounded-xl border border-slate-800 bg-[#0c1422] p-4"
                  >
                    <p className="text-sm font-medium text-white">
                      {item.item}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:p-7">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <Search size={18} className="text-purple-400" />
              Possible Causes
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              These are hypotheses to investigate, not confirmed root causes.
            </p>

            {analysis.possibleCauses.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                There is not enough evidence to suggest a specific cause.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {analysis.possibleCauses.map((cause, index) => (
                  <div
                    key={`${cause.hypothesis}-${index}`}
                    className="rounded-xl border border-slate-800 bg-[#0c1422] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4 className="text-sm font-semibold text-white">
                        {index + 1}. {cause.hypothesis}
                      </h4>
                      <span className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300">
                        {cause.confidence} confidence
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      <span className="font-medium text-slate-300">
                        Evidence:{" "}
                      </span>
                      {cause.evidence}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:p-7">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <AlertTriangle size={18} className="text-emerald-400" />
              Suggested Debugging Actions
            </h3>

            {analysis.suggestedActions.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                No specific actions were returned. Add more diagnostic
                information and run the analysis again.
              </p>
            ) : (
              <ol className="mt-5 space-y-4">
                {analysis.suggestedActions.map((item, index) => (
                  <li
                    key={`${item.action}-${index}`}
                    className="flex gap-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-semibold text-blue-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.action}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {item.reason}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111b2b] p-5 sm:p-7">
            <h3 className="font-semibold text-white">
              Reproduction Steps
            </h3>

            {analysis.reproductionSteps.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                The report does not contain enough detail to list
                evidence-based reproduction steps.
              </p>
            ) : (
              <ol className="mt-4 list-inside list-decimal space-y-3">
                {analysis.reproductionSteps.map((step, index) => (
                  <li
                    key={`${step}-${index}`}
                    className="text-sm leading-6 text-slate-300"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-amber-400"
            />
            <p className="text-sm leading-6 text-slate-400">
              AI recommendations may be incorrect or incomplete. Verify
              hypotheses against your code, logs, and reproducible test
              results before making changes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setAnalysis(null);
              setApiError("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Report Form
          </button>
        </section>
      )}
    </div>
  );
}
