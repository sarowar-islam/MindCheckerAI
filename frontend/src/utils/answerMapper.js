const ANSWER_TO_PHRASE = {
  Never: "do not",
  Sometimes: "sometimes",
  Often: "often",
  Always: "always",
};

const ANSWER_SCORE = {
  Never: 0,
  Sometimes: 1,
  Often: 2,
  Always: 3,
};

function buildOverallMoodSentence(normalizedSeverity) {
  if (normalizedSeverity == null) {
    return "";
  }

  if (normalizedSeverity <= 0.25) {
    return "Overall I feel happy calm and emotionally balanced most of the time.";
  }
  if (normalizedSeverity <= 0.5) {
    return "Overall I feel mostly stable with occasional stress.";
  }
  if (normalizedSeverity <= 0.75) {
    return "Overall I often feel stressed or anxious in daily life.";
  }

  return "Overall I frequently feel emotionally low and overwhelmed.";
}

export function buildPredictionInput(questions, answers) {
  let totalSeverity = 0;
  let answeredCount = 0;

  const sentences = questions
    .map((question, index) => {
      const answer = answers[index];
      if (!answer) {
        return "";
      }

      const score = ANSWER_SCORE[answer] ?? 1;
      totalSeverity += score;
      answeredCount += 1;

      const phrase = ANSWER_TO_PHRASE[answer] ?? "sometimes";

      return `I ${phrase} ${question.clause}.`;
    })
    .filter(Boolean);

  const normalizedSeverity = answeredCount ? totalSeverity / (answeredCount * 3) : null;
  const overallMoodSentence = buildOverallMoodSentence(normalizedSeverity);
  if (overallMoodSentence) {
    sentences.push(overallMoodSentence);
  }

  return {
    text: sentences.join(" "),
    severityScore: normalizedSeverity,
  };
}

export function generateMentalHealthParagraph(questions, answers) {
  return buildPredictionInput(questions, answers).text;
}
