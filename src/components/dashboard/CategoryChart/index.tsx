
const categories = [
  { label: "Frontend", percent: 42, color: "bg-blue-500" },
  { label: "Backend", percent: 25, color: "bg-violet-500" },
  { label: "API / Integration", percent: 15, color: "bg-pink-500" },
  { label: "UI / UX", percent: 10, color: "bg-orange-500" },
  { label: "Performance", percent: 8, color: "bg-amber-400" },
];

export default function CategoryChart() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className="text-lg font-semibold text-white">
        Issue Categories
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        Common types of issues reported
      </p>

     
<div className="mt-7 grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
  <div className="flex justify-center">
    <div
      className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full sm:h-40 sm:w-40"
      style={{
        background:
          "conic-gradient(#3b82f6 0% 42%, #8b5cf6 42% 67%, #ec4899 67% 82%, #f97316 82% 92%, #fbbf24 92% 100%)",
      }}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#0c1422]">
        <span className="text-2xl font-bold text-white">24</span>
        <span className="text-xs text-slate-400">Reports</span>
      </div>
    </div>
  </div>

  <div className="min-w-0 space-y-4">
    {categories.map((category) => (
      <div
        key={category.label}
        className="grid grid-cols-[10px_minmax(0,1fr)_42px] items-center gap-2 text-sm"
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${category.color}`}
        />

        <span className="min-w-0 text-[9px] break-words text-slate-300">
          {category.label}
        </span>

        <span className="text-right font-medium tabular-nums text-white">
          {category.percent}%
        </span>
      </div>
    ))}
  </div>
</div>

    </section>
  );
}
