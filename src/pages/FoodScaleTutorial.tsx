import { Link } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import Section from "../components/Section";
import StepCard from "../components/StepCard";

const steps = [
  {
    title: "Place an empty container on the scale",
    description:
      "Choose a bowl or plate that fits comfortably. Put it in the middle of the scale before adding any food.",
    visual: "container" as const,
  },
  {
    title: "Press TARE to reset to zero",
    description:
      "TARE tells the scale to ignore the container’s weight. Check that the display reads 0 g.",
    visual: "tare" as const,
  },
  {
    title: "Add your food",
    description:
      "Add a little at a time until you reach the amount you want. If you add too much, simply take a little out.",
    visual: "food" as const,
  },
  {
    title: "Read the weight in grams",
    description:
      "Wait for the number to settle. Make sure the scale is set to grams (g), not ounces.",
    visual: "read" as const,
  },
  {
    title: "Find the matching food and log it",
    description:
      "In Today’s Foods, search for the same food and choose raw or cooked to match how you weighed it.",
    visual: "log" as const,
  },
];

export default function FoodScaleTutorial() {
  return (
    <main className="min-h-screen px-4 pb-16 pt-7 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            to="/food-logger"
          >
            <span aria-hidden="true">←</span> Today’s Foods
          </Link>
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            to="/calorie-calculator"
          >
            Calorie settings
          </Link>
        </div>

        <header className="mx-auto mt-8 max-w-3xl text-center sm:mt-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
            A practical guide · No perfection needed
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            How to Use a Food Scale
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            It may feel new at first, but it’s just a quick way to learn what
            portions look like. You don’t have to weigh food forever.
          </p>
          <nav aria-label="Tutorial sections" className="mt-7">
            <ul className="flex flex-wrap justify-center gap-2">
              {[
                ["#why-weigh", "Why weigh?"],
                ["#step-by-step", "How to"],
                ["#common-mistakes", "Mistakes"],
                ["#portion-examples", "Portions"],
                ["#scale-prices", "Choosing a scale"],
                ["#pro-tips", "Tips"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    href={href}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="mt-9 space-y-6 sm:mt-12 sm:space-y-8">
          <Section
            className="scroll-mt-6"
            eyebrow="01 · Why it helps"
            id="why-weigh"
            title="Why weigh your food?"
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-4 text-lg leading-8 text-slate-700">
                <p>
                  A photo can’t tell you how much food is on the plate. And
                  serving sizes can be hard to guess by eye—even when you’ve
                  eaten that food many times.
                </p>
                <p>
                  For example, two level tablespoons of peanut butter can be
                  around 30–35 g and roughly 190 calories, depending on the
                  brand. A quick scoop can easily be more than two tablespoons.
                </p>
                <p>
                  Weighing now and then helps you learn portions. It’s
                  information, not a judgment about what you eat.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-amber-950">
                    A small scoop adds up
                  </h3>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-sm font-medium text-slate-600">
                      About 2 level tbsp
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                      ~30–35 g
                    </p>
                    <p className="mt-1 text-base font-semibold text-amber-800">
                      ~190 cal
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-sm font-medium text-slate-600">
                      A generous scoop
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                      Can be more
                    </p>
                    <p className="mt-1 text-base font-semibold text-amber-800">
                      Check the label
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-amber-950">
                  Calories vary between brands. Use your jar’s label for the
                  most accurate number.
                </p>
              </div>
            </div>
          </Section>

          <Section
            className="scroll-mt-6"
            eyebrow="02 · Five simple steps"
            id="step-by-step"
            title="Step by step: weigh and log"
          >
            <p className="mb-6 text-lg leading-8 text-slate-600">
              These simple illustrations show the process. Most kitchen scales
              work in much the same way.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <StepCard
                  description={step.description}
                  key={step.title}
                  number={index + 1}
                  title={step.title}
                  visual={step.visual}
                />
              ))}
            </div>
          </Section>

          <Section
            className="scroll-mt-6"
            eyebrow="03 · Easy fixes"
            id="common-mistakes"
            title="Common mistakes (and what to do instead)"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                <h3 className="text-lg font-bold text-rose-950">Easy to do by accident</h3>
                <ul className="mt-4 space-y-3 text-base leading-7 text-rose-950 sm:text-lg">
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="font-bold">✗</span>
                    Weighing food on a plate without taring includes the plate’s
                    weight.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="font-bold">✗</span>
                    Logging raw meat as cooked (or the other way around) can
                    change the calorie estimate.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="font-bold">✗</span>
                    Guessing every portion can slowly make servings larger than
                    you intended.
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="text-lg font-bold text-emerald-950">A helpful habit</h3>
                <ul className="mt-4 space-y-3 text-base leading-7 text-emerald-950 sm:text-lg">
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="font-bold">✓</span>
                    Weigh meat raw when you can, then choose the raw entry in the
                    food list.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="font-bold">✓</span>
                    Or weigh it cooked and choose a matching cooked entry.
                    Cooking changes water weight.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true" className="font-bold">✓</span>
                    Tare your container first; you can keep using it to weigh
                    ingredients one at a time.
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          <Section
            className="scroll-mt-6"
            eyebrow="04 · Portion pictures"
            id="portion-examples"
            title="What do these weights look like?"
          >
            <p className="mb-6 text-lg leading-8 text-slate-600">
              These are rough visual comparisons—food shape, packing, and
              measuring spoons all make a difference.
            </p>
            <ImageGallery />
            <p className="mt-5 rounded-2xl bg-sky-50 px-5 py-4 text-base leading-7 text-sky-950">
              Spoon measures are especially approximate: 100 g of peanut butter
              is closer to 6–7 tablespoons, not 2; 100 g of olive oil is about 7
              tablespoons, not 4. The scale gives the weight; your food label
              gives the calorie information.
            </p>
          </Section>

          <Section
            className="scroll-mt-6"
            eyebrow="05 · Buying a scale"
            id="scale-prices"
            title="Cheap or expensive? Either can work."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  A basic scale
                </p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">#8,000</p>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Usually enough for everyday portions. Many are accurate to
                  about 1–5 g, though it depends on the model.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  A pricier scale
                </p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">~#15,000</p>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  May offer extra features or finer increments. It isn’t
                  necessary for learning everyday portions.
                </p>
              </div>
            </div>
            <p className="mt-5 rounded-2xl bg-emerald-50 px-5 py-4 text-lg font-bold leading-7 text-emerald-950 sm:text-xl">
              Recommendation: Get any scale you like and use it consistently.
            </p>
          </Section>

          <Section
            className="scroll-mt-6"
            eyebrow="06 · Keep it manageable"
            id="pro-tips"
            title="Pro tips: learn, then make it your own"
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                ["Start by weighing", "Weigh common foods while you’re learning. It can take a few weeks to get familiar with portions."],
                ["You don’t have to weigh forever", "Once you recognize portions, you may be comfortable estimating many everyday meals."],
                ["Check in when useful", "On harder-to-estimate meals or days when you want extra clarity, weigh again."],
                ["Aim for consistency", "A helpful routine matters more than perfectly precise numbers every time."],
              ].map(([title, description], index) => (
                <li className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5" key={title}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-900">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-base leading-7 text-slate-600">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-xl font-bold text-emerald-900 sm:text-2xl">
              You don’t have to weigh forever. Consistency beats perfection.
            </p>
          </Section>
        </div>

        <footer className="mt-8 rounded-3xl bg-slate-900 px-6 py-9 text-center text-white sm:mt-12 sm:px-10 sm:py-11">
          <p className="text-2xl font-bold sm:text-3xl">Ready to try it?</p>
          <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-300">
            Add a food to today’s log. You can learn one portion at a time.
          </p>
          <Link
            className="mt-6 inline-flex min-h-14 items-center justify-center rounded-full bg-emerald-400 px-7 py-4 text-lg font-bold text-emerald-950 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            to="/food-logger"
          >
            Go to Today’s Foods <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
