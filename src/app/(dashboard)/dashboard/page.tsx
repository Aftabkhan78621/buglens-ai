import {
    ArrowRight,
    Bell,
    Search,
    Sparkles,
} from "lucide-react";
import Link from "next/link";


import StatsCards from "@/components/dashboard/StatsCards";
import SeverityChart from "@/components/dashboard/SeverityChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import RecentReports from "@/components/dashboard/RecentReports";
import AIInsights from "@/components/dashboard/AIInsights";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
    return (
        <div className="min-h-screen">
            <header className="flex h-20 items-center justify-between border-b border-slate-800 px-6 lg:px-8">
                <div className="flex max-w-2xl flex-1 items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3">
                    <Search size={19} className="text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search reports, keywords, errors..."
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                </div>

                <div className="ml-5 flex items-center gap-5">
                    <Bell size={20} className="text-slate-400" />
                    <div className="hidden items-center gap-3 sm:flex">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium">Developer</p>
                            <p className="text-xs text-slate-400">BugLens AI</p>
                        </div>
                    </div>
                </div>
            </header>

            <section className="p-6 lg:p-8">
                <div className="flex flex-wrap items-center justify-between gap-5">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Get insights from your bug reports and let AI help you
                            triage, analyze and resolve faster.
                        </p>
                    </div>

                    <Link
                        href="/reports/new"
                        className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-4 text-sm font-semibold shadow-lg shadow-violet-950/30 transition hover:brightness-110"
                    >
                        <Sparkles size={20} />
                        Create New Analysis
                        <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.9fr)]">
                    <div className="min-w-0 space-y-5">
                        <StatsCards />

                        <div className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-2">
                            <SeverityChart />
                            <CategoryChart />
                        </div>

                        <RecentReports />
                    </div>

                    <aside className="min-w-0 space-y-5">
                        <AIInsights />
                        <QuickActions />
                    </aside>
                </div>
            </section>
        </div>
    );
}