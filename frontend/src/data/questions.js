const BASE_CLAUSES = [
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

export function generateQuestions(count = 10) {
  if (!QUESTION_COUNTS.includes(count)) {
    throw new Error(`Unsupported question count: ${count}`);
  }

  const questions = [];
  let id = 1;

  for (const clause of BASE_CLAUSES) {
    for (const context of CONTEXTS) {
      const clauseWithContext = context ? `${clause} ${context}` : clause;
      questions.push({
        id,
        prompt: `I ${clauseWithContext}`,
        clause: clauseWithContext,
      });
      id += 1;
    }
  }

  return questions.slice(0, count);
}

export const OPTIONS = ["Never", "Sometimes", "Often", "Always"];
