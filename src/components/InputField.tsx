import type { ChangeEvent } from "react";

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  error?: string;
};

const controlClasses =
  "min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200";

export default function InputField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  error,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-base font-semibold text-slate-800" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
          className={`${controlClasses} ${unit ? "pr-16" : ""} ${
            error ? "border-rose-500 focus:border-rose-600 focus:ring-rose-200" : ""
          }`}
          id={id}
          max={max}
          min={min}
          onChange={onChange}
          step={step}
          type="number"
          value={value}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base text-slate-500">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm font-medium text-rose-700" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export { controlClasses };
