
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Activity,
    BookOpen,
    Bug,
    FileText,
    HelpCircle,
    LayoutDashboard,
    Settings,
    Sparkles,
} from "lucide-react";

const mainLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "New Analysis", href: "/reports/new", icon: Sparkles },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Templates", href: "/reports/new", icon: BookOpen },
    { label: "Documentation", href: "/dashboard", icon: BookOpen },
];

const secondaryLinks = [
    { label: "Settings", href: "/dashboard", icon: Settings },
    { label: "Help & Support", href: "/dashboard", icon: HelpCircle },
];

export default function Sidebar() {
    const pathname = usePathname();

    function renderLink(item: (typeof mainLinks)[number]) {
        const Icon = item.icon;
        const active =
            item.label === "Dashboard"
                ? pathname === "/dashboard"
                : item.label === "New Analysis"
                    ? pathname === "/reports/new"
                    : item.label === "Reports"
                        ? pathname === "/reports" ||
                        (pathname.startsWith("/reports/") &&
                            pathname !== "/reports/new")
                        : false;

        return (
            <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/30"
                        : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                    }`}
            >
                <Icon size={19} />
                <span>{item.label}</span>
            </Link>
        );
    }

    return (
        <aside className="flex min-h-screen w-60 shrink-0 flex-col border-r border-slate-800 bg-[#0b1120] px-3 py-5">
            <Link href="/dashboard" className="mb-9 flex items-center gap-3 px-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
                    <Bug size={23} className="text-white" />
                </div>

                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white">
                        BugLens AI
                    </h1>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                        Turn bug reports into
                        <br />
                        clarity with AI
                    </p>
                </div>
            </Link>

            <nav className="flex flex-col gap-2">
                {mainLinks.map(renderLink)}
            </nav>

            <p className="mb-3 mt-8 px-3 text-xs text-slate-500">Others</p>

            <nav className="flex flex-col gap-2">
                {secondaryLinks.map(renderLink)}
            </nav>

            <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <Activity size={17} className="text-violet-400" />
                    MVP Version
                </div>
                <p className="text-xs leading-5 text-slate-400">
                    AI-powered bug triage for faster development.
                </p>
            </div>
        </aside>
    );
}
