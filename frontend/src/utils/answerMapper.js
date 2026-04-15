const NEGATIVE_ANSWER_TO_PHRASE = {
  Never: "do not",
  Sometimes: "sometimes",
  Often: "often",
  Always: "always",
};

const POSITIVE_ANSWER_TO_PHRASE = {
  Never: "rarely",
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

function buildOverallMoodSentence(totalSeverity, answeredCount) {
  if (!answeredCount) {
    return "";
  }

  const normalizedSeverity = totalSeverity / (answeredCount * 3);

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

export function generateMentalHealthParagraph(questions, answers) {
  let totalSeverity = 0;
  let answeredCount = 0;

  const sentences = questions
    .map((question, index) => {
      const answer = answers[index];
      if (!answer) {
        return "";
      }

      const polarity = question.polarity === "positive" ? "positive" : "negative";
      const score = ANSWER_SCORE[answer] ?? 1;
      const symptomSeverity = polarity === "positive" ? 3 - score : score;

      totalSeverity += symptomSeverity;
      answeredCount += 1;

      const phraseMap = polarity === "positive"
        ? POSITIVE_ANSWER_TO_PHRASE
        : NEGATIVE_ANSWER_TO_PHRASE;
      const phrase = phraseMap[answer] ?? "sometimes";

      return `I ${phrase} ${question.clause}.`;
    })
    .filter(Boolean);

  const overallMoodSentence = buildOverallMoodSentence(totalSeverity, answeredCount);
  if (overallMoodSentence) {
    sentences.push(overallMoodSentence);
  }

  return sentences.join(" ");
}
