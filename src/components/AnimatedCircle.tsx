type CircleTone = "green" | "amber" | "rose" | "blue";

type AnimatedCircleProps = {
  label: string;
  amount: string;
  detail: string;
  tone?: CircleTone;
  delay?: string;
};

const tones: Record<CircleTone, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  rose: "border-rose-200 bg-rose-50 text-rose-900",
  blue: "border-sky-200 bg-sky-50 text-sky-900",
};

export default function AnimatedCircle({
  label,
  amount,
  detail,
  tone = "green",
  delay = "0ms",
}: AnimatedCircleProps) {
  return (
    <div
      className={`circle-pop flex min-h-48 flex-col items-center justify-center rounded-full border-2 p-5 text-center shadow-sm ${tones[tone]}`}
      style={{ animationDelay: delay }}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-current opacity-60" />
      <p className="mt-2 text-sm font-semibold uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums">{amount}</p>
      <p className="mt-1 text-sm leading-5">{detail}</p>
    </div>
  );
}
