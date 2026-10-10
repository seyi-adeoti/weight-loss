import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActivityLevelSelector, {
  type ActivityLevel,
} from "../components/ActivityLevelSelector";
import InputField from "../components/InputField";
import ResultsCard, { type CalorieResults } from "../components/ResultsCard";
import { saveTracker } from "../lib/tracker";

type Gender = "male" | "female";
type Goal = "lose" | "maintain" | "build";
type FormValues = {
  age: string;
  gender: Gender;
  height: string;
  weight: string;
  activity: ActivityLevel;
  goal: Goal;
};

type FormErrors = Partial<Record<"age" | "weight" | "height", string>>;

const initialValues: FormValues = {
  age: "",
  gender: "female",
  height: "",
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
    6.25 * Number(values.height) -
    5 * age +
    (values.gender === "male" ? 5 : -161);
  const tdee = bmr * activityMultipliers[values.activity];
  const target =
    values.goal === "lose"
      ? tdee - 500
      : values.goal === "build"
        ? tdee + 300
        : tdee;

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
  const height = Number(values.height);

  if (!values.age.trim() || !Number.isInteger(age) || age < 18 || age > 100) {
    errors.age = "Enter an age from 18 to 100.";
  }
  if (
    !values.weight.trim() ||
    !Number.isFinite(weight) ||
    weight < 20 ||
    weight > 500
  ) {
    errors.weight = "Enter an adult weight from 20 to 500 kg.";
  }
  if (
    !values.height.trim() ||
    !Number.isFinite(height) ||
    height < 100 ||
    height > 250
  ) {
    errors.height =
      "Enter your measured height (100–250 cm, or the equivalent in feet and inches).";
  }
  return errors;
}

