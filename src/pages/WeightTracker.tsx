import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import ProgressStats from "../components/ProgressStats";
import TrackerNavigation from "../components/TrackerNavigation";
import type { WeightEntry } from "../components/WeightChart";
import WeightInputForm from "../components/WeightInputForm";

const WeightChart = lazy(() => import("../components/WeightChart"));
const GOAL_WEIGHT_KEY = "weight-goal-kg";

function readWeightEntries(): WeightEntry[] {
  const entries: WeightEntry[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith("weightLog_")) continue;
    const date = key.slice("weightLog_".length);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const rawValue = window.localStorage.getItem(key);
    if (rawValue === null) continue;
    const weight: unknown = JSON.parse(rawValue);
    if (typeof weight !== "number" || !Number.isFinite(weight) || weight < 20 || weight > 500) {
      throw new Error(`The saved weight for ${date} has an invalid value.`);
    }
    entries.push({ date, weight });
  }
  return entries.sort((left, right) => left.date.localeCompare(right.date));
}

function readGoalWeight(): number | null {
  const stored = window.localStorage.getItem(GOAL_WEIGHT_KEY);
  if (stored === null) return null;
  const goal = Number(stored);
  if (!Number.isFinite(goal) || goal < 20 || goal > 500) {
    throw new Error("The saved goal weight has an invalid value.");
  }
  return goal;
}

function getTrend(entries: WeightEntry[]) {
  if (entries.length < 2) return "stable" as const;
  const recent = entries.slice(-7);
  if (recent.length < 2) return "stable" as const;
  const first = recent[0].weight;
  const last = recent[recent.length - 1].weight;
  const change = last - first;
  if (change <= -0.2) return "down" as const;
  if (change >= 0.2) return "up" as const;
  return "stable" as const;
}

export default function WeightTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [goalWeight, setGoalWeight] = useState<number | null>(null);
  const [storageError, setStorageError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    try {
      setEntries(readWeightEntries());
      setGoalWeight(readGoalWeight());
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? `Saved data could not be loaded: ${error.message}`
          : "Saved data could not be loaded.",
      );
    }
  }, []);

  const chartEntries = useMemo(() => entries.slice(-7), [entries]);
  const currentWeight = entries.at(-1)?.weight ?? null;
  const startingWeight = entries[0]?.weight ?? null;
  const trend = getTrend(entries);

  function logWeight(date: string, weight: number) {
    try {
      window.localStorage.setItem(`weightLog_${date}`, JSON.stringify(weight));
      setEntries(readWeightEntries());
      setStatusMessage(`Weight saved for ${new Date(`${date}T12:00:00`).toLocaleDateString()}.`);
      setStorageError("");
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? `Your weigh-in could not be saved: ${error.message}`
          : "Your weigh-in could not be saved. Check your browser storage settings.",
      );
      setStatusMessage("");
    }
  }

  function updateGoalWeight(weight: number | null) {
    try {
      if (weight === null) window.localStorage.removeItem(GOAL_WEIGHT_KEY);
      else window.localStorage.setItem(GOAL_WEIGHT_KEY, String(weight));
      setGoalWeight(weight);
      setStorageError("");
    } catch {
      setStorageError("Your goal weight could not be saved. Check your browser storage settings.");
    }
  }

  return (
    <div className="min-h-screen">
      <TrackerNavigation />
      <main className="mx-auto max-w-5xl space-y-6 px-4 pb-12 pt-7 sm:space-y-8 sm:px-6 sm:pt-10">
        <header>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-700">
            Weight tracker
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Weight Progress
          </h1>
          <p className="mt-2 text-lg leading-7 text-slate-600">
            Look for a trend over time. One weigh-in is just one point in your
            story.
          </p>
        </header>

        <WeightInputForm onLog={logWeight} />

        {(storageError || statusMessage) && (
          <p
            className={`rounded-2xl p-4 text-base ${
              storageError
                ? "border border-rose-300 bg-rose-50 text-rose-900"
                : "border border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
            role={storageError ? "alert" : "status"}
          >
            {storageError || statusMessage}
          </p>
        )}

        <section
          aria-labelledby="weight-chart-title"
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2
                className="text-xl font-bold text-slate-900 sm:text-2xl"
                id="weight-chart-title"
              >
                Your last 7 weigh-ins
              </h2>
              <p className="mt-1 text-base text-slate-600">
                Each point shows the weight logged for that date.
              </p>
            </div>
            {entries.length > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </span>
            )}
          </div>
          {chartEntries.length > 0 ? (
            <div className="mt-5">
              <Suspense
                fallback={
                  <div className="flex h-72 items-center justify-center text-base text-slate-600">
                    Loading your chart…
                  </div>
                }
              >
                <WeightChart entries={chartEntries} />
              </Suspense>
            </div>
          ) : (
            <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-2xl bg-slate-50 px-5 text-center">
              <p className="mt-3 text-lg font-semibold text-slate-800">
                Your chart will grow with your entries
              </p>
              <p className="mt-1 max-w-md text-base leading-6 text-slate-600">
                Log a weigh-in to start. No sample weights are added, so this
                chart reflects only your own entries.
              </p>
            </div>
          )}
        </section>

        <ProgressStats
          currentWeight={currentWeight}
          goalWeight={goalWeight}
          onGoalWeightChange={updateGoalWeight}
          startingWeight={startingWeight}
        />

        <section
          aria-labelledby="weight-callout-title"
          className="rounded-3xl border border-sky-200 bg-sky-50 p-5 sm:p-7"
        >
          <h2
            className="text-xl font-bold text-sky-950 sm:text-2xl"
            id="weight-callout-title"
          >
            The scale can move around—and that’s normal.
          </h2>
          <p className="mt-2 text-base leading-7 text-sky-950 sm:text-lg">
            Weight can fluctuate 2–3 kg day to day due to:
          </p>
          <ul className="mt-3 grid gap-2 text-base text-sky-950 sm:grid-cols-2 sm:text-lg">
            {["Water retention", "Hormones", "Digestion", "Salt intake"].map((reason) => (
              <li className="rounded-xl bg-white/70 px-4 py-3" key={reason}>
                <span aria-hidden="true" className="mr-2 text-sky-700">•</span>
                {reason}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-white px-4 py-3 text-lg font-bold text-sky-950">
            Look at your weekly trend, not a single day’s number.
          </p>
        </section>

        <section
          aria-live="polite"
          className={`rounded-2xl p-5 text-lg font-semibold ${
            trend === "down"
              ? "bg-emerald-50 text-emerald-900"
              : trend === "up"
                ? "bg-amber-50 text-amber-950"
                : "bg-slate-100 text-slate-800"
          }`}
        >
          {trend === "down"
            ? "Great! Your recent trend is down. Keep noticing the longer-term pattern."
            : trend === "up"
              ? "No worries, weight fluctuates. Keep going and look at the longer-term trend."
              : entries.length < 2
                ? "Log another weigh-in on a different day to start seeing a trend."
                : "Your recent trend looks fairly steady. Stay consistent; results come with time."}
        </section>
      </main>
    </div>
  );
}
