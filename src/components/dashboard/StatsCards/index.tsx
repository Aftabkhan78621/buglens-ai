
import {
    FileText,
    AlertCircle,
    AlertTriangle,
    CircleCheck,
    TrendingUp,
} from "lucide-react";

const stats = [
    {
        label: "Total Reports",
        value: "24",
        change: "12%",
        icon: FileText,
        iconStyle: "bg-violet-500/20 text-violet-400",
    },
    {
        label: "Critical",
        value: "6",
        change: "2%",
        icon: AlertCircle,
        iconStyle: "bg-red-500/20 text-red-400",
    },
    {
        label: "High Priority",
        value: "8",
        change: "14%",
        icon: AlertTriangle,
        iconStyle: "bg-amber-500/20 text-amber-400",
    },
    {
        label: "Resolved",
        value: "10",
        change: "25%",
        icon: CircleCheck,
        iconStyle: "bg-emerald-500/20 text-emerald-400",
    },
];

export default function StatsCards() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <article
                        key={stat.label}
                        className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-[#101827] p-5 transition hover:border-slate-700"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                            >
                                <Icon size={27} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-3xl font-bold leading-none text-white">
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-sm leading-5 text-slate-400">
                                    {stat.label}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 font-medium text-emerald-400">
                                <TrendingUp size={13} />
                                {stat.change}
                            </span>
                            <span className="text-slate-500">vs last week</span>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