export default function CalorieCalculator() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [results, setResults] = useState<CalorieResults | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");

  function updateValues(updates: Partial<FormValues>) {
    setValues((current) => ({ ...current, ...updates }));
    setResults(null);
    setSaveError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalised = {
      ...values,
      height:
        heightUnit === "cm"
          ? values.height
          : feet.trim() &&
              Number(feet) >= 3 &&
              Number(feet) <= 8 &&
              Number(inches) >= 0 &&
              Number(inches) < 12
            ? String((Number(feet) * 12 + Number(inches)) * 2.54)
            : "",
      weight:
        weightUnit === "kg"
          ? values.weight
          : values.weight.trim()
            ? String(Number(values.weight) / 2.2046226218)
            : "",
    };
    const nextErrors = validate(normalised);
    if (nextErrors.weight && weightUnit === "lb")
      nextErrors.weight = "Enter an adult weight from 44.1 to 1,102.3 lb.";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setResults(null);
      return;
    }

    setResults(calculateResults(normalised));
    window.setTimeout(() => {
      document.getElementById("calorie-results")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }, 0);
  }

  async function handleSave() {
    if (!results || results.target < 1200) return;

    setSaving(true);
    setSaveError("");
    try {
      await saveTracker({ kind: "target", target: results.target });
      navigate("/food-logger");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "We couldn’t save your target. Please try again.",
      );
    } finally {
      setSaving(false);
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
                onChange={(event) =>
                  updateValues({ gender: event.target.value as Gender })
                }
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

            <div className="sm:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl">How tall are you?</h2>
                <div className="flex gap-2" aria-label="Height units">
                  {(["cm", "ft"] as const).map((unit) => (
                    <button
                      type="button"
                      key={unit}
                      aria-pressed={heightUnit === unit}
                      className={`min-h-11 rounded-full px-4 text-sm font-semibold ${heightUnit === unit ? "bg-emerald-700 text-white" : "bg-white text-slate-700"}`}
                      onClick={() => {
                        if (
                          unit !== heightUnit &&
                          unit === "ft" &&
                          values.height &&
                          Number.isFinite(Number(values.height))
                        ) {
                          const totalInches =
                            Math.round((Number(values.height) / 2.54) * 10) /
                            10;
                          setFeet(String(Math.floor(totalInches / 12)));
                          setInches(
                            String(Math.round((totalInches % 12) * 10) / 10),
                          );
                        }
                        if (unit !== heightUnit && unit === "cm" && feet)
                          updateValues({
                            height: String(
                              Math.round(
                                (Number(feet) * 12 + Number(inches)) *
                                  2.54 *
                                  10,
                              ) / 10,
                            ),
                          });
                        setHeightUnit(unit);
                        setResults(null);
                        setErrors((current) => ({
                          ...current,
                          height: undefined,
                        }));
                      }}
                    >
                      {unit === "cm" ? "Centimetres" : "Feet & inches"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                {heightUnit === "cm" ? (
                  <InputField
                    id="height"
                    label="Height in centimetres"
                    min={100}
                    max={250}
                    step={0.1}
                    unit="cm"
                    value={values.height}
                    error={errors.height}
                    onChange={(event) => {
                      updateValues({ height: event.target.value });
                      setErrors((current) => ({
                        ...current,
                        height: undefined,
                      }));
                    }}
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        id="height-feet"
                        label="Feet"
                        min={3}
                        max={8}
                        value={feet}
                        unit="ft"
                        onChange={(event) => {
                          setFeet(event.target.value);
                          setResults(null);
                        }}
                      />
                      <InputField
                        id="height-inches"
                        label="Inches"
                        min={0}
                        max={11.9}
                        step={0.1}
                        value={inches}
                        unit="in"
                        onChange={(event) => {
                          setInches(event.target.value);
                          setResults(null);
                        }}
                      />
                    </div>
                    {errors.height && (
                      <p role="alert" className="mt-2 text-sm text-rose-700">
                        {errors.height}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-slate-600">
                      For example, 5 feet 7 inches is about 170 cm. We do the
                      conversion for you.
                    </p>
                  </>
                )}
              </div>
              <details className="mt-4 text-sm">
                <summary className="min-h-11 cursor-pointer font-semibold text-emerald-900">
                  I don’t know my height — how do I measure it?
                </summary>
                <ol className="mt-2 list-decimal space-y-2 pl-5 leading-7 text-slate-700">
                  <li>
                    Take off your shoes and stand upright against a flat wall.
                  </li>
                  <li>
                    Look straight ahead. Have someone hold a flat book level on
                    the top of your head.
                  </li>
                  <li>
                    Mark where the bottom of the book meets the wall. Measure
                    from the floor to the mark using a tape measure.
                  </li>
                  <li>
                    Enter the centimetres, or switch to feet and inches. A
                    clinic or pharmacy with a height measure may also help.
                  </li>
                </ol>
                <p className="mt-3 text-slate-600">
                  There is no need to guess. You can{" "}
                  <Link
                    to="/nutrition-guide#portions"
                    className="font-semibold underline"
                  >
                    learn portions
                  </Link>{" "}
                  or{" "}
                  <Link to="/food-logger" className="font-semibold underline">
                    log meals without a calorie target
                  </Link>{" "}
                  while you find your height.
                </p>
              </details>
            </div>

            <div>
              <div className="mb-3 flex gap-2" aria-label="Weight units">
                {(["kg", "lb"] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    aria-pressed={unit === weightUnit}
                    className={`min-h-11 rounded-full px-4 text-sm font-semibold ${unit === weightUnit ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}
                    onClick={() => {
                      if (values.weight)
                        updateValues({
                          weight: String(
                            Math.round(
                              Number(values.weight) *
                                (unit === weightUnit
                                  ? 1
                                  : unit === "lb"
                                    ? 2.2046226218
                                    : 1 / 2.2046226218) *
                                10,
                            ) / 10,
                          ),
                        });
                      setWeightUnit(unit);
                      setResults(null);
                    }}
                  >
                    {unit === "kg" ? "Kilograms" : "Pounds"}
                  </button>
                ))}
              </div>
              <InputField
                error={errors.weight}
                id="weight"
                label="Current weight"
                max={weightUnit === "kg" ? 500 : 1102.3}
                min={weightUnit === "kg" ? 20 : 44.1}
                onChange={(event) => {
                  updateValues({ weight: event.target.value });
                  setErrors((current) => ({ ...current, weight: undefined }));
                }}
                step={0.1}
                unit={weightUnit}
                value={values.weight}
              />
              <p className="mt-2 text-sm text-slate-500">
                Use the unit shown on your scale. We convert pounds
                automatically.
              </p>
            </div>

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
                onChange={(event) =>
                  updateValues({ goal: event.target.value as Goal })
                }
                value={values.goal}
              >
                {(Object.entries(goalLabels) as [Goal, string][]).map(
                  ([goal, label]) => (
                    <option key={goal} value={goal}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-base leading-7 text-sky-950 sm:p-5">
            <span aria-hidden="true" className="font-bold">
              Note:{" "}
            </span>
            These formulas provide a rough estimate for adults, not a medical
            prescription. Do not use a weight-loss target during pregnancy or
            breastfeeding, or with a history of disordered eating. A qualified
            clinician or dietitian can advise you if you have a medical
            condition or special needs.
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
                <strong className="text-slate-900">
                  {results.bmr} cal/day
                </strong>
              </p>
              {saveError && (
                <p
                  className="mt-4 rounded-xl bg-rose-50 p-4 text-base text-rose-800"
                  role="alert"
                >
                  {saveError}
                </p>
              )}
              <button
                className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                disabled={
                  results.target < 1200 || results.target > 10000 || saving
                }
                onClick={handleSave}
                type="button"
              >
                {saving ? "Saving…" : "Save My Target & Continue"}
              </button>
              <p className="mt-3 text-center text-sm leading-6 text-slate-500">
                Your target is saved privately on the server and linked to this
                browser by a cookie. You can change it whenever you need.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
