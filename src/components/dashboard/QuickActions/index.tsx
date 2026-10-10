
import Link from "next/link";
import {
  Plus,
  FileSearch,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

const actions = [
  {
    title: "Create bug report",
    description: "Document a new issue",
    href: "/reports/new",
    icon: Plus,
  },
  {
    title: "View all reports",
    description: "Browse reported issues",
    href: "/reports",
    icon: FileSearch,
  },
  {
    title: "Review documentation",
    description: "Understand the workflow",
    href: "/dashboard",
    icon: BookOpen,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className="text-lg font-semibold text-white">Quick Actions</h3>

      <p className="mt-1 text-sm text-slate-400">
        Common tasks at your fingertips
      </p>

      <div className="mt-5 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/30 p-3 transition hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <div className="rounded-lg bg-slate-800 p-2 text-violet-400">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">
                  {action.title}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {action.description}
                </p>
              </div>

              <ArrowUpRight
                size={16}
                className="text-slate-500 transition group-hover:text-violet-400"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
