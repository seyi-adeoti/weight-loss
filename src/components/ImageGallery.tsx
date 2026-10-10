type Portion = {
  title: string;
  amount: string;
  description: string;
  kind: "chicken" | "rice" | "peanut" | "oil";
};

const portions: Portion[] = [
  {
    title: "Cooked chicken breast",
    amount: "100 g",
    description: "Roughly a palm-sized portion, often compared to a deck of cards.",
    kind: "chicken",
  },
  {
    title: "Cooked rice",
    amount: "150 g",
    description: "Around ¾–1 cup, depending on the rice and how it’s packed.",
    kind: "rice",
  },
  {
    title: "Peanut butter",
    amount: "100 g",
    description: "About 6–7 level tablespoons. Two tablespoons is closer to 30–35 g.",
    kind: "peanut",
  },
  {
    title: "Olive oil",
    amount: "100 g",
    description: "About 7 tablespoons by weight. Four tablespoons is closer to 55 g.",
    kind: "oil",
  },
];

function PortionIllustration({ kind }: { kind: Portion["kind"] }) {
  if (kind === "chicken") {
    return (
      <svg aria-hidden="true" className="h-28 w-32" viewBox="0 0 128 100">
        <rect fill="#fef3c7" height="84" rx="22" width="116" x="6" y="8" />
        <path
          d="M37 58c-5-9 4-24 18-30 13-5 29 0 34 10l-8 8 13 8c6 4 5 13-2 16l-15-6c-8 8-33 11-40-6Z"
          fill="#f8d7a0"
          stroke="#b45309"
          strokeWidth="3"
        />
        <path d="M90 47l13-5m-8 13 13 1" stroke="#b45309" strokeLinecap="round" strokeWidth="3" />
        <path d="M28 78h72" stroke="#fff" strokeLinecap="round" strokeWidth="3" />
      </svg>
    );
  }
  if (kind === "rice") {
    return (
      <svg aria-hidden="true" className="h-28 w-32" viewBox="0 0 128 100">
        <rect fill="#ecfdf5" height="84" rx="22" width="116" x="6" y="8" />
        <path d="M32 47h64l-8 31H40l-8-31Z" fill="#fff" stroke="#047857" strokeWidth="3" />
        <path d="M35 48c5-15 14-17 19-8 7-14 18-12 23-2 8-11 18-6 20 10" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
        <path d="M44 52v18m11-21v22m12-24v24m12-23v23m11-21v19" stroke="#cbd5e1" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === "peanut") {
    return (
      <svg aria-hidden="true" className="h-28 w-32" viewBox="0 0 128 100">
        <rect fill="#fff7ed" height="84" rx="22" width="116" x="6" y="8" />
        <path d="M38 37h52l-5 41H43l-5-41Z" fill="#fff" stroke="#9a3412" strokeWidth="3" />
        <path d="M36 37h56" stroke="#9a3412" strokeWidth="4" />
        <path d="M47 29c3-8 8 5 12-2s8 7 13-1 9 4 12-1" fill="none" stroke="#d97706" strokeLinecap="round" strokeWidth="6" />
        <path d="M52 53h23" stroke="#fed7aa" strokeLinecap="round" strokeWidth="3" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" className="h-28 w-32" viewBox="0 0 128 100">
      <rect fill="#f0f9ff" height="84" rx="22" width="116" x="6" y="8" />
      <path d="M54 26h20l-2 11 11 13v26H45V50l11-13-2-11Z" fill="#fff" stroke="#0369a1" strokeWidth="3" />
      <path d="M49 57h38v19H49z" fill="#fde68a" />
      <path d="M51 31h26" stroke="#0369a1" strokeWidth="3" />
      <path d="M63 40v10" stroke="#d97706" strokeLinecap="round" strokeWidth="3" />
      <path d="M43 82h42" stroke="#94a3b8" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export default function ImageGallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {portions.map((portion) => (
        <figure
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          key={portion.kind}
        >
          <div className="flex min-h-36 items-center justify-center bg-slate-50">
            <PortionIllustration kind={portion.kind} />
          </div>
          <figcaption className="p-4">
            <p className="text-base font-semibold text-slate-800">{portion.title}</p>
            <p className="mt-1 text-xl font-extrabold text-emerald-800">
              {portion.amount}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {portion.description}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
