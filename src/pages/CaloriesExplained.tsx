import { Link } from "react-router-dom";
import AnimatedCircle from "../components/AnimatedCircle";
import Section from "../components/Section";
import SimpleTable from "../components/SimpleTable";

const mathRows = [
  {
    dailyChange: "About 500 fewer",
    weeklyEstimate: "About 1 lb",
    note: "A common estimate, not a promise.",
  },
  {
    dailyChange: "About 250 fewer",
    weeklyEstimate: "About 0.5 lb",
    note: "A smaller, gradual change.",
  },
];

const pageLinks = [
  { href: "#calories-basics", label: "The basics" },
  { href: "#real-example", label: "An example" },
  { href: "#weight-loss-math", label: "The math" },
  { href: "#important-truth", label: "The truth" },
];

export default function CaloriesExplained() {
  return (
    <main className="min-h-screen px-4 pb-20 pt-8 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-5xl">
        <Link to="/nutrition-guide" className="mb-6 inline-flex min-h-11 items-center text-sm font-semibold text-emerald-800">← Food, portions &amp; beginner guide</Link>
        <header className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
            A friendly beginner’s guide
          </p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            What Are Calories?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-slate-600 sm:text-2xl">
            Why understanding this changes everything
          </p>
          <nav aria-label="On this page" className="mt-8">
            <ul className="flex flex-wrap justify-center gap-2">
              {pageLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    href={href}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="mt-10 space-y-6 sm:mt-14 sm:space-y-8">
          <Section
            id="calories-basics"
            eyebrow="01 · The simple definition"
            title="A calorie is just energy."
          >
            <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5 text-lg leading-8 text-slate-700 sm:text-xl">
                <p>When you eat food, your body gets energy to:</p>
                <ul className="grid grid-cols-2 gap-3">
                  {["Walk around", "Think", "Sleep", "Breathe"].map((activity) => (
                    <li
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-800"
                      key={activity}
                    >
                      <span aria-hidden="true" className="mr-2 text-emerald-700">
                        •
                      </span>
                      {activity}
                    </li>
                  ))}
                </ul>
                <p>Everything your body does uses some of that energy.</p>
                <div className="space-y-3 rounded-2xl bg-slate-50 p-5">
                  <p className="rounded-xl border-l-4 border-rose-400 bg-rose-50 px-4 py-3 text-rose-950">
                    If you regularly take in more energy than your body uses,
                    your weight may go up.
                  </p>
                  <p className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-emerald-950">
                    If you take in a little less energy than your body uses,
                    your weight may go down over time.
                  </p>
                </div>
              </div>
              <div
                aria-label="Food brings energy in, and your body uses energy for everyday life"
                className="relative mx-auto grid w-full max-w-sm grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-3xl bg-sky-50 p-5 sm:p-6"
              >
                <div className="energy-flow energy-flow-forward absolute left-[23%] right-[23%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-300" />
                <div className="relative z-10 flex flex-col items-center gap-2 rounded-2xl bg-white/90 p-3 text-center shadow-sm">
                  <span aria-hidden="true" className="text-sm font-bold uppercase tracking-wide text-emerald-800">
                    Food
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    Food gives
                    <br />
                    energy
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="relative z-10 flex size-12 flex-col items-center justify-center rounded-full bg-white shadow-sm"
                >
                  <span className="size-3 rounded-full bg-emerald-700" />
                  <span className="mt-0.5 h-4 w-1 rounded-full bg-emerald-700" />
                </span>
                <div className="relative z-10 flex flex-col items-center gap-2 rounded-2xl bg-white/90 p-3 text-center shadow-sm">
                  <span aria-hidden="true" className="text-sm font-bold uppercase tracking-wide text-sky-800">
                    Energy
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    Your body
                    <br />
                    uses energy
                  </span>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="real-example"
            eyebrow="02 · A real example"
            title="Picture your body’s energy like a daily budget."
          >
            <p className="mb-7 text-lg leading-8 text-slate-700 sm:text-xl">
              If your body uses around 2,000 calories in a day, here’s what
              different amounts of food might mean over time:
            </p>
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-4">
              <AnimatedCircle
                label="Eat about"
                amount="2,000"
                detail="In and out are close. Weight may stay around the same."
                tone="green"
              />
              <AnimatedCircle
                label="Eat about"
                amount="2,500"
                detail="About 500 extra that day. Over time, extra energy may be stored and weight may go up."
                tone="rose"
                delay="100ms"
              />
              <AnimatedCircle
                label="Eat about"
                amount="1,500"
                detail="About 500 less that day. Over time, your body may use stored energy and weight may go down."
                tone="blue"
                delay="200ms"
              />
            </div>
            <p className="mt-6 rounded-2xl bg-amber-50 px-5 py-4 text-base leading-7 text-amber-950 sm:text-lg">
              <span aria-hidden="true" className="font-bold">Note: </span>
              The 2,000-calorie example is just to explain the idea. People’s
              needs are different, and one day doesn’t decide your weight.
            </p>
          </Section>

          <Section
            id="weight-loss-math"
            eyebrow="03 · The weight loss math"
            title="A useful rule of thumb—not an exact promise."
          >
            <div className="mb-7 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
              <p className="text-lg leading-8 text-sky-950 sm:text-xl">
                One pound of body fat is often estimated at about 3,500
                calories. That gives us a simple way to think about energy
                changes:
              </p>
            </div>
            <SimpleTable rows={mathRows} />
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              Bodies aren’t calculators: water, health, and other factors can
              change what the scale shows. A steady, manageable pace is more
              useful than chasing an exact number.
            </p>
          </Section>

          <Section
            id="important-truth"
            eyebrow="04 · The important truth"
            title="Simple doesn’t always mean easy—and that’s okay."
            className="border-emerald-200"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TruthCard>
                You can enjoy pizza and still work toward weight loss. One food
                doesn’t decide your progress.
              </TruthCard>
              <TruthCard>
                Exercise is great for your health, but it can’t reliably cancel
                out eating more than your body uses.
              </TruthCard>
              <TruthCard>
                You don’t need a fancy diet. Small, sustainable changes can be a
                good place to start.
              </TruthCard>
              <TruthCard>
                Progress can be slow and uneven. That doesn’t mean your effort
                isn’t real.
              </TruthCard>
            </div>
            <p className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4 text-lg font-medium leading-8 text-emerald-950 sm:text-xl">
              No shame, no magic tricks. Just small steps you can keep going
              with.
            </p>
          </Section>
        </div>

        <footer className="mt-10 rounded-3xl bg-slate-900 px-6 py-9 text-center text-white sm:mt-14 sm:px-10 sm:py-12">
          <p className="text-2xl font-bold sm:text-3xl">
            Ready for your next step?
          </p>
          <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
            Let’s find a gentle starting point that makes sense for you.
          </p>
          <Link
            className="mt-7 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-4 text-lg font-bold text-emerald-950 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-xl"
            to="/calorie-quiz"
          >
            Let’s Calculate Your Calorie Target
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-400">
            Calorie needs vary. If you have a medical condition, are pregnant,
            or have a history of disordered eating, consider talking with a
            qualified health professional before making changes.
          </p>
        </footer>
      </div>
    </main>
  );
}

function TruthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-lg leading-7 text-slate-800 sm:text-xl">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-base font-bold text-white"
      >
        ✓
      </span>
      <p>{children}</p>
    </div>
  );
}
