
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const insights = [
  {
    icon: AlertTriangle,
    color: "text-red-400 bg-red-500/10",
    title: "Critical issue detected",
    description:
      "Authentication failures may affect users after session timeout.",
    label: "High impact",
  },
  {
    icon: TrendingUp,
    color: "text-amber-400 bg-amber-500/10",
    title: "Frontend issues increasing",
    description:
      "Review recent UI changes and browser console errors.",
    label: "Needs review",
  },
  {
    icon: Lightbulb,
    color: "text-violet-400 bg-violet-500/10",
    title: "Suggested next step",
    description:
      "Check API response codes before investigating client-side rendering.",
    label: "Recommendation",
  },
];

export default function AIInsights() {
  return (
    <section className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 via-slate-900/80 to-slate-900/60 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
          <Sparkles size={21} />
        </div>

        <div>
          <h3 className="font-semibold text-white">AI Insights</h3>
          <p className="text-xs text-slate-400">
            Sample dashboard insights
          </p>
        </div>

        <span className="ml-auto rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-xs text-violet-300">
          Preview
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon;

          return (
            <article
              key={insight.title}
              className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${insight.color}`}>
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-white">
                    {insight.title}
                  </h4>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {insight.description}
                  </p>

                  <p className="mt-3 text-xs text-slate-500">
                    {insight.label}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
