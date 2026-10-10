import { useState } from "react";
import { Link } from "react-router-dom";

const questions = [
  {
    question:
      "You’re serving rice, chicken, and vegetables. What is a helpful starting point?",
    choices: [
      "Half vegetables, a quarter protein, a quarter rice",
      "All rice, with a tiny spoon of vegetables",
      "Only vegetables — protein and carbs do not matter",
    ],
    answer: 0,
    explanation:
      "The plate method is a flexible starting point: half non-starchy vegetables, a quarter protein, and a quarter starchy carbs. Adjust it to your hunger and needs.",
  },
  {
    question:
      "Rice is affordable. Do you need to stop eating it to manage your weight?",
    choices: [
      "Yes, all carbohydrates must go",
      "No — keep a portion and pair it with protein and vegetables",
      "No, but rice has no calories",
    ],
    answer: 1,
    explanation:
      "Carbs supply energy. Rice can fit into a balanced meal; the portion and the overall eating pattern matter, not banning a food.",
  },
  {
    question: "Which low-cost food provides both protein and fibre?",
    choices: ["Olive oil", "Sugar", "Beans or lentils"],
    answer: 2,
    explanation:
      "Beans and lentils offer both protein and fibre. They are useful in soups, stews, and rice bowls. Oil is a source of fat, not protein or fibre.",
  },
  {
    question:
      "You finished a small salad and still feel hungry. What is a helpful next step?",
    choices: [
      "Ignore hunger for the rest of the day",
      "Add beans, eggs, or tofu and a portion of potatoes or whole grains",
      "Drink coffee instead of eating",
    ],
    answer: 1,
    explanation:
      "Vegetables add volume, but they may not make a complete meal alone. Add protein and an energy source. Fullness differs between people, so listen to your body.",
  },
  {
    question:
      "A food label says 150 calories per serving. You ate two servings. What do you log?",
    choices: ["75 calories", "150 calories", "300 calories"],
    answer: 2,
    explanation:
      "Multiply calories per serving by the servings you ate: 150 × 2 = 300. Serving sizes on labels are not a rule for how much you are allowed to eat.",
  },
];

export default function PortionQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = questions[index];
  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
  }

  return (
    <section
      className="diary-card scroll-mt-6"
      id="portion-quiz"
      aria-labelledby="portion-quiz-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">04 · Try it for yourself</p>
          <h2 id="portion-quiz-title" className="mt-2 text-3xl">
            A little practice, not a test.
          </h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          {index < questions.length
            ? `${index + 1} of ${questions.length}`
            : "Practice complete"}
        </span>
      </div>
      {question ? (
        <div className="mt-6 max-w-2xl">
          <h3 className="text-xl leading-8">{question.question}</h3>
          <div className="mt-4 space-y-3">
            {question.choices.map((choice, answerIndex) => (
              <button
                key={choice}
                type="button"
                disabled={selected !== null}
                aria-pressed={selected === answerIndex}
                onClick={() => {
                  setSelected(answerIndex);
                  if (answerIndex === question.answer)
                    setScore((current) => current + 1);
                }}
                className={`quiz-choice ${selected !== null && answerIndex === question.answer ? "quiz-choice-correct" : selected === answerIndex ? "quiz-choice-selected" : ""}`}
              >
                <span className="quiz-letter" aria-hidden="true">
                  {String.fromCharCode(65 + answerIndex)}
                </span>
                <span>{choice}</span>
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className="mt-5 rounded-2xl bg-emerald-50 p-5" role="status">
              <p className="font-semibold text-emerald-900">
                {selected === question.answer
                  ? "That’s it."
                  : "A useful thing to learn."}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {question.explanation}
              </p>
              <button
                className="diary-button mt-4"
                type="button"
                onClick={() => {
                  setIndex((current) => current + 1);
                  setSelected(null);
                }}
              >
                {index === questions.length - 1
                  ? "See my recap"
                  : "Next question →"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-emerald-50 p-6" role="status">
          <h3 className="text-2xl">You’ve practised the basics.</h3>
          <p className="mt-3 text-slate-700">
            {score} of {questions.length} right on your first try. It is fine to
            revisit the lessons — learning matters more than the score.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="diary-button" to="/food-logger">
              Try your food diary →
            </Link>
            <button
              type="button"
              className="min-h-12 rounded-full border border-emerald-200 px-5 font-semibold text-emerald-800"
              onClick={restart}
            >
              Practise again
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
