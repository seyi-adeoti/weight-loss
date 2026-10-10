import { useState, type FormEvent } from "react";

type WeightInputFormProps = {
  onLog: (date: string, weight: number) => void;
};

function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export default function WeightInputForm({ onLog }: WeightInputFormProps) {
  const [date, setDate] = useState(getTodayKey);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(weight);
    if (!date || date > getTodayKey()) {
      setError("Choose today or an earlier date.");
      return;
    }
    if (!Number.isFinite(amount) || amount < 20 || amount > 500) {
      setError("Enter a weight from 20 to 500 kg.");
      return;
    }
    onLog(date, Math.round(amount * 10) / 10);
    setWeight("");
    setError("");
  }

  return (
    <form
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      onSubmit={submit}
    >
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Log a weigh-in</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label
            className="mb-2 block text-base font-semibold text-slate-800"
            htmlFor="weight-date"
          >
            Date
          </label>
          <input
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
            id="weight-date"
            max={getTodayKey()}
            onChange={(event) => setDate(event.target.value)}
            required
            type="date"
            value={date}
          />
        </div>
        <div>
          <label
            className="mb-2 block text-base font-semibold text-slate-800"
            htmlFor="weight-value"
          >
            Weight (kg)
          </label>
          <input
            className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
            id="weight-value"
            max={500}
            min={20}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="e.g. 85.5"
            required
            step={0.1}
            type="number"
            value={weight}
          />
        </div>
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-lg font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          type="submit"
        >
          Log Weight
        </button>
      </div>
      {error && (
        <p className="mt-3 text-base font-medium text-rose-700" role="alert">
          {error}
        </p>
      )}
      <p className="mt-4 text-base leading-7 text-slate-600">
        <span aria-hidden="true" className="font-bold">Tip: </span>
        Weigh at the same time each day when you can—morning, before eating, is
        a common choice.
      </p>
    </form>
  );
}
