
const severityData = [
  { label: "Critical", value: 6, color: "bg-red-500" },
  { label: "High", value: 8, color: "bg-orange-500" },
  { label: "Medium", value: 12, color: "bg-amber-400" },
  { label: "Low", value: 4, color: "bg-sky-500" },
];

export default function SeverityChart() {
  const maxValue = 20;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className="text-lg font-semibold text-white">
        Reports by Severity
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        Overview of bug reports by severity level
      </p>

      <div className="mt-8">
        <div className="relative flex h-44 items-end justify-around border-b border-slate-700">
          {[5, 10, 15, 20].map((tick) => (
            <div
              key={tick}
              className="pointer-events-none absolute left-0 right-0 border-t border-slate-800"
              style={{ bottom: `${(tick / maxValue) * 100}%` }}
            />
          ))}

          {severityData.map((item) => (
            <div
              key={item.label}
              className="relative z-10 flex h-full w-1/5 flex-col items-center justify-end"
            >
              <span className="mb-2 text-sm font-semibold text-white">
                {item.value}
              </span>
              <div
                className={`w-full max-w-12 rounded-t-md ${item.color}`}
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-around">
          {severityData.map((item) => (
            <span
              key={item.label}
              className="text-xs text-slate-400"
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
