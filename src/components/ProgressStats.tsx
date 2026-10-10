import { useEffect, useState, type FormEvent } from "react";

type ProgressStatsProps = {
  currentWeight: number | null;
  startingWeight: number | null;
  goalWeight: number | null;
  onGoalWeightChange: (weight: number | null) => void;
};

export default function ProgressStats({
  currentWeight,
  startingWeight,
  goalWeight,
  onGoalWeightChange,
}: ProgressStatsProps) {
  const [draft, setDraft] = useState(goalWeight?.toString() ?? "");
  const [error, setError] = useState("");
  useEffect(() => {
    setDraft(goalWeight?.toString() ?? "");
  }, [goalWeight]);
  const lost =
    currentWeight !== null && startingWeight !== null
      ? Math.round((startingWeight - currentWeight) * 10) / 10
      : null;
  const remaining =
    currentWeight !== null && goalWeight !== null
      ? Math.max(0, Math.round((currentWeight - goalWeight) * 10) / 10)
      : null;
  const percentage =
    startingWeight !== null && currentWeight !== null && goalWeight !== null && startingWeight !== goalWeight
      ? Math.round(
          Math.max(
            0,
            Math.min(
              100,
              ((startingWeight - currentWeight) / (startingWeight - goalWeight)) * 100,
            ),
          ),
        )
      : null;

  function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) {
      onGoalWeightChange(null);
      setError("");
      return;
    }
    const value = Number(draft);
    if (!Number.isFinite(value) || value < 20 || value > 500) {
      setError("Enter a goal from 20 to 500 kg.");
      return;
    }
    if (currentWeight !== null && value >= currentWeight) {
      setError("For this progress view, choose a goal below your current weight.");
      return;
    }
    onGoalWeightChange(Math.round(value * 10) / 10);
    setError("");
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Your progress</h2>
          <p className="mt-1 text-base text-slate-600">
            Your earliest saved weigh-in is used as your starting point.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-900">
          {percentage === null ? "Set a goal to see progress" : `${percentage}% toward goal`}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Current weight" value={currentWeight === null ? "—" : `${currentWeight.toFixed(1)} kg`} />
        <Stat label="Goal weight" value={goalWeight === null ? "Not set" : `${goalWeight.toFixed(1)} kg`} />
        <Stat
          label={lost === null ? "Weight change" : lost >= 0 ? "Weight lost so far" : "Change so far"}
          value={lost === null ? "—" : `${Math.abs(lost).toFixed(1)} kg`}
          detail={lost !== null && lost < 0 ? "gained" : undefined}
        />
        <Stat
          label="Remaining to goal"
          value={remaining === null ? "—" : remaining === 0 ? "Goal reached" : `${remaining.toFixed(1)} kg`}
        />
      </div>

      {percentage !== null && (
        <div className="mt-5" aria-label={`${percentage}% progress to goal`}>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-[width] duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      <form className="mt-6 border-t border-slate-100 pt-5" onSubmit={saveGoal}>
        <label
          className="mb-2 block text-base font-semibold text-slate-800"
          htmlFor="goal-weight"
        >
          Set or update your goal weight
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-14 text-lg text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
              id="goal-weight"
              max={500}
              min={20}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="e.g. 75"
              step={0.1}
              type="number"
              value={draft}
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
              kg
            </span>
          </div>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-700 px-5 py-3 text-base font-bold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            type="submit"
          >
            Save goal
          </button>
          {goalWeight !== null && (
            <button
              className="inline-flex min-h-12 items-center justify-center rounded-xl px-4 py-3 text-base font-semibold text-slate-600 transition hover:bg-slate-100"
              onClick={() => {
                onGoalWeightChange(null);
                setDraft("");
                setError("");
              }}
              type="button"
            >
              Clear
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm font-medium text-rose-700" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-medium leading-5 text-slate-600">{label}</p>
      <p className="mt-2 text-xl font-extrabold tabular-nums text-slate-900 sm:text-2xl">
        {value}
      </p>
      {detail && <p className="text-sm text-slate-600">{detail}</p>}
    </div>
  );
}
