
import Link from "next/link";
import {
  ArrowUpRight,
  Bug,
  Clock3,
  MoreHorizontal,
} from "lucide-react";

const reports = [
  {
    id: "BUG-1024",
    title: "Login fails after session timeout",
    category: "Authentication",
    severity: "Critical",
    status: "Open",
    time: "12 min ago",
  },
  {
    id: "BUG-1023",
    title: "Dashboard charts not loading",
    category: "Frontend",
    severity: "High",
    status: "Investigating",
    time: "35 min ago",
  },
  {
    id: "BUG-1022",
    title: "API returns incorrect response",
    category: "API",
    severity: "High",
    status: "Open",
    time: "1 hour ago",
  },
  {
    id: "BUG-1021",
    title: "Settings page layout breaks on mobile",
    category: "UI / UX",
    severity: "Medium",
    status: "Resolved",
    time: "3 hours ago",
  },
];

const severityStyles: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const statusStyles: Record<string, string> = {
  Open: "text-red-400",
  Investigating: "text-blue-400",
  Resolved: "text-emerald-400",
};

export default function RecentReports() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Recent Bug Reports
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Track and review your latest reported issues
          </p>
        </div>

        <Link
          href="/reports"
          className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300"
        >
          View all <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-slate-950/40">
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4 font-medium">Report</th>
              <th className="px-4 py-4 font-medium">Severity</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Reported</th>
              <th className="px-4 py-4 font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {reports.map((report) => (
              <tr
                key={report.id}
                className="transition hover:bg-slate-800/30"
              >
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-slate-800 p-2">
                      <Bug size={17} className="text-violet-400" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white">
                        {report.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {report.id} · {report.category}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                      severityStyles[report.severity]
                    }`}
                  >
                    {report.severity}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`text-sm ${statusStyles[report.status]}`}
                  >
                    {report.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span className="flex items-center gap-2 whitespace-nowrap text-xs text-slate-400">
                    <Clock3 size={14} />
                    {report.time}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    aria-label={`More actions for ${report.id}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
