import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";
import AssistantAvatar from "../components/AssistantAvatar";
import { generateQuestions, QUESTION_COUNTS } from "../data/questions";
import { generateMentalHealthParagraph } from "../utils/answerMapper";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000").replace(
  /\/$/,
  ""
);

function QuizPage() {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState(() => generateQuestions(10));
  const [answers, setAnswers] = useState(() => Array(10).fill(""));
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = useMemo(
    () => answers.filter((value) => value !== "").length,
    [answers]
  );

  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  const startQuiz = () => {
    const nextQuestions = generateQuestions(questionCount);
    setQuestions(nextQuestions);
    setAnswers(Array(nextQuestions.length).fill(""));
    setError("");
    setHasStarted(true);
  };

  const handleSelect = (index, option) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = option;
      return next;
    });
  };

  const runPrediction = async ({ requireAllAnswers }) => {
    setError("");

    if (requireAllAnswers && answers.some((value) => !value)) {
      setError("Please answer all questions before submitting.");
      return;
    }

    if (!requireAllAnswers && answeredCount === 0) {
      setError("Please answer at least one question before skipping.");
      return;
    }

    const generatedText = generateMentalHealthParagraph(questions, answers);

    if (!generatedText.trim()) {
      setError("Not enough data to analyze. Please answer at least one question.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: generatedText }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      navigate("/result", {
        state: {
          prediction: data.prediction,
          mood: data.mood,
          confidence: data.confidence,
          classProbabilities: data.class_probabilities,
          generatedText,
        },
      });
    } catch (err) {
      setError(err.message || "Unable to connect to backend API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAll = async (event) => {
    event.preventDefault();
    await runPrediction({ requireAllAnswers: true });
  };

  const handleSkipAndAnalyze = async () => {
    await runPrediction({ requireAllAnswers: false });
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      {!hasStarted ? (
        <div className="card-surface space-y-5 animate-fade-up">
          <div className="flex items-center gap-3">
            <AssistantAvatar size="md" className="shrink-0" />
            <h1 className="font-heading text-3xl font-bold">MindCheck AI Quiz Setup</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Select how many questions to answer. A higher number generally improves prediction quality.
          </p>

          <div className="grid gap-3 sm:grid-cols-4">
            {QUESTION_COUNTS.map((count) => {
              const active = count === questionCount;

              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-100"
                      : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }`}
                >
                  {count} Questions
                </button>
              );
            })}
          </div>

          <button type="button" className="primary-btn w-full sm:w-auto" onClick={startQuiz}>
            Start Test
          </button>
        </div>
      ) : (
        <>
          <div className="card-surface space-y-4">
            <div className="flex items-center gap-3">
              <AssistantAvatar size="md" className="shrink-0" />
              <h1 className="font-heading text-3xl font-bold">MindCheck AI Quiz</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Select the option that best matches how often you experience each statement.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Answered {answeredCount} of {questions.length}
            </p>
            <ProgressBar value={progress} />
          </div>

          {isLoading ? (
            <div className="card-surface">
              <LoadingSpinner />
            </div>
          ) : (
            <form onSubmit={handleSubmitAll} className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  selected={answers[index]}
                  onSelect={(option) => handleSelect(index, option)}
                />
              ))}

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                  {error}
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="submit" className="primary-btn w-full">
                  Get Prediction
                </button>
                <button
                  type="button"
                  className="secondary-btn w-full"
                  onClick={handleSkipAndAnalyze}
                >
                  Skip Rest And Analyze
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}

export default QuizPage;
