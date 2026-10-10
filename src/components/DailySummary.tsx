type DailySummaryProps = {
  total: number;
  target: number | null;
};

export default function DailySummary({ total, target }: DailySummaryProps) {
  const difference = target === null ? null : target - total;
  const percentage =
    target === null || target <= 0 ? 0 : Math.min((total / target) * 100, 100);
  const tone =
    difference === null ? "text-slate-700" : difference > 0 ? "text-emerald-800" : difference < 0 ? "text-rose-700" : "text-slate-700";
  const barTone =
    difference === null
      ? "bg-slate-400"
      : difference > 0
        ? "bg-emerald-600"
        : difference < 0
          ? "bg-rose-600"
          : "bg-slate-500";

  return (
    <aside
      aria-label="Daily calorie summary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_40px_-30px_rgba(15,23,42,0.5)] backdrop-blur sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
          <p className="text-base font-bold text-slate-900 sm:text-lg">
            Eaten: <span className="tabular-nums">{total.toLocaleString()}</span> cal
          </p>
          <p className="text-base text-slate-700 sm:text-lg">
            Target:{" "}
            <span className="font-bold tabular-nums">
              {target === null ? "Set a target" : `${target.toLocaleString()} cal`}
            </span>
          </p>
          <p className={`text-base font-bold sm:text-lg ${tone}`} aria-live="polite">
            {difference === null
              ? "Save a calorie target in settings"
              : difference > 0
                ? `${difference.toLocaleString()} cal remaining`
                : difference < 0
                  ? `${Math.abs(difference).toLocaleString()} cal over`
                  : "Right on target"}
          </p>
        </div>
        <div
          aria-label={
            target === null
              ? `${total} calories eaten; no target set`
              : `${total} of ${target} calories eaten`
          }
          className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200"
          role="img"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${barTone}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {target !== null && (
          <p className="mt-1 text-right text-xs text-slate-500">
            {total.toLocaleString()} / {target.toLocaleString()} cal
          </p>
        )}
      </div>
    </aside>
  );
}
