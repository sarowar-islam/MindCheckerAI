import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ThemeToggle from "./components/ThemeToggle";
import LandingPage from "./pages/LandingPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("mindcheck-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkMode = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(darkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("mindcheck-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const shellClass = useMemo(
    () =>
      "relative min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100",
    []
  );

  return (
    <main className={shellClass}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(21,128,61,0.16),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(8,145,178,0.16),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(251,191,36,0.2),transparent_40%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.14),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(96,165,250,0.2),transparent_42%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex justify-end">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
        </div>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
