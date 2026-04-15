const SIZE_CLASSES = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const MOOD_STYLES = {
  calm: {
    shell: "from-emerald-300 via-teal-300 to-cyan-400",
    face: "#ECFDF5",
    stroke: "#065F46",
    mouth: "M22 40C25 43.8 28.6 45.8 32 45.8C35.4 45.8 39 43.8 42 40",
    browLeft: "M18 22L24 20",
    browRight: "M40 20L46 22",
    badge: "check",
  },
  neutral: {
    shell: "from-emerald-300 via-cyan-300 to-sky-400",
    face: "#F8FAFC",
    stroke: "#0F172A",
    mouth: "M24 41H40",
    browLeft: "M18 22L24 22",
    browRight: "M40 22L46 22",
    badge: "dot",
  },
  concerned: {
    shell: "from-amber-300 via-orange-300 to-rose-300",
    face: "#FFF7ED",
    stroke: "#9A3412",
    mouth: "M23 44C26 40.5 29 39.2 32 39.2C35 39.2 38 40.5 41 44",
    browLeft: "M18 23L24 20",
    browRight: "M40 20L46 23",
    badge: "wave",
  },
  stressed: {
    shell: "from-rose-300 via-orange-300 to-yellow-300",
    face: "#FFF1F2",
    stroke: "#9F1239",
    mouth: "M22 43L26 40L30 43L34 40L38 43L42 40",
    browLeft: "M18 24L24 18",
    browRight: "M40 18L46 24",
    badge: "alert",
  },
};

function renderBadgeIcon(type) {
  if (type === "check") {
    return <path d="M46.7 14.8L49.4 17.5L53.8 13.2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />;
  }

  if (type === "wave") {
    return <path d="M46 15.5C47 13.8 48.2 13 49.5 13C50.8 13 52 13.8 53 15.5" stroke="white" strokeWidth="2" strokeLinecap="round" />;
  }

  if (type === "alert") {
    return (
      <>
        <line x1="49.5" y1="12.7" x2="49.5" y2="17.1" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="49.5" cy="19.1" r="1.2" fill="white" />
      </>
    );
  }

  return <circle cx="49.5" cy="15.8" r="1.8" fill="white" />;
}

function AssistantAvatar({ size = "md", mood = "neutral", className = "" }) {
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;
  const moodStyle = MOOD_STYLES[mood] ?? MOOD_STYLES.neutral;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br ${moodStyle.shell} ring-2 ring-white/70 shadow-lg transition-all duration-200 dark:ring-slate-800/70 ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill={moodStyle.face} />
        <path d={moodStyle.browLeft} stroke={moodStyle.stroke} strokeWidth="2.2" strokeLinecap="round" />
        <path d={moodStyle.browRight} stroke={moodStyle.stroke} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="23" cy="29" r="3.6" fill={moodStyle.stroke} />
        <circle cx="41" cy="29" r="3.6" fill={moodStyle.stroke} />
        <path d={moodStyle.mouth} stroke={moodStyle.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx="49.5" cy="15.8" r="7.2" fill={moodStyle.stroke} opacity="0.85" />
        {renderBadgeIcon(moodStyle.badge)}
      </svg>
    </div>
  );
}

export default AssistantAvatar;