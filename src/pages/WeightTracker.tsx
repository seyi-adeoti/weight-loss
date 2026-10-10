import { lazy, Suspense, useState, type FormEvent } from "react";
import TrackerNavigation from "../components/TrackerNavigation";
import TrackerFeedback from "../components/TrackerFeedback";
import ProgressStats from "../components/ProgressStats";
import { formatDate, localDate, useTracker } from "../lib/tracker";

const WeightChart = lazy(() => import("../components/WeightChart"));

export default function WeightTracker() {
  const { data, error, busy, save, reload } = useTracker();
  const [date, setDate] = useState(localDate);
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [feedback, setFeedback] = useState("");
  const [validation, setValidation] = useState("");
  const entries = data?.weights ?? [];
  const latest = entries.at(-1);
  const first = entries[0];
  const existing = entries.find((entry) => entry.date === date);
  const convert = (amount: number) =>
    (unit === "lb" ? amount * 2.2046226218 : amount).toFixed(1);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const amount = Number(weight) / (unit === "lb" ? 2.2046226218 : 1);
    setValidation("");
    setFeedback("");
    if (
      !date ||
      date > localDate() ||
      !Number.isFinite(amount) ||
      amount < 20 ||
      amount > 500
    ) {
      setValidation(
        `Choose today or an earlier day and enter a weight from ${unit === "kg" ? "20–500 kg" : "44.1–1,102.3 lb"}.`,
      );
      return;
    }
    if (
      await save({
        kind: "weight",
        date,
        weight: Math.round(amount * 1000) / 1000,
      })
    ) {
      setFeedback(
        `${existing ? "Updated" : "Saved"} your weigh-in for ${formatDate(date, true)}.`,
      );
      setWeight("");
    }
  }

  return (
    <div className="min-h-screen">
      <TrackerNavigation />
      <main className="mx-auto max-w-5xl space-y-6 px-4 pb-16 pt-8 sm:px-6">
        <header>
          <p className="eyebrow">The bigger picture</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">A little check-in.</h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Your weight is one piece of the picture, not a daily score. Log when
            it suits you and watch the pattern over time.
          </p>
        </header>
        <TrackerFeedback
          error={error}
          loading={!data && !error}
          onRetry={reload}
        />
        {data && (
          <>
            {data.migrationWarning && (
              <p
                role="status"
                className="rounded-xl bg-amber-50 p-4 text-sm text-amber-950"
              >
                {data.migrationWarning}
              </p>
            )}
            <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <section className="diary-card">
                <p className="eyebrow">01 · Record a weigh-in</p>
                <h2 className="mt-2 text-2xl">Just a date and a number</h2>
                <form className="mt-6 space-y-5" onSubmit={submit}>
                  <fieldset disabled={busy} className="space-y-5">
                    <div>
                      <label className="diary-label" htmlFor="weight-date">
                        When did you weigh yourself?
                      </label>
                      <input
                        className="diary-input"
                        id="weight-date"
                        type="date"
                        max={localDate()}
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="diary-label" htmlFor="weigh-in">
                        What did the scale say?
                      </label>
                      <div className="grid grid-cols-[1fr_5rem] gap-2">
                        <input
                          id="weigh-in"
                          className="diary-input"
                          inputMode="decimal"
                          type="number"
                          step="any"
                          min={unit === "kg" ? 20 : 44.092}
                          max={unit === "kg" ? 500 : 1102.312}
                          value={weight}
                          placeholder={
                            unit === "kg" ? "e.g. 82.5" : "e.g. 181.9"
                          }
                          onChange={(event) => setWeight(event.target.value)}
                        />
                        <select
                          aria-label="Weight unit"
                          className="diary-input"
                          value={unit}
                          onChange={(event) => {
                            const nextUnit = event.target.value as "kg" | "lb";
                            if (weight && Number.isFinite(Number(weight)))
                              setWeight(
                                (
                                  Number(weight) *
                                  (nextUnit === "lb"
                                    ? 2.2046226218
                                    : 1 / 2.2046226218)
                                ).toFixed(1),
                              );
                            setUnit(nextUnit);
                          }}
                        >
                          <option value="kg">kg</option>
                          <option value="lb">lb</option>
                        </select>
                      </div>
                    </div>
                    {existing && (
                      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
                        You already logged {convert(existing.weight)} {unit} on
                        this day. Saving updates that entry rather than adding a
                        duplicate.
                      </p>
                    )}
                    {validation && (
                      <p role="alert" className="text-sm text-rose-800">
                        {validation}
                      </p>
                    )}
                    <button
                      className="diary-button w-full"
                      type="submit"
                      disabled={busy}
                    >
                      {busy
                        ? "Saving…"
                        : existing
                          ? "Update weigh-in"
                          : "Save weigh-in"}
                    </button>
                  </fieldset>
                  {feedback && (
                    <p
                      role="status"
                      className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"
                    >
                      {feedback}
                    </p>
                  )}
                </form>
                <details className="mt-5 rounded-xl bg-slate-50 p-4">
                  <summary className="cursor-pointer text-sm font-semibold">
                    New to weighing yourself?
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Use the same scale on a firm, level surface, at a similar
                    time of day and in similar clothing. Weekly check-ins are
                    fine — you do not have to weigh yourself every day.
                  </p>
                </details>
              </section>
              <section className="diary-card">
                <p className="eyebrow">02 · Notice the pattern</p>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                  <h2 className="text-2xl">Your progress over time</h2>
                  <span className="text-sm text-slate-500">
                    {entries.length} check-ins
                  </span>
                </div>
                {latest ? (
                  <>
                    <div className="mt-6 flex flex-wrap gap-8">
                      <div>
                        <p className="text-xs text-slate-500">
                          Latest · {formatDate(latest.date, true)}
                        </p>
                        <p className="mt-1 text-3xl font-semibold">
                          {convert(latest.weight)}{" "}
                          <span className="text-base text-slate-500">
                            {unit}
                          </span>
                        </p>
                      </div>
                      {entries.length > 1 && (
                        <div>
                          <p className="text-xs text-slate-500">
                            Change since first check-in
                          </p>
                          <p className="mt-1 text-3xl font-semibold">
                            {latest.weight - first.weight > 0 ? "+" : ""}
                            {convert(latest.weight - first.weight)}{" "}
                            <span className="text-base text-slate-500">
                              {unit}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <Suspense
                        fallback={
                          <div
                            className="h-64 animate-pulse rounded-xl bg-slate-100"
                            role="status"
                          >
                            Loading chart…
                          </div>
                        }
                      >
                        <WeightChart entries={entries.slice(-30)} />
                      </Suspense>
                      <p className="mt-2 text-xs text-slate-500">
                        Chart uses kg and shows your last 30 check-ins.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 flex min-h-64 flex-col justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-6 text-center">
                    <h3 className="text-2xl">Start where you are.</h3>
                    <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
                      Your first weigh-in creates a starting point. Add another
                      on a different day to begin seeing a pattern.
                    </p>
                  </div>
                )}
              </section>
            </div>
            <details className="diary-card">
              <summary className="cursor-pointer text-lg font-semibold">
                Optional: set or review a goal weight
              </summary>
              <div className="mt-5">
                <ProgressStats
                  currentWeight={latest?.weight ?? null}
                  startingWeight={first?.weight ?? null}
                  goalWeight={data.goalWeight}
                  onGoalWeightChange={async (goalWeight) => {
                    if (await save({ kind: "goal-weight", weight: goalWeight }))
                      setFeedback(
                        goalWeight === null
                          ? "Goal cleared."
                          : "Goal weight saved.",
                      );
                  }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Goal weights in this optional view use kg. A goal is not
                required to track your check-ins.
              </p>
            </details>
            <aside className="rounded-3xl bg-amber-100/60 p-6 sm:p-8">
              <h2 className="text-2xl">
                A change on the scale is not always a change in fat.
              </h2>
              <p className="mt-3 max-w-3xl text-slate-700 leading-7">
                Water, salt, digestion, and hormonal changes can affect a
                weigh-in. Look at the longer-term pattern alongside how you
                feel, your energy, and habits. There is no need to “make up for”
                a higher number by skipping meals.
              </p>
            </aside>
            {entries.length > 0 && (
              <section className="diary-card">
                <h2 className="text-2xl">Your check-in history</h2>
                <ul className="mt-5 divide-y divide-slate-100">
                  {entries
                    .slice()
                    .reverse()
                    .map((entry) => (
                      <li
                        key={entry.date}
                        className="flex flex-wrap items-center gap-3 py-3"
                      >
                        <span className="min-w-32 flex-1 text-sm">
                          {formatDate(entry.date)}
                        </span>
                        <strong className="text-base tabular-nums">
                          {convert(entry.weight)} {unit}
                        </strong>
                        <button
                          type="button"
                          className="min-h-11 rounded-full px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                          disabled={busy}
                          onClick={() => {
                            setDate(entry.date);
                            setWeight(convert(entry.weight));
                            document.getElementById("weigh-in")?.focus();
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="min-h-11 rounded-full px-3 text-sm text-rose-700 hover:bg-rose-50"
                          disabled={busy}
                          aria-label={`Remove weigh-in for ${formatDate(entry.date)}`}
                          onClick={async () => {
                            if (
                              await save({
                                kind: "delete-weight",
                                date: entry.date,
                              })
                            )
                              setFeedback(
                                `Removed weigh-in for ${formatDate(entry.date, true)}.`,
                              );
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              </section>
            )}
          </>
        )}
        <p className="text-xs leading-6 text-slate-500">
          Saved privately on the server and linked to this browser by a cookie.
          Changing devices or clearing the cookie means you cannot access this
          history. Tracking should help, not cause anxiety; take a break and
          seek support if it feels distressing.
        </p>
      </main>
    </div>
  );
}
