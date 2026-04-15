import { OPTIONS } from "../data/questions";
import AssistantAvatar from "./AssistantAvatar";

const AVATAR_MOOD_BY_OPTION = {
  Never: "calm",
  Sometimes: "neutral",
  Often: "concerned",
  Always: "stressed",
};

function OptionIcon({ option, active }) {
  const iconClass = active
    ? "h-4 w-4 text-emerald-700 dark:text-emerald-300"
    : "h-4 w-4 text-slate-500 dark:text-slate-400";

  if (option === "Never") {
    return (
      <svg viewBox="0 0 20 20" className={iconClass} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M6.8 10.3L9.1 12.5L13.2 8.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (option === "Sometimes") {
    return (
      <svg viewBox="0 0 20 20" className={iconClass} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M10 6.5V10L12.5 12.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (option === "Often") {
    return (
      <svg viewBox="0 0 20 20" className={iconClass} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10 3.2L17 16.2H3L10 3.2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <line x1="10" y1="8" x2="10" y2="11.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className={iconClass} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="5.8" x2="10" y2="11.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1.2" fill="currentColor" />
    </svg>
  );
}

function QuestionCard({ question, selected, onSelect, index }) {
  const avatarMood = AVATAR_MOOD_BY_OPTION[selected] ?? "neutral";

  return (
    <article className="card-surface animate-fade-up">
      <div className="mb-4 flex items-start gap-3">
        <AssistantAvatar size="sm" mood={avatarMood} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Question {index + 1}
          </p>
          <h3 className="font-heading mt-1 text-xl leading-tight text-slate-900 dark:text-slate-100">
            {question.prompt}
          </h3>
        </div>
      </div>

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
              <span className="inline-flex items-center gap-2">
                <OptionIcon option={option} active={active} />
                <span>{option}</span>
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}

export default QuestionCard;
