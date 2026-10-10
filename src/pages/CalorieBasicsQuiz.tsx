import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CalorieCalculator from "./CalorieCalculator";

const PASSED_KEY = "calorie-basics-quiz-passed";

const questions = [
  {
    question: "What is a calorie?",
    answers: [
      "A unit of energy in food",
      "A type of vitamin",
      "A measure of how healthy a food is",
      "Something only used during exercise",
    ],
    correct: 0,
    explanation:
      "That’s it! Calories are a way to describe the energy food gives your body.",
  },
  {
    question: "What may happen if, over time, you eat more energy than your body uses?",
    answers: [
      "Your body stops using energy",
      "Your weight may go up",
      "You automatically gain muscle",
      "Nothing can change",
    ],
    correct: 1,
    explanation:
      "Right! Over time, extra energy can be stored, and your weight may go up.",
  },
  {
    question: "Do you need to give up every food you enjoy to work toward weight loss?",
    answers: [
      "Yes, all favorite foods must go",
      "Yes, but only on weekdays",
      "No. A flexible approach can include foods you enjoy",
      "Only if you exercise every day",
    ],
    correct: 2,
    explanation:
      "Exactly! No single food decides your progress. A flexible, manageable routine can include foods you enjoy.",
  },
] as const;

export function hasPassedCalorieBasicsQuiz() {
  try {
    return window.localStorage.getItem(PASSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function CalculatorGate() {
  return hasPassedCalorieBasicsQuiz() ? (
    <CalorieCalculator />
  ) : (
    <Navigate replace to="/calorie-quiz" />
  );
}

export default function CalorieBasicsQuiz() {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<"idle" | "incorrect" | "correct">("idle");
  const [retryNumber, setRetryNumber] = useState(0);
  const [storageError, setStorageError] = useState("");

  if (hasPassedCalorieBasicsQuiz()) {
    return <Navigate replace to="/calorie-calculator" />;
  }

  const currentQuestion = questions[questionIndex];
  const isCorrect = answerState === "correct";

  function chooseAnswer(answerIndex: number) {
    if (isCorrect) return;
    setSelectedAnswer(answerIndex);

    if (answerIndex === currentQuestion.correct) {
      setAnswerState("correct");
      return;
    }

    setAnswerState("incorrect");
    setRetryNumber((number) => number + 1);
  }

  function retryQuestion() {
    setSelectedAnswer(null);
    setAnswerState("idle");
  }

  function continueQuiz() {
    if (!isCorrect) return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setAnswerState("idle");
      return;
    }

    try {
      window.localStorage.setItem(PASSED_KEY, "true");
      navigate("/calorie-calculator", { replace: true });
    } catch {
      setStorageError(
        "Your browser couldn’t save the quiz result. Check its storage settings and try again to unlock the calculator.",
      );
    }
  }

  return (
    <main className="min-h-screen px-4 py-7 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center justify-between gap-4">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            to="/calories-explained"
          >
            <span aria-hidden="true">←</span> Back to the lesson
          </Link>
          <span className="shrink-0 text-sm font-semibold text-slate-500">
            A quick check-in
          </span>
        </header>

        <section
          aria-labelledby="quiz-title"
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-12 sm:p-9"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
              Before you start
            </p>
            <p
              aria-label={`Question ${questionIndex + 1} of ${questions.length}`}
              className="text-sm font-bold tabular-nums text-slate-500"
            >
              {questionIndex + 1} / {questions.length}
            </p>
          </div>
          <div
            aria-label={`Quiz progress: ${questionIndex} of ${questions.length} questions completed`}
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
            role="img"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
              style={{ width: `${(questionIndex / questions.length) * 100}%` }}
            />
          </div>

          <div className="quiz-question-enter" key={questionIndex}>
            <h1
              className="mt-8 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl"
              id="quiz-title"
            >
              {currentQuestion.question}
            </h1>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Choose the best answer. If you miss one, no worries—you can try
              again right away.
            </p>

            <fieldset className="mt-6 space-y-3" disabled={isCorrect}>
              <legend className="sr-only">{currentQuestion.question}</legend>
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswer === index;
                const isWrongChoice = isSelected && answerState === "incorrect";
                const isRightChoice = isSelected && answerState === "correct";

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`flex min-h-14 w-full items-center gap-4 rounded-2xl border-2 px-4 py-3 text-left text-base font-semibold transition sm:text-lg ${
                      isWrongChoice
                        ? "quiz-shake border-rose-400 bg-rose-50 text-rose-950"
                        : isRightChoice
                          ? "quiz-correct border-emerald-500 bg-emerald-50 text-emerald-950"
                          : "border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/60"
                    } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700`}
                    key={`${questionIndex}-${answer}`}
                    onClick={() => chooseAnswer(index)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-base font-extrabold ${
                        isWrongChoice
                          ? "bg-rose-200 text-rose-900"
                          : isRightChoice
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{answer}</span>
                    {isRightChoice && (
                      <span aria-hidden="true" className="ml-auto text-xl text-emerald-700">
                        ✓
                      </span>
                    )}
                    {isWrongChoice && (
                      <span aria-hidden="true" className="ml-auto text-xl text-rose-700">
                        ↻
                      </span>
                    )}
                  </button>
                );
              })}
            </fieldset>

            {answerState === "incorrect" && (
              <div
                className="quiz-feedback-enter mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4"
                role="alert"
              >
                <p className="font-bold text-rose-900">
                  Not quite—and that’s okay. Give it another try!
                </p>
                <p className="mt-1 text-base leading-6 text-rose-900">
                  Hint: think back to the simple explanation in the lesson.
                </p>
                <button
                  className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-rose-700 px-5 py-2 text-base font-bold text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                  onClick={retryQuestion}
                  type="button"
                >
                  Retry this question
                </button>
              </div>
            )}

            {isCorrect && (
              <div
                className="quiz-feedback-enter mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                role="status"
              >
                <p className="font-bold text-emerald-950">
                  {questionIndex === questions.length - 1
                    ? "You got all three!"
                    : "Nice work!"}
                </p>
                <p className="mt-1 text-base leading-6 text-emerald-900">
                  {currentQuestion.explanation}
                </p>
                <button
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-base font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto"
                  onClick={continueQuiz}
                  type="button"
                >
                  {questionIndex === questions.length - 1
                    ? "Start my calorie target"
                    : "Next question"}
                  <span aria-hidden="true" className="ml-2">→</span>
                </button>
              </div>
            )}
          </div>

          {storageError && (
            <p
              className="mt-5 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-base text-rose-900"
              role="alert"
            >
              {storageError}
              {retryNumber > 0 && (
                <span className="block pt-1">Please try saving your result again.</span>
              )}
            </p>
          )}
        </section>

        <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-6 text-slate-500">
          This isn’t a test of you—just a friendly way to make sure the basics
          make sense before you choose a target.
        </p>
      </div>
    </main>
  );
}
