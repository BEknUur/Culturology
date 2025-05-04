import { Quiz } from "@/types";
import { useState } from "react";

const QuizComponent = ({ quizzes }: { quizzes: Quiz[] }) => {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const q = quizzes[index];
  if (!q) return null;

  return (
    <div className="space-y-4 rounded border p-4">
      <h2 className="text-xl font-semibold">Quiz</h2>
      <p className="text-lg">{q.question}</p>
      {show ? (
        <p className="font-medium text-primary-600">Answer: {q.answer}</p>
      ) : (
        <button
          onClick={() => setShow(true)}
          className="rounded bg-primary-500 px-4 py-1 text-white"
        >
          Show answer
        </button>
      )}
      {quizzes.length > 1 && (
        <button
          onClick={() => {
            setIndex((index + 1) % quizzes.length);
            setShow(false);
          }}
          className="ml-4 text-sm underline"
        >
          Next question
        </button>
      )}
    </div>
  );
};
export default QuizComponent;