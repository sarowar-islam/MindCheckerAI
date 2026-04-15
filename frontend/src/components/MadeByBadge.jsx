import { useEffect, useState } from "react";

const STORAGE_KEY = "mindcheck-made-by-dismissed";

function MadeByBadge() {
  const [hidden, setHidden] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    setHidden(dismissed);
  }, []);

  const handleDismiss = () => {
    setClosing(true);
    window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      setHidden(true);
    }, 180);
  };

  if (hidden) {
    return null;
  }

  return (
    <aside
      className={`fixed bottom-4 right-4 z-50 transition-all duration-200 ${
        closing ? "translate-y-2 scale-95 opacity-0" : "animate-fade-up"
      }`}
      aria-label="Made by credit"
    >
      <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft backdrop-blur dark:border-emerald-500/30 dark:bg-slate-900/90 dark:text-slate-200">
        <span className="tracking-wide">Made by Sarowar</span>
        <button
          type="button"
          onClick={handleDismiss}
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold leading-none text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 dark:border-slate-600 dark:text-slate-300 dark:hover:border-rose-400/50 dark:hover:bg-rose-900/40 dark:hover:text-rose-200"
          aria-label="Dismiss made by credit"
        >
          X
        </button>
      </div>
    </aside>
  );
}

export default MadeByBadge;
