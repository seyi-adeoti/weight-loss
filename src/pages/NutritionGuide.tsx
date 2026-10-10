import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TrackerNavigation from "../components/TrackerNavigation";
import PortionQuiz from "../components/PortionQuiz";
import { mealCalories, mealIdeas } from "../data/mealIdeas";

const nutrients = [
  {
    name: "Carbs",
    title: "Fuel, not the enemy.",
    description:
      "Carbohydrates are a main source of energy for your brain and body. They include starches, sugars, and fibre. You do not need to cut out rice, bread, or potatoes.",
    examples: "Rice · oats · potatoes · wholemeal bread · fruit",
    tip: "Budget basics: oats, rice, and potatoes. Choose wholegrain options when practical for extra fibre; white rice can still fit.",
    action:
      "Try a quarter of your plate of rice or potatoes, alongside protein and vegetables.",
    color: "amber",
  },
  {
    name: "Protein",
    title: "Build, repair, and stay satisfied.",
    description:
      "Protein helps your body build and repair tissues, including muscle. Including some with a meal can help it feel more satisfying. Expensive powders are not necessary.",
    examples: "Beans · lentils · eggs · fish · chicken · tofu · yogurt",
    tip: "Budget basics: lentils, canned beans, eggs, and tinned fish. Beans and lentils give you fibre as well as protein.",
    action:
      "Add a palm-sized protein portion, or a serving of beans or lentils, to your main meals.",
    color: "rose",
  },
  {
    name: "Fibre",
    title: "Make room for the filling stuff.",
    description:
      "Fibre is a type of carbohydrate found in plant foods that your body does not fully digest. It supports bowel health, and fibre-rich foods can help you feel fuller.",
    examples: "Beans · lentils · vegetables · fruit · oats · whole grains",
    tip: "Budget basics: frozen vegetables, oats, cabbage, carrots, and beans. Increase fibre gradually and drink fluids regularly.",
    action:
      "Try adding a handful of vegetables or a piece of fruit instead of only making your meal smaller.",
    color: "green",
  },
  {
    name: "Fats",
    title: "A little goes a long way.",
    description:
      "Fat supports your body and helps it absorb certain vitamins. Oils, nuts, and seeds can be nutritious, but they are energy-dense: small amounts contain more calories.",
    examples: "Olive oil · nuts · seeds · avocado · oily fish",
    tip: "You do not need to avoid fat. Measure cooking oil rather than pouring without noticing the amount.",
    action:
      "Use a small amount of oil or a modest portion of nuts, alongside the rest of your meal.",
    color: "amber",
  },
];

