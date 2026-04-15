const PREDICTION_META = {
  Normal: {
    icon: "🙂",
    title: "Normal",
    advice:
      "Your response pattern looks stable. Keep supporting your mental health with rest, exercise, and meaningful social connection.",
  },
  Anxiety: {
    icon: "😟",
    title: "Anxiety",
    advice:
      "Your responses suggest anxiety signals. Try slow breathing, reduce overstimulation, and consider talking with a counselor.",
  },
  Depression: {
    icon: "😞",
    title: "Depression",
    advice:
      "Your responses indicate depressive symptoms. Please speak with a mental health professional for proper guidance and support.",
  },
};

function ResultCard({ prediction, confidence, generatedText }) {
  const meta = PREDICTION_META[prediction] ?? PREDICTION_META.Normal;

  return (
    <section className="card-surface animate-fade-up space-y-4">
      <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-300">
        Prediction Result
      </p>
      <div className="flex items-center gap-3">
        <span className="text-4xl" role="img" aria-label={meta.title}>
          {meta.icon}
        </span>
        <h2 className="font-heading text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {meta.title}
        </h2>
      </div>

      {typeof confidence === "number" && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Confidence Score: <span className="font-semibold">{(confidence * 100).toFixed(2)}%</span>
        </p>
      )}

      <p className="rounded-xl bg-slate-100 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {meta.advice}
      </p>

      {generatedText && (
        <div>
          <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-100">Generated Input Text</h3>
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {generatedText}
          </p>
        </div>
      )}
    </section>
  );
}

export default ResultCard;
