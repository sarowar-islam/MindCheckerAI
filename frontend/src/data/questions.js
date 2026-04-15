const NEGATIVE_CLAUSES = [
  "feel nervous or anxious without reason",
  "have trouble sleeping",
  "feel sad or hopeless",
  "lose interest in activities",
  "feel tired most of the time",
  "overthink a lot",
  "feel overwhelmed",
  "find it hard to concentrate",
  "feel lonely",
  "feel emotionally exhausted",
];

const POSITIVE_CLAUSES = [
  "feel calm and emotionally balanced",
  "enjoy my daily activities",
  "feel hopeful about the future",
  "sleep well and wake up refreshed",
  "can focus on tasks without much struggle",
  "feel connected and supported by people around me",
  "feel motivated to do meaningful things",
  "recover quickly after stressful moments",
  "feel confident handling daily responsibilities",
  "experience moments of joy during the day",
];

const CONTEXTS = [
  "",
  "in social situations",
  "during my work or studies",
  "in the mornings",
  "toward the end of the day",
  "on most weekdays",
  "when dealing with small problems",
  "when I am by myself",
  "during routine daily tasks",
  "when thinking about the future",
];

export const QUESTION_COUNTS = [10, 20, 50, 100];

function buildQuestion(clause, context) {
  const clauseWithContext = context ? `${clause} ${context}` : clause;

  return {
    prompt: `I ${clauseWithContext}`,
    clause: clauseWithContext,
    polarity: POSITIVE_CLAUSES.includes(clause) ? "positive" : "negative",
  };
}

function shuffle(items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function buildBalancedSelection(count) {
  const clauseCatalog = [
    ...NEGATIVE_CLAUSES.map((clause) => ({ clause, polarity: "negative" })),
    ...POSITIVE_CLAUSES.map((clause) => ({ clause, polarity: "positive" })),
  ];

  const groupedByClause = clauseCatalog.map(({ clause, polarity }) =>
    shuffle(
      CONTEXTS.map((context) => ({
        ...buildQuestion(clause, context),
        polarity,
      }))
    )
  );

  const selected = [];

  while (selected.length < count) {
    let addedInCycle = false;

    for (const clauseGroup of groupedByClause) {
      if (selected.length >= count) {
        break;
      }

      const nextQuestion = clauseGroup.pop();
      if (nextQuestion) {
        selected.push(nextQuestion);
        addedInCycle = true;
      }
    }

    if (!addedInCycle) {
      break;
    }
  }

  return selected;
}

export function generateQuestions(count = 10) {
  if (!QUESTION_COUNTS.includes(count)) {
    throw new Error(`Unsupported question count: ${count}`);
  }

  const allQuestions = [
    ...NEGATIVE_CLAUSES.map((clause) => ({ clause, polarity: "negative" })),
    ...POSITIVE_CLAUSES.map((clause) => ({ clause, polarity: "positive" })),
  ].flatMap(({ clause, polarity }) =>
    CONTEXTS.map((context) => ({
      ...buildQuestion(clause, context),
      polarity,
    }))
  );

  const selectedQuestions = count === allQuestions.length
    ? shuffle(allQuestions)
    : buildBalancedSelection(count);

  return selectedQuestions.map((question, index) => ({
    ...question,
    id: index + 1,
  }));
}

export const OPTIONS = ["Never", "Sometimes", "Often", "Always"];
