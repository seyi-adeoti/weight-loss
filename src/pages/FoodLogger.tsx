import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DailySummary from "../components/DailySummary";
import FoodItem, { type LoggedFood } from "../components/FoodItem";
import FoodSearch, { type Food } from "../components/FoodSearch";
import TrackerNavigation from "../components/TrackerNavigation";

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readDailyLog(dateKey: string): LoggedFood[] {
  const stored = window.localStorage.getItem(`foodLog_${dateKey}`);
  if (!stored) return [];
  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) throw new Error("The saved food log has an invalid format.");
  return parsed as LoggedFood[];
}

function readCalorieTarget(): number | null {
  const stored = window.localStorage.getItem("weight-loss-calorie-target");
  if (!stored) return null;
  const parsed: unknown = JSON.parse(stored);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("results" in parsed) ||
    typeof parsed.results !== "object" ||
    parsed.results === null ||
    !("target" in parsed.results) ||
    typeof parsed.results.target !== "number" ||
    !Number.isFinite(parsed.results.target) ||
    parsed.results.target <= 0
  ) {
    throw new Error("The saved calorie target has an invalid format.");
  }
  return parsed.results.target;
}

export default function FoodLogger() {
  const today = useMemo(() => getLocalDateKey(), []);
  const [foods, setFoods] = useState<LoggedFood[]>([]);
  const [target, setTarget] = useState<number | null>(null);
  const [storageError, setStorageError] = useState("");
  const total = foods.reduce((sum, item) => sum + item.calories, 0);

  useEffect(() => {
    try {
      setFoods(readDailyLog(today));
      setTarget(readCalorieTarget());
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? `Saved data could not be loaded: ${error.message}`
          : "Saved data could not be loaded.",
      );
    }
  }, [today]);

  function persist(nextFoods: LoggedFood[]) {
    try {
      window.localStorage.setItem(`foodLog_${today}`, JSON.stringify(nextFoods));
      setFoods(nextFoods);
      setStorageError("");
    } catch {
      setStorageError(
        "Your food log could not be saved. Check your browser’s storage settings and try again.",
      );
    }
  }

  function addFood(food: Food, grams: number) {
    const item: LoggedFood = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      foodId: food.id,
      name: food.name,
      grams,
      calories: Math.round((food.caloriesPer100g * grams) / 100),
    };
    persist([...foods, item]);
  }

  return (
    <div className="min-h-screen pb-44">
      <TrackerNavigation />
      <main className="mx-auto max-w-5xl px-4 pb-10 pt-7 sm:px-6 sm:pt-10">
        <header className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-700">
            Food logger · {new Date(`${today}T12:00:00`).toLocaleDateString("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Today’s Foods
          </h1>
          <p className="mt-2 text-lg leading-7 text-slate-600">
            Add what you eat as you go. Every food counts, and this is a tool—not
            a test.
          </p>
          <Link
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-base font-semibold text-sky-900 transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            to="/food-scale-tutorial"
          >
            Learn how to use a food scale
          </Link>
        </header>

        <FoodSearch onAdd={addFood} />

        {storageError && (
          <p
            className="mt-5 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-base text-rose-900"
            role="alert"
          >
            {storageError}
          </p>
        )}

        <section
          aria-labelledby="food-list-title"
          className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl" id="food-list-title">
                Logged today
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {foods.length} {foods.length === 1 ? "food" : "foods"}
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold tabular-nums text-emerald-900">
              {total.toLocaleString()} cal
            </span>
          </div>

          {foods.length > 0 ? (
            <ul aria-label="Today's food entries" className="border-t border-slate-100">
              {foods.map((item) => (
                <FoodItem
                  item={item}
                  key={item.id}
                  onDelete={(id) => persist(foods.filter((food) => food.id !== id))}
                />
              ))}
            </ul>
          ) : (
            <div className="border-t border-slate-100 px-5 py-12 text-center">
              <p className="mt-3 text-lg font-semibold text-slate-800">
                Nothing logged yet
              </p>
              <p className="mt-1 text-base text-slate-600">
                Search for your first food above. It’s okay to start small.
              </p>
            </div>
          )}
        </section>

        <p className="mt-5 text-center text-sm leading-6 text-slate-500">
          Food calories are approximate and can vary by brand, recipe, and
          preparation.
        </p>
      </main>

      <DailySummary target={target} total={total} />

      {target === null && (
        <Link
          className="fixed bottom-36 right-4 z-20 inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-bold text-emerald-800 shadow-lg transition hover:bg-emerald-50 sm:right-8"
          to="/calorie-calculator"
        >
          Set calorie target
        </Link>
      )}
    </div>
  );
}
