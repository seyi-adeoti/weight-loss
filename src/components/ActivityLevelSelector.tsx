import { controlClasses } from "./InputField";

export const activityLevels = [
  { value: "sedentary", label: "Sedentary", detail: "Mostly sitting, little planned exercise" },
  { value: "light", label: "Lightly Active", detail: "Light movement or exercise 1–3 days a week" },
  { value: "moderate", label: "Moderately Active", detail: "Moderate exercise 3–5 days a week" },
  { value: "very", label: "Very Active", detail: "Hard exercise or active work most days" },
] as const;

export type ActivityLevel = (typeof activityLevels)[number]["value"];

type ActivityLevelSelectorProps = {
  value: ActivityLevel;
  onChange: (value: ActivityLevel) => void;
};

export default function ActivityLevelSelector({
  value,
  onChange,
}: ActivityLevelSelectorProps) {
  return (
    <div>
      <label
        className="mb-2 block text-base font-semibold text-slate-800"
        htmlFor="activity"
      >
        Activity level
      </label>
      <select
        className={controlClasses}
        id="activity"
        onChange={(event) => onChange(event.target.value as ActivityLevel)}
        value={value}
      >
        {activityLevels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label} — {level.detail}
          </option>
        ))}
      </select>
    </div>
  );
}
