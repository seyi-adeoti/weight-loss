export type CalorieResults = {
  bmr: number;
  tdee: number;
  target: number;
  difference: number;
};

type ResultsCardProps = {
  results: CalorieResults;
  goal: "lose" | "maintain" | "build";
};

const formatCalories = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export default function ResultsCard({ results, goal }: ResultsCardProps) {
  const isTooLow = results.target < 1200;
  const scaleMaximum = Math.max(results.tdee * 1.25, results.target * 1.2, 2000);
  const targetPosition = Math.min((results.target / scaleMaximum) * 100, 100);
  const tdeePosition = Math.min((results.tdee / scaleMaximum) * 100, 100);
  const weeklyLoss = (Math.max(results.difference, 0) * 7) / 3500;
  const threeMonthLoss = weeklyLoss * 13;
  const sixMonthLoss = weeklyLoss * 26;

  return (
    <section
      aria-labelledby="results-title"
      className="result-enter rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
      id="calorie-results"
    >
      <div className="text-center">
        <p className="text-base font-bold uppercase tracking-[0.14em] text-slate-500">
          Your daily calorie target
        </p>
        <h2
          className={`mt-3 text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl ${
            isTooLow ? "text-rose-700" : "text-emerald-700"
          }`}
          id="results-title"
        >
          {formatCalories(results.target)}
          <span className="ml-2 text-xl font-semibold tracking-normal sm:text-2xl">
            calories
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg leading-7 text-slate-600">
          This is an estimate to help you choose a starting point—not a
          guaranteed result or a measure of your worth.
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-slate-50 p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-900">Your breakdown</h3>
        <dl className="mt-4 divide-y divide-slate-200">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base text-slate-700 sm:text-lg">
              Your body burns (estimate)
            </dt>
            <dd className="whitespace-nowrap text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
              {formatCalories(results.tdee)} cal/day
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base text-slate-700 sm:text-lg">Target to eat</dt>
            <dd className="whitespace-nowrap text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
              {formatCalories(results.target)} cal/day
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base text-slate-700 sm:text-lg">
              {goal === "lose" ? "Estimated daily deficit" : goal === "build" ? "Daily increase" : "Daily change"}
            </dt>
            <dd className="whitespace-nowrap text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
              {goal === "maintain" ? "0" : formatCalories(Math.abs(results.difference))} cal/day
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-7">
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">
            Your target compared with daily use
          </h3>
          <span className="shrink-0 text-sm text-slate-500">calories/day</span>
        </div>
        <div
          aria-label={`Target ${formatCalories(results.target)} calories; estimated daily use ${formatCalories(results.tdee)} calories`}
          className="relative mt-8 h-4 rounded-full bg-slate-200"
          role="img"
        >
          <div className="h-4 rounded-full bg-emerald-300" style={{ width: `${tdeePosition}%` }} />
          <div
            className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-emerald-700 shadow"
            style={{ left: `${targetPosition}%` }}
          />
          <div
            className="absolute top-1/2 h-7 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-slate-800"
            style={{ left: `${tdeePosition}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700 sm:text-base">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-full bg-emerald-700" />
            Your target: {formatCalories(results.target)}
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-4 w-1 rounded bg-slate-800" />
            Estimated daily use: {formatCalories(results.tdee)}
          </span>
        </div>
      </div>

      {isTooLow ? (
        <div
          className="mt-7 rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-950"
          role="alert"
        >
          <h3 className="text-lg font-bold">This target is too low to recommend.</h3>
          <p className="mt-2 text-base leading-7 sm:text-lg">
            Saving this target is turned off. Do not treat a calculator result
            as an instruction to undereat. A qualified clinician or registered
            dietitian can help you choose an appropriate approach. You can still
            use the diary and learn about balanced meals without a target.
          </p>
        </div>
      ) : goal === "lose" ? (
        <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 sm:p-6">
          <h3 className="text-lg font-bold">A rough, not guaranteed, estimate</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Estimate label="Per week" value={`~${weeklyLoss.toFixed(1)} lb`} />
            <Estimate label="In 3 months" value={`~${threeMonthLoss.toFixed(0)} lb`} />
            <Estimate label="In 6 months" value={`~${sixMonthLoss.toFixed(0)} lb`} />
          </div>
          <p className="mt-4 text-sm leading-6 text-emerald-900 sm:text-base">
            Real weight changes vary over time. These simple estimates use the
            calorie difference and should not be treated as a promise.
          </p>
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-950">
          <h3 className="text-lg font-bold">
            {goal === "maintain"
              ? "A steady starting point"
              : "A small estimated surplus"}
          </h3>
          <p className="mt-2 text-base leading-7 sm:text-lg">
            {goal === "maintain"
              ? "This estimate aims to maintain your current weight. Actual needs can change with your routine and over time."
              : "This estimate adds about 300 calories a day. Pair any muscle-building goal with strength training and give your body time."}
          </p>
        </div>
      )}
    </section>
  );
}

function Estimate({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/80 p-4 text-center">
      <p className="text-sm font-medium text-emerald-900">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-emerald-800">
        {value}
      </p>
    </div>
  );
}
