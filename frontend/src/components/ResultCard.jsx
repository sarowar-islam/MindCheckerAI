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

const MOOD_META = {
  Happy: { icon: "😄", textClass: "text-emerald-700 dark:text-emerald-300" },
  Stable: { icon: "🙂", textClass: "text-cyan-700 dark:text-cyan-300" },
  Anxious: { icon: "😟", textClass: "text-amber-700 dark:text-amber-300" },
  "Low Mood": { icon: "😞", textClass: "text-rose-700 dark:text-rose-300" },
  Mixed: { icon: "😐", textClass: "text-slate-700 dark:text-slate-300" },
  "Mixed Low": { icon: "😕", textClass: "text-slate-700 dark:text-slate-300" },
  Unclear: { icon: "🤔", textClass: "text-slate-700 dark:text-slate-300" },
};

function ResultCard({ prediction, mood, confidence, classProbabilities, generatedText }) {
  const meta = PREDICTION_META[prediction] ?? PREDICTION_META.Normal;
  const moodMeta = MOOD_META[mood] ?? MOOD_META.Unclear;

  const probabilityEntries = classProbabilities && typeof classProbabilities === "object"
    ? Object.entries(classProbabilities).sort((a, b) => b[1] - a[1])
    : [];

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

      {mood && (
        <p className={`rounded-xl bg-slate-100 p-3 text-sm font-medium dark:bg-slate-800 ${moodMeta.textClass}`}>
          <span className="mr-2" role="img" aria-label={mood}>
            {moodMeta.icon}
          </span>
          Mood Insight: {mood}
        </p>
      )}

      {probabilityEntries.length > 0 && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Prediction Breakdown</h3>
          {probabilityEntries.map(([label, probability]) => {
            const pct = Math.max(0, Math.min(100, Number(probability) * 100));

            return (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>{label}</span>
                  <span>{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
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
