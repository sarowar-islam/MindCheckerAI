function LoadingSpinner({ label = "Predicting your result..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
