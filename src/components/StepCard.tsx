type StepCardProps = {
  number: number;
  title: string;
  description: string;
  visual: "container" | "tare" | "food" | "read" | "log";
};

function StepIllustration({ visual }: { visual: StepCardProps["visual"] }) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 3,
  };

  return (
    <svg
      aria-hidden="true"
      className="h-36 w-full text-emerald-800 sm:h-40"
      fill="none"
      viewBox="0 0 240 150"
    >
      <rect x="26" y="15" width="188" height="120" rx="20" fill="#ecfdf5" />
      <path d="M46 111h148" stroke="#cbd5e1" strokeWidth="3" />
      {visual === "container" && (
        <>
          <path d="M76 59h88l-8 43H84l-8-43Z" fill="#fff" stroke="#047857" strokeWidth="3" />
          <path d="M69 59h102M88 50h64" {...shared} />
          <rect x="99" y="109" width="42" height="11" rx="4" fill="#64748b" />
          <text x="120" y="128" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">
            SCALE
          </text>
          <path d="M92 42c7-8 14-8 21 0m14 0c7-8 14-8 21 0" {...shared} stroke="#10b981" />
        </>
      )}
      {visual === "tare" && (
        <>
          <path d="M73 63h94l-8 39H81l-8-39Z" fill="#fff" stroke="#047857" strokeWidth="3" />
          <rect x="99" y="109" width="42" height="11" rx="4" fill="#64748b" />
          <rect x="103" y="79" width="34" height="16" rx="4" fill="#0f172a" />
          <text x="120" y="91" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="700">
            0 g
          </text>
          <rect x="150" y="47" width="39" height="16" rx="8" fill="#059669" />
          <text x="169.5" y="58" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">
            TARE
          </text>
          <path d="M170 68v12" {...shared} stroke="#059669" />
        </>
      )}
      {visual === "food" && (
        <>
          <path d="M75 87h90l-7 18H82l-7-18Z" fill="#fff" stroke="#047857" strokeWidth="3" />
          <path d="M84 82c0-13 12-20 20-10 6-17 27-15 31 0 13-8 24 1 21 10" fill="#86efac" stroke="#047857" strokeWidth="3" />
          <rect x="99" y="109" width="42" height="11" rx="4" fill="#64748b" />
          <path d="M120 42v17m-7-7 7 7 7-7" {...shared} stroke="#059669" />
          <text x="120" y="76" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="700">
            ADD FOOD
          </text>
        </>
      )}
      {visual === "read" && (
        <>
          <path d="M73 63h94l-8 39H81l-8-39Z" fill="#fff" stroke="#047857" strokeWidth="3" />
          <rect x="94" y="76" width="52" height="21" rx="4" fill="#0f172a" />
          <text x="120" y="91" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="700">
            150 g
          </text>
          <rect x="99" y="109" width="42" height="11" rx="4" fill="#64748b" />
          <path d="m168 46 8 8 15-18" {...shared} stroke="#059669" />
        </>
      )}
      {visual === "log" && (
        <>
          <rect x="79" y="35" width="82" height="76" rx="12" fill="#fff" stroke="#047857" strokeWidth="3" />
          <path d="M96 58h47m-47 14h35m-35 14h42" {...shared} stroke="#94a3b8" />
          <path d="m138 96 7 7 13-16" {...shared} stroke="#059669" />
          <rect x="102" y="117" width="36" height="10" rx="5" fill="#10b981" />
        </>
      )}
    </svg>
  );
}

export default function StepCard({
  number,
  title,
  description,
  visual,
}: StepCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-40 items-center justify-center bg-emerald-50 px-4">
        <StepIllustration visual={visual} />
      </div>
      <div className="p-5">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
          Step {number}
        </p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-base leading-7 text-slate-600">{description}</p>
      </div>
    </article>
  );
}