export default function NutritionGuide() {
  const [nutrient, setNutrient] = useState(0);
  const [filter, setFilter] = useState("All meals");
  const location = useLocation();
  const current = nutrients[nutrient];
  useEffect(() => {
    if (location.hash)
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <TrackerNavigation />
      <main className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <header className="learn-hero">
          <div>
            <p className="eyebrow">Small steps. Satisfying meals.</p>
            <h1 className="mt-4 text-5xl leading-[1.08] sm:text-6xl">
              Eat well.
              <br />
              <span className="text-emerald-700">Stay comfortably full.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-slate-600">
              No food rules to memorise. Learn what goes on your plate, find
              everyday meals you can afford, and track one day at a time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="diary-button" href="#portions">
                Start with your plate →
              </a>
              <Link
                className="min-h-12 rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700"
                to="/food-logger"
              >
                Open my diary
              </Link>
            </div>
            <Link
              className="mt-5 inline-block min-h-11 text-sm text-emerald-800 underline underline-offset-4"
              to="/calories-explained"
            >
              Completely new? Learn what calories mean.
            </Link>
          </div>
          <div className="plate-note">
            <div
              className="portion-plate"
              role="img"
              aria-label="A balanced plate: half non-starchy vegetables, a quarter protein, a quarter starchy carbohydrates"
            >
              <div className="plate-veg">
                <span>
                  ½<br />
                  <small>vegetables</small>
                </span>
              </div>
              <div className="plate-protein">
                <span>
                  ¼<br />
                  <small>protein</small>
                </span>
              </div>
              <div className="plate-carb">
                <span>
                  ¼<br />
                  <small>carbs</small>
                </span>
              </div>
            </div>
            <p className="mt-5 text-center font-display text-xl">
              A starting point, not a strict rule.
            </p>
          </div>
        </header>
        <nav
          aria-label="In this beginner guide"
          className="flex flex-wrap gap-2"
        >
          {[
            { id: "food-basics", label: "01 · Food basics" },
            { id: "portions", label: "02 · Portions" },
            { id: "meal-ideas", label: "03 · Meal ideas" },
            { id: "portion-quiz", label: "04 · Practice" },
          ].map((item) => (
            <a
              key={item.id}
              className="min-h-11 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:border-emerald-400"
              href={`#${item.id}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <section id="food-basics" className="diary-card scroll-mt-6">
          <p className="eyebrow">01 · Know your food</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">Every part has a job.</h2>
          <p className="mt-3 text-slate-600">
            Tap a nutrient to learn what it does, where to find it, and how to
            use it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Nutrients">
            {nutrients.map((item, index) => (
              <button
                type="button"
                key={item.name}
                aria-pressed={nutrient === index}
                className={`min-h-12 rounded-full px-5 font-semibold ${nutrient === index ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-emerald-50"}`}
                onClick={() => setNutrient(index)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h3 className="text-2xl">{current.title}</h3>
              <p className="mt-4 leading-8 text-slate-700">
                {current.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-emerald-800">
                {current.examples}
              </p>
            </div>
            <div className={`nutrient-note nutrient-${current.color}`}>
              <p className="text-xs font-bold uppercase tracking-widest">
                Keep it practical
              </p>
              <p className="mt-3 text-sm leading-7">{current.tip}</p>
              <p className="mt-4 border-t border-current/15 pt-4 text-sm font-semibold leading-7">
                {current.action}
              </p>
            </div>
          </div>
        </section>
        <section
          id="portions"
          className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-9"
        >
          <p className="eyebrow">02 · Build your plate</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">
            Portion control is not “eat as little as possible”.
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-slate-600">
            It means noticing how much you eat and building a meal that meets
            your needs. Start with this flexible guide, then adjust for hunger,
            activity, and your body.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl bg-emerald-50 p-6">
              <h3 className="text-2xl text-emerald-900">½ plate: vegetables</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Use non-starchy vegetables like cabbage, carrots, broccoli,
                spinach, or tomatoes. They add volume and fibre. Potatoes belong
                with the starchy carbs, not this half.
              </p>
              <h3 className="mt-6 text-2xl text-emerald-900">
                ¼ protein + ¼ starchy carbs
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Try chicken and rice, fish and potatoes, or lentils and rice.
                Beans and lentils contain both protein and carbs — food groups
                can overlap, and that is fine.
              </p>
              <p className="mt-5 border-t border-emerald-200 pt-4 text-sm leading-7 text-slate-700">
                Add a little fat for flavour. Fruit and milk, yogurt, or a
                suitable fortified alternative can fit elsewhere in your day.
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-6">
              <h3 className="text-2xl">No scale? Use your hand.</h3>
              <ul className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
                <li>
                  <strong>Two fists:</strong> a visual starting point for
                  vegetables.
                </li>
                <li>
                  <strong>One palm:</strong> a rough starting portion for meat,
                  fish, or tofu.
                </li>
                <li>
                  <strong>One cupped hand:</strong> a rough starting portion of
                  cooked rice or pasta.
                </li>
                <li>
                  <strong>One thumb:</strong> a visual cue for an added fat
                  portion.
                </li>
              </ul>
              <p className="mt-5 text-xs leading-6 text-amber-950">
                Hand sizes and food density vary. These cues do not give exact
                grams or calories, and they are not limits on how much you can
                eat.
              </p>
              <Link
                className="mt-3 inline-block min-h-11 text-sm font-semibold text-emerald-800 underline underline-offset-4"
                to="/food-scale-tutorial"
              >
                Want more precision? Learn to use a scale →
              </Link>
            </div>
          </div>
          <div className="mt-6 rounded-xl border-l-4 border-emerald-500 bg-slate-50 p-5">
            <p className="font-semibold">For stew, soup, or a mixed bowl</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Use the same idea for the ingredients: plenty of vegetables, a
              protein source, and a portion of starch. You do not need to
              separate them on the plate. Notice oils, sauces, and drinks too —
              they can add calories.
            </p>
          </div>
        </section>
        <section id="meal-ideas" className="scroll-mt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">03 · More food, thoughtful portions</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">
                Filling doesn’t have to be expensive.
              </h2>
            </div>
          </div>
          <p className="mt-4 max-w-2xl leading-8 text-slate-600">
            Combine protein and fibre with water-rich vegetables or fruit. A
            large bowl can have fewer calories than a small energy-dense snack,
            but no meal can guarantee you will not feel hungry.
          </p>
          <div
            className="mt-5 flex flex-wrap gap-2"
            aria-label="Filter meal ideas"
          >
            {[
              "All meals",
              "Breakfast",
              "Lunch & dinner",
              "Snacks",
              "Plant-based",
            ].map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold ${filter === option ? "bg-emerald-700 text-white" : "border border-slate-200 bg-white text-slate-600"}`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {mealIdeas
              .filter(
                (idea) =>
                  filter === "All meals" ||
                  (filter === "Plant-based"
                    ? idea.plantBased
                    : idea.category === filter),
              )
              .map((idea) => (
                <article key={idea.name} className="meal-card">
                  <div className={`meal-strip meal-strip-${idea.color}`}>
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {idea.category}
                      {idea.plantBased ? " · Plant-based" : ""}
                    </span>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                      About {mealCalories(idea.ingredients)} cal
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl">{idea.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {idea.why}
                    </p>
                    <details className="mt-4 rounded-xl bg-slate-50 p-4">
                      <summary className="cursor-pointer text-sm font-semibold">
                        See one example portion
                      </summary>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {idea.ingredients.map((ingredient) => (
                          <li key={ingredient.id}>{ingredient.label}</li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs leading-6 text-slate-500">
                        Calories are calculated from the food reference list for
                        these amounts, including the listed oil. Brands, swaps,
                        cooking methods, and extra sauces change the total.
                      </p>
                    </details>
                    <p className="mt-4 text-sm leading-6 text-emerald-800">
                      <strong>Spend less:</strong> {idea.budget}
                    </p>
                  </div>
                </article>
              ))}
          </div>
          <aside className="mt-5 rounded-2xl bg-amber-100/60 p-6">
            <h3 className="text-xl">A simple, low-cost shopping basket</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Oats, rice or potatoes, beans or lentils, eggs or tofu, frozen
              vegetables, cabbage or carrots, seasonal fruit, and plain yogurt
              or a suitable alternative. Compare unit prices, choose what is
              affordable locally, and plan to use leftovers safely.
            </p>
          </aside>
        </section>
        <PortionQuiz />
        <section className="rounded-3xl bg-emerald-900 p-6 text-white sm:p-9">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
            Put one thing into practice
          </p>
          <h2 className="mt-3 text-3xl">
            Learn a little. Log a little. Repeat.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-100">
            Start by logging one meal. Your diary shows each day’s calories;
            your weigh-ins help you see the longer-term picture.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="min-h-12 rounded-full bg-white px-5 py-3 font-semibold text-emerald-900"
              to="/food-logger"
            >
              Log my first meal →
            </Link>
            <Link
              className="min-h-12 rounded-full border border-emerald-600 px-5 py-3 font-semibold"
              to="/calorie-calculator"
            >
              Estimate my needs
            </Link>
          </div>
        </section>
        <footer className="space-y-3 text-xs leading-6 text-slate-500">
          <p>
            General education for adults, not personalised medical advice. If
            you are under 18, pregnant or breastfeeding, have a medical
            condition or a history of disordered eating, ask a qualified
            clinician or registered dietitian for tailored advice rather than
            using a weight-loss target.
          </p>
          <p>
            Learn more from{" "}
            <a
              className="underline"
              href="https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/"
              target="_blank"
              rel="noreferrer"
            >
              the NHS Eatwell Guide
            </a>
            ,{" "}
            <a
              className="underline"
              href="https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/"
              target="_blank"
              rel="noreferrer"
            >
              NHS fibre guidance
            </a>
            , and{" "}
            <a
              className="underline"
              href="https://www.myplate.gov/tip-sheet/healthy-eating-budget"
              target="_blank"
              rel="noreferrer"
            >
              USDA budget tips
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
