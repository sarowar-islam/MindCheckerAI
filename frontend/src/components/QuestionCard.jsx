import { OPTIONS } from "../data/questions";

function QuestionCard({ question, selected, onSelect, index }) {
  return (
    <article className="card-surface animate-fade-up">
      <p className="mb-3 text-sm font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
        Question {index + 1}
      </p>
      <h3 className="font-heading mb-4 text-xl leading-tight text-slate-900 dark:text-slate-100">
        {question.prompt}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const active = selected === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </article>
  );
}

export default QuestionCard;
