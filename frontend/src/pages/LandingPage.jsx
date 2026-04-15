import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <section className="mx-auto mt-8 max-w-3xl animate-fade-up">
      <div className="card-surface text-center">
        <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
          AI Mental Health Screening
        </p>
        <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          MindCheck AI
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-slate-600 dark:text-slate-300">
          Check your mental health instantly using a quick assessment powered by machine learning.
        </p>

        <Link to="/quiz" className="primary-btn w-full sm:w-auto">
          Start Assessment
        </Link>
      </div>
    </section>
  );
}

export default LandingPage;
