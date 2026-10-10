import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import foodsData from "../data/foods.json";
import { portions } from "../data/portions";
import TrackerNavigation from "../components/TrackerNavigation";
import TrackerFeedback from "../components/TrackerFeedback";
import {
  formatDate,
  localDate,
  meals,
  useTracker,
  type Meal,
} from "../lib/tracker";

export default function FoodLogger() {
  const { data, error, busy, save, reload } = useTracker();
  const [date, setDate] = useState(localDate);
  const [meal, setMeal] = useState<Meal>("Breakfast");
  const [query, setQuery] = useState("");
  const [foodId, setFoodId] = useState("");
  const [grams, setGrams] = useState("100");
  const [portion, setPortion] = useState("");
  const [mode, setMode] = useState<"search" | "manual">("search");
  const [manualCalories, setManualCalories] = useState("");
  const [manualPortion, setManualPortion] = useState("1 serving");
  const [feedback, setFeedback] = useState("");
  const [validation, setValidation] = useState("");
  const selected = foodsData.find((food) => food.id === foodId);
  const suggestions =
    query.trim() && !selected
      ? foodsData
          .filter((food) =>
            food.name.toLowerCase().includes(query.trim().toLowerCase()),
          )
          .slice(0, 8)
      : [];
  const dayFoods = data?.foods.filter((food) => food.date === date) ?? [];
  const total = dayFoods.reduce((sum, food) => sum + food.calories, 0);
  const week = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const day = new Date(`${date}T12:00:00`);
        day.setDate(day.getDate() - 6 + index);
        return localDate(day);
      }),
    [date],
  );
  const preview = selected
    ? Math.round((selected.caloriesPer100g * Number(grams)) / 100)
    : null;

  function chooseFood(id: string) {
    const food = foodsData.find((entry) => entry.id === id);
    if (!food) return;
    setFoodId(id);
    setQuery(food.name);
    const serving = portions[id]?.[0];
    setGrams(String(serving?.grams ?? 100));
    setPortion(serving?.label ?? "");
    setValidation("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setValidation("");
    setFeedback("");
    const amount = Number(grams);
    const calories = mode === "manual" ? Number(manualCalories) : preview;
    if (date > localDate() || !date) {
      setValidation("Choose today or an earlier day.");
      return;
    }
    if (
      mode === "search" &&
      (!selected || !Number.isFinite(amount) || amount < 1 || amount > 5000)
    ) {
      setValidation(
        selected
          ? "Enter between 1 and 5,000 grams."
          : "Choose a food from the search results.",
      );
      return;
    }
    if (
      mode === "manual" &&
      (!query.trim() ||
        !manualPortion.trim() ||
        !manualCalories.trim() ||
        !Number.isFinite(calories) ||
        Number(calories) < 0 ||
        Number(calories) > 20000)
    ) {
      setValidation(
        "Add a food name, portion, and calories from its label (0–20,000).",
      );
      return;
    }
    if (
      await save({
        kind: "food",
        date,
        meal,
        name: mode === "search" ? selected!.name : query.trim(),
        grams: mode === "search" ? amount : null,
        calories,
        portion:
          mode === "search" ? portion || `${amount} g` : manualPortion.trim(),
      })
    ) {
      setFeedback(
        `Added to ${meal.toLowerCase()} for ${formatDate(date, true)}.`,
      );
      setQuery("");
      setFoodId("");
      setManualCalories("");
      setPortion("");
    }
  }

  return (
    <div className="min-h-screen">
      <TrackerNavigation />
      <main className="mx-auto max-w-5xl space-y-6 px-4 pb-16 pt-8 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">One meal at a time</p>
            <h1 className="mt-2 text-4xl sm:text-5xl">Your food diary</h1>
            <p className="mt-3 max-w-lg text-slate-600">
              Choose your day, add what you ate, and leave the maths to us. No
              perfect days required.
            </p>
          </div>
          <label className="text-sm font-semibold">
            Day to track
            <input
              aria-label="Day to track"
              className="diary-input mt-2"
              type="date"
              max={localDate()}
              value={date}
              onChange={(event) => {
                if (event.target.value) {
                  setDate(event.target.value);
                  setFeedback("");
                }
              }}
            />
          </label>
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
            <section
              className="diary-overview"
              aria-label="Selected day summary"
            >
              <div>
                <p className="text-sm text-emerald-100">
                  {date === localDate() ? "Today" : formatDate(date)}
                </p>
                <p className="mt-2">
                  <strong className="font-display text-5xl">
                    {total.toLocaleString()}
                  </strong>
                  <span className="ml-2 text-emerald-100">cal eaten</span>
                </p>
                <p className="mt-3 text-sm text-emerald-100">
                  {dayFoods.length
                    ? `${dayFoods.length} food ${dayFoods.length === 1 ? "entry" : "entries"} logged`
                    : "A fresh page. Start with your first meal."}
                </p>
              </div>
              <div className="max-w-sm flex-1">
                <p className="text-sm">
                  {data.target
                    ? `Daily guide: ${data.target.toLocaleString()} cal`
                    : "A target is optional — you can still track."}
                </p>
                {data.target ? (
                  <>
                    <div
                      className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"
                      role="meter"
                      aria-label="Calories eaten against target"
                      aria-valuemin={0}
                      aria-valuemax={data.target}
                      aria-valuenow={Math.min(total, data.target)}
                      aria-valuetext={`${total} calories eaten; target ${data.target}`}
                    >
                      <div
                        className="h-full rounded-full bg-emerald-200"
                        style={{
                          width: `${Math.min(100, (total / data.target) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-3 text-sm">
                      {total > data.target
                        ? `${total - data.target} cal above your guide. One day does not define progress.`
                        : `${data.target - total} cal to your guide. It is not a rule to skip meals.`}
                    </p>
                  </>
                ) : (
                  <Link
                    to="/calorie-calculator"
                    className="mt-3 inline-block min-h-11 underline underline-offset-4"
                  >
                    Estimate my calorie needs →
                  </Link>
                )}
              </div>
            </section>
            <section aria-label="Recent days" className="diary-card">
              <div className="mb-4 flex flex-wrap justify-between gap-2">
                <h2 className="text-xl">Your days at a glance</h2>
                <span className="text-sm text-slate-500">
                  Last 7 days ending {formatDate(date, true)}
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1 sm:gap-3">
                {week.map((day) => {
                  const entries = data.foods.filter(
                    (food) => food.date === day,
                  );
                  const calories = entries.reduce(
                    (sum, food) => sum + food.calories,
                    0,
                  );
                  return (
                    <button
                      key={day}
                      onClick={() => setDate(day)}
                      type="button"
                      aria-pressed={day === date}
                      aria-label={`${formatDate(day)}: ${entries.length ? `${calories} calories logged` : "not logged"}`}
                      className={`day-tile ${day === date ? "day-tile-active" : ""}`}
                    >
                      <span className="text-xs sm:text-sm">
                        {new Date(`${day}T12:00:00`).toLocaleDateString(
                          undefined,
                          { weekday: "short" },
                        )}
                      </span>
                      <strong className="mt-1 text-base sm:text-xl">
                        {new Date(`${day}T12:00:00`).getDate()}
                      </strong>
                      <span className="mt-2 text-[10px] sm:text-xs">
                        {entries.length ? `${calories} cal` : "No log"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Totals reflect what you logged, not necessarily everything you
                ate.
              </p>
            </section>
            <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_1fr]">
              <section className="diary-card">
                <p className="eyebrow">01 · Add what you ate</p>
                <h2 className="mt-2 text-2xl">Let’s log a meal</h2>
                <form onSubmit={submit} className="mt-5 space-y-5">
                  <fieldset disabled={busy} className="space-y-5">
                    <div>
                      <label htmlFor="meal" className="diary-label">
                        Which meal?
                      </label>
                      <select
                        id="meal"
                        className="diary-input"
                        value={meal}
                        onChange={(event) =>
                          setMeal(event.target.value as Meal)
                        }
                      >
                        {meals.map((name) => (
                          <option key={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2" aria-label="Entry method">
                      {(["search", "manual"] as const).map((method) => (
                        <button
                          className={`min-h-11 rounded-full px-4 text-sm font-semibold ${mode === method ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-600"}`}
                          type="button"
                          aria-pressed={mode === method}
                          key={method}
                          onClick={() => {
                            setMode(method);
                            setFoodId("");
                            setQuery("");
                            setValidation("");
                          }}
                        >
                          {method === "search"
                            ? "Find a food"
                            : "Use a food label"}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label htmlFor="food-name" className="diary-label">
                        {mode === "search"
                          ? "What did you eat?"
                          : "Food or meal name"}
                      </label>
                      <input
                        id="food-name"
                        maxLength={160}
                        className="diary-input"
                        placeholder={
                          mode === "search"
                            ? "Search rice, eggs, beans…"
                            : "e.g. Homemade bean stew"
                        }
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setFoodId("");
                          setValidation("");
                        }}
                        autoComplete="off"
                      />
                      {mode === "search" && suggestions.length > 0 && (
                        <ul className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200">
                          {suggestions.map((food) => (
                            <li key={food.id}>
                              <button
                                className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-emerald-50"
                                type="button"
                                onClick={() => chooseFood(food.id)}
                              >
                                <span>{food.name}</span>
                                <span className="shrink-0 text-xs text-slate-500">
                                  {food.caloriesPer100g} / 100 g
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {mode === "search" &&
                        query.trim() &&
                        !selected &&
                        !suggestions.length && (
                          <p className="mt-2 text-sm text-slate-600">
                            No match. Try a simpler name or use a food label
                            above.
                          </p>
                        )}
                      {mode === "search" && !query && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[
                            { id: "25", name: "Eggs" },
                            { id: "38", name: "Rice" },
                            { id: "30", name: "Lentils" },
                            { id: "41", name: "Oats" },
                          ].map((food) => (
                            <button
                              key={food.id}
                              type="button"
                              onClick={() => chooseFood(food.id)}
                              className="min-h-10 rounded-full border border-slate-200 px-3 text-sm text-slate-600 hover:bg-emerald-50"
                            >
                              + {food.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {mode === "search" && selected && (
                      <>
                        {portions[selected.id] && (
                          <div>
                            <label htmlFor="portion" className="diary-label">
                              Choose a familiar portion
                            </label>
                            <select
                              id="portion"
                              className="diary-input"
                              value={portion}
                              onChange={(event) => {
                                const serving = portions[selected.id].find(
                                  (option) =>
                                    option.label === event.target.value,
                                );
                                setPortion(event.target.value);
                                if (serving) setGrams(String(serving.grams));
                              }}
                            >
                              <option value="">Enter my own grams</option>
                              {portions[selected.id].map((serving) => (
                                <option
                                  key={serving.label}
                                  value={serving.label}
                                >
                                  {serving.label}
                                </option>
                              ))}
                            </select>
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              Cup and hand portions are estimates, not exact
                              measurements. A measuring cup is about 240 ml.
                            </p>
                          </div>
                        )}
                        <div>
                          <label htmlFor="grams" className="diary-label">
                            Amount in grams
                          </label>
                          <input
                            id="grams"
                            className="diary-input"
                            type="number"
                            min={1}
                            max={5000}
                            step="any"
                            value={grams}
                            onChange={(event) => {
                              setGrams(event.target.value);
                              setPortion("");
                            }}
                          />
                          <p className="mt-2 text-sm text-slate-600">
                            {Number.isFinite(preview) && Number(grams) > 0
                              ? `About ${preview} cal for this amount.`
                              : "Enter the amount you ate."}{" "}
                            Match cooked food to a cooked entry.
                          </p>
                        </div>
                      </>
                    )}
                    {mode === "manual" && (
                      <>
                        <div>
                          <label
                            htmlFor="manual-portion"
                            className="diary-label"
                          >
                            How much did you eat?
                          </label>
                          <input
                            id="manual-portion"
                            className="diary-input"
                            maxLength={160}
                            value={manualPortion}
                            onChange={(event) =>
                              setManualPortion(event.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="manual-calories"
                            className="diary-label"
                          >
                            Calories for that portion
                          </label>
                          <input
                            id="manual-calories"
                            className="diary-input"
                            type="number"
                            min={0}
                            max={20000}
                            step={1}
                            value={manualCalories}
                            onChange={(event) =>
                              setManualCalories(event.target.value)
                            }
                          />
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            Use the label’s calories for the amount you ate. If
                            it says 150 cal per serving and you ate two, enter
                            300.
                          </p>
                        </div>
                      </>
                    )}
                    {validation && (
                      <p className="text-sm text-rose-800" role="alert">
                        {validation}
                      </p>
                    )}
                    <button
                      className="diary-button w-full"
                      disabled={busy}
                      type="submit"
                    >
                      {busy ? "Saving…" : `Add to ${meal.toLowerCase()}`}
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
                <Link
                  to="/nutrition-guide#portions"
                  className="mt-5 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4"
                >
                  Not sure about portions? Start here →
                </Link>
              </section>
              <section className="diary-card">
                <p className="eyebrow">02 · See your day</p>
                <h2 className="mt-2 text-2xl">
                  {date === localDate()
                    ? "Today’s meals"
                    : formatDate(date, true)}
                </h2>
                {meals.map((name) => {
                  const entries = dayFoods.filter((food) => food.meal === name);
                  return (
                    <div
                      key={name}
                      className="mt-5 border-t border-slate-200 pt-4"
                    >
                      <div className="flex justify-between gap-2">
                        <h3 className="text-lg">{name}</h3>
                        <span className="text-sm font-semibold text-slate-600">
                          {entries.reduce(
                            (sum, entry) => sum + entry.calories,
                            0,
                          )}{" "}
                          cal
                        </span>
                      </div>
                      {entries.length ? (
                        <ul>
                          {entries.map((entry) => (
                            <li
                              key={entry.id}
                              className="mt-3 flex items-center gap-2"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">
                                  {entry.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {entry.portion}
                                </p>
                              </div>
                              <span className="text-sm tabular-nums">
                                {entry.calories}
                              </span>
                              <button
                                type="button"
                                className="min-h-11 min-w-11 rounded-full text-xl text-rose-700 hover:bg-rose-50 disabled:opacity-40"
                                aria-label={`Remove ${entry.name} from ${name}`}
                                disabled={busy}
                                onClick={async () => {
                                  if (
                                    await save({
                                      kind: "delete-food",
                                      id: entry.id,
                                    })
                                  )
                                    setFeedback(`Removed ${entry.name}.`);
                                }}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <button
                          type="button"
                          className="mt-2 min-h-11 text-sm text-emerald-800 underline underline-offset-4"
                          onClick={() => {
                            setMeal(name);
                            document.getElementById("food-name")?.focus();
                          }}
                        >
                          + Add {name.toLowerCase()}
                        </button>
                      )}
                    </div>
                  );
                })}
                <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  Still hungry? You do not need to ignore it. Add protein,
                  fibre-rich foods, and vegetables to make meals more
                  satisfying.{" "}
                  <Link
                    className="font-bold underline"
                    to="/nutrition-guide#meal-ideas"
                  >
                    Explore meal ideas.
                  </Link>
                </div>
              </section>
            </div>
          </>
        )}
        <p className="text-xs leading-6 text-slate-500">
          Logs are saved privately on the server and linked to this browser by a
          cookie, not an account. Clearing that cookie or changing devices means
          you cannot access this history. Calories and portions are estimates.{" "}
          <Link className="underline" to="/food-scale-tutorial">
            Food scale guide
          </Link>
        </p>
      </main>
    </div>
  );
}
