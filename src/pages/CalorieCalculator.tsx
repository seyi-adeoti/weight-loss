import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActivityLevelSelector, {
  type ActivityLevel,
} from "../components/ActivityLevelSelector";
import InputField from "../components/InputField";
import ResultsCard, { type CalorieResults } from "../components/ResultsCard";

type Gender = "male" | "female";
type Goal = "lose" | "maintain" | "build";
type FormValues = {
  age: string;
  gender: Gender;
  height: number;
  weight: string;
  activity: ActivityLevel;
  goal: Goal;
};

type FormErrors = Partial<Record<"age" | "weight", string>>;

const initialValues: FormValues = {
  age: "",
  gender: "female",
  height: 170,
  weight: "",
  activity: "sedentary",
  goal: "lose",
};

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
};

const goalLabels: Record<Goal, string> = {
  lose: "Lose weight",
  maintain: "Maintain",
  build: "Build muscle",
};

const selectClasses =
  "min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200";

function calculateResults(values: FormValues): CalorieResults {
  const age = Number(values.age);
  const weight = Number(values.weight);
  const bmr =
    10 * weight +
    6.25 * values.height -
    5 * age +
    (values.gender === "male" ? 5 : -161);
  const tdee = bmr * activityMultipliers[values.activity];
  const target =
    values.goal === "lose" ? tdee - 500 : values.goal === "build" ? tdee + 300 : tdee;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
    difference: Math.round(tdee - target),
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const age = Number(values.age);
  const weight = Number(values.weight);

  if (!values.age.trim() || !Number.isInteger(age) || age < 18 || age > 100) {
    errors.age = "Enter an age from 18 to 100.";
  }
  if (!values.weight.trim() || !Number.isFinite(weight) || weight <= 0 || weight > 500) {
    errors.weight = "Enter a weight greater than 0 and no more than 500 kg.";
  }
  return errors;
}

export default function CalorieCalculator() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [results, setResults] = useState<CalorieResults | null>(null);
  const [saveError, setSaveError] = useState("");

  function updateValues(updates: Partial<FormValues>) {
    setValues((current) => ({ ...current, ...updates }));
    setResults(null);
    setSaveError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setResults(null);
      return;
    }

    setResults(calculateResults(values));
    window.setTimeout(() => {
      document.getElementById("calorie-results")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleSave() {
    if (!results || results.target < 1200) return;

    try {
      window.localStorage.setItem(
        "weight-loss-calorie-target",
        JSON.stringify({
          savedAt: new Date().toISOString(),
          inputs: values,
          results,
          goal: values.goal,
        }),
      );
      navigate("/food-logger");
    } catch {
      setSaveError(
        "We couldn’t save your target on this device. Check your browser’s storage settings and try again.",
      );
    }
  }

  return (
    <main className="min-h-screen px-4 pb-20 pt-7 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-4xl">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          to="/calories-explained"
        >
          <span aria-hidden="true">←</span> Back to the lesson
        </Link>

        <header className="mx-auto mt-7 max-w-2xl text-center">
          <p className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
            Your personal starting point
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Calculate Your Calorie Target
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 sm:text-xl">
            Answer a few questions to get an estimate. There’s no perfect
            number—this is simply a place to begin.
          </p>
        </header>

        <form
          className="mt-9 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-11 sm:p-9"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-8">
            <InputField
              error={errors.age}
              id="age"
              label="Age"
              max={100}
              min={18}
              onChange={(event) => {
                updateValues({ age: event.target.value });
                setErrors((current) => ({ ...current, age: undefined }));
              }}
              value={values.age}
            />

            <div>
              <label
                className="mb-2 block text-base font-semibold text-slate-800"
                htmlFor="gender"
              >
                Gender used for this estimate
              </label>
              <select
                className={selectClasses}
                id="gender"
                onChange={(event) => updateValues({ gender: event.target.value as Gender })}
                value={values.gender}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
              <p className="mt-2 text-sm leading-5 text-slate-500">
                This formula uses a male or female estimate. It may not fit
                everyone’s body or circumstances.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-base font-semibold text-slate-800" htmlFor="height">
                  Height
                </label>
                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-lg font-bold tabular-nums text-emerald-900">
                  {values.height} cm
                </span>
              </div>
              <input
                className="h-12 w-full cursor-pointer accent-emerald-700"
                id="height"
                max={220}
                min={140}
                onChange={(event) =>
                  updateValues({ height: Number(event.target.value) })
                }
                step={1}
                type="range"
                value={values.height}
              />
              <div className="flex justify-between text-sm text-slate-500">
                <span>140 cm</span>
                <span>220 cm</span>
              </div>
            </div>

            <InputField
              error={errors.weight}
              id="weight"
              label="Current weight"
              max={500}
              min={1}
              onChange={(event) => {
                updateValues({ weight: event.target.value });
                setErrors((current) => ({ ...current, weight: undefined }));
              }}
              step={0.1}
              unit="kg"
              value={values.weight}
            />

            <ActivityLevelSelector
              onChange={(activity) => updateValues({ activity })}
              value={values.activity}
            />

            <div>
              <label
                className="mb-2 block text-base font-semibold text-slate-800"
                htmlFor="goal"
              >
                Your goal
              </label>
              <select
                className={selectClasses}
                id="goal"
                onChange={(event) => updateValues({ goal: event.target.value as Goal })}
                value={values.goal}
              >
                {(Object.entries(goalLabels) as [Goal, string][]).map(([goal, label]) => (
                  <option key={goal} value={goal}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-base leading-7 text-sky-950 sm:p-5">
            <span aria-hidden="true" className="font-bold">Note: </span>
            These formulas provide a rough estimate. Your real needs can differ
            because of health, routine, and other factors.
          </div>

          <button
            className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
            type="submit"
          >
            Calculate My Target
          </button>
        </form>

        {results && (
          <div className="mt-8 space-y-5">
            <ResultsCard goal={values.goal} results={results} />
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-center text-base leading-7 text-slate-600">
                Your estimated resting energy (BMR):{" "}
                <strong className="text-slate-900">{results.bmr} cal/day</strong>
              </p>
              {saveError && (
                <p className="mt-4 rounded-xl bg-rose-50 p-4 text-base text-rose-800" role="alert">
                  {saveError}
                </p>
              )}
              <button
                className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                disabled={results.target < 1200}
                onClick={handleSave}
                type="button"
              >
                Save My Target &amp; Continue
              </button>
              <p className="mt-3 text-center text-sm leading-6 text-slate-500">
                Your target is stored only in this browser. You can change it
                whenever you need.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
