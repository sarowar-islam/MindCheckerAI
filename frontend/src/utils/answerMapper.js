const ANSWER_TO_PHRASE = {
  Never: "do not",
  Sometimes: "sometimes",
  Often: "often",
  Always: "always",
};

export function generateMentalHealthParagraph(questions, answers) {
  const sentences = questions
    .map((question, index) => {
    const answer = answers[index];
    if (!answer) {
      return "";
    }

    const phrase = ANSWER_TO_PHRASE[answer] ?? "sometimes";

    if (answer === "Never") {
      return `I ${phrase} ${question.clause}.`;
    }

    return `I ${phrase} ${question.clause}.`;
    })
    .filter(Boolean);

  return sentences.join(" ");
}
