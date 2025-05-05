
import { useState } from "react";
import type { QuizItem } from "@/types/quiz";

interface QuizComponentProps {
  quizzes: QuizItem[];
}
const QuizComponent: React.FC<QuizComponentProps> = ({ quizzes }) => {
 
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [idx]: option }));
  };

  const score = quizzes.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correct ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {quizzes.map((q, idx) => (
        <div
          key={idx}
          className="p-6 border-2 border-amber-700 rounded-lg bg-gradient-to-br from-amber-800/20 to-stone-900/20"
        >
          <p className="mb-4 text-lg font-semibold text-amber-100">
            {idx + 1}. {q.question}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(q.options?? "").map(([opt, text]) => {
              
              const isCorrect = submitted && q.correct === opt;
              const isWrong =
                submitted && answers[idx] === opt && q.correct !== opt;

              return (
                <label
                  key={opt}
                  className={`
                    flex items-center space-x-3 rounded-lg px-4 py-2
                    cursor-pointer transition-colors
                    ${isCorrect ? "bg-green-600/50" : ""}
                    ${isWrong ? "bg-red-600/50" : ""}
                    ${!submitted ? "hover:bg-amber-700/30" : ""}
                  `}
                >
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    disabled={submitted}
                    onChange={() => handleSelect(idx, opt)}
                    className="h-5 w-5 text-amber-400 focus:ring-amber-300"
                  />
                  <span
                    className={`text-amber-100 ${
                      submitted && q.correct === opt
                        ? "font-bold text-green-200"
                        : ""
                    }`}
                  >
                    {opt}. {text}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <div className="text-center">
          <button
            onClick={() => setSubmitted(true)}
            className="mt-4 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-amber-900 shadow-lg transition-transform hover:scale-105"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-300">
            You scored {score} / {quizzes.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
