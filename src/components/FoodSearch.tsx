import { useState, type FormEvent } from "react";
import foodsData from "../data/foods.json";

export type Food = (typeof foodsData)[number];

type FoodSearchProps = {
  onAdd: (food: Food, grams: number) => void;
};

export default function FoodSearch({ onAdd }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [grams, setGrams] = useState("100");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [message, setMessage] = useState("");
  const suggestions =
    query.trim().length > 0
      ? foodsData
          .filter((food) => food.name.toLowerCase().includes(query.trim().toLowerCase()))
          .slice(0, 7)
      : [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(grams);

    if (!selectedFood || !Number.isFinite(amount) || amount <= 0 || amount > 5000) {
      setMessage(
        !selectedFood
          ? "Choose a food from the suggestions first."
          : "Enter an amount from 1 to 5,000 grams.",
      );
      return;
    }

    onAdd(selectedFood, amount);
    setQuery("");
    setGrams("100");
    setSelectedFood(null);
    setMessage("");
  }

  return (
    <form
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
        Add a food
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem_auto] sm:items-end">
        <div className="relative">
          <label
            className="mb-2 block text-base font-semibold text-slate-800"
            htmlFor="food-search"
          >
            Search foods
          </label>
          <input
            autoComplete="off"
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
            id="food-search"
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedFood(null);
              setMessage("");
            }}
            placeholder="Try chicken, rice, apple…"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="food-suggestions"
            aria-expanded={suggestions.length > 0}
            value={selectedFood?.name ?? query}
          />
          {suggestions.length > 0 && (
            <ul
              className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
              id="food-suggestions"
              role="listbox"
            >
              {suggestions.map((food) => (
                <li key={food.id}>
                  <button
                    className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-base text-slate-800 hover:bg-emerald-50 focus-visible:bg-emerald-50 focus-visible:outline-none"
                    onClick={() => {
                      setSelectedFood(food);
                      setQuery(food.name);
                    }}
                    role="option"
                    aria-selected={selectedFood?.id === food.id}
                    type="button"
                  >
                    <span>{food.name}</span>
                    <span className="shrink-0 text-sm text-slate-500">
                      {food.caloriesPer100g} cal / 100 g
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label
            className="mb-2 block text-base font-semibold text-slate-800"
            htmlFor="food-grams"
          >
            Weight (grams)
          </label>
          <input
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
            id="food-grams"
            max={5000}
            min={1}
            onChange={(event) => setGrams(event.target.value)}
            step={1}
            type="number"
            value={grams}
          />
        </div>

        <button
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-7 py-3 text-lg font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          type="submit"
        >
          Add
        </button>
      </div>
      {message && (
        <p className="mt-3 text-base font-medium text-rose-700" role="alert">
          {message}
        </p>
      )}
      <p className="mt-4 text-base leading-7 text-slate-600">
        <span aria-hidden="true" className="font-bold">Tip: </span>
        Quick tip: Weigh raw food, not cooked. Choose the matching raw or cooked
        entry when it’s available.
      </p>
    </form>
  );
}
