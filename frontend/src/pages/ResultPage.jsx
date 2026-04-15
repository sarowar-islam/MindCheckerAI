import { useLocation, useNavigate } from "react-router-dom";

import ResultCard from "../components/ResultCard";

function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.prediction) {
    return (
      <section className="mx-auto mt-10 max-w-xl card-surface text-center">
        <p className="mb-4 text-slate-700 dark:text-slate-300">
          No prediction found. Please complete the quiz first.
        </p>
        <button type="button" className="primary-btn" onClick={() => navigate("/quiz") }>
          Start Quiz
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <ResultCard
        prediction={state.prediction}
        mood={state.mood}
        confidence={state.confidence}
        classProbabilities={state.classProbabilities}
        generatedText={state.generatedText}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="primary-btn"
          onClick={() => navigate("/quiz", { replace: true })}
        >
          Retake Test
        </button>
        <button type="button" className="secondary-btn" onClick={() => navigate("/") }>
          Back to Home
        </button>
      </div>
    </section>
  );
}

export default ResultPage;
