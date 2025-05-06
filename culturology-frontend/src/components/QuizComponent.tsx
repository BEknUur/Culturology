import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizItem } from "@/types/quiz";

interface QuizComponentProps {
  quizzes: QuizItem[];
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizzes }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (idx: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [idx]: option }));
  };

  const score = quizzes.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correct ? 1 : 0);
  }, 0);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setShowResults(true), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {quizzes.map((q, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="p-6 rounded-xl bg-white/90 backdrop-blur-sm border border-stone-200 shadow-lg"
        >
          <div className="flex items-start mb-4">
            <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-medium">
              {idx + 1}
            </div>
            <p className="text-lg font-medium text-stone-800 mt-1">{q.question}</p>
          </div>

          <div className="grid grid-cols-1 gap-2 ml-11">
            {Object.entries(q.options ?? {}).map(([opt, text]) => {
              const isSelected = answers[idx] === opt;
              const isCorrect = submitted && q.correct === opt;
              const isWrong = submitted && isSelected && !isCorrect;

              return (
                <motion.label
                  key={opt}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center space-x-3 rounded-lg px-4 py-3
                    cursor-pointer transition-all duration-200
                    border
                    ${
                      isSelected
                        ? "border-amber-500 bg-amber-50"
                        : "border-stone-200 hover:border-amber-300"
                    }
                    ${isCorrect ? "border-green-500 bg-green-50" : ""}
                    ${isWrong ? "border-red-300 bg-red-50" : ""}
                  `}
                >
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 
                    ${isSelected ? "border-amber-500" : "border-stone-300"}
                    ${isCorrect ? "border-green-500 bg-green-500" : ""}
                    ${isWrong ? "border-red-300" : ""}
                  `}>
                    {isCorrect && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isWrong && (
                      <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`
                      text-stone-700
                      ${isCorrect ? "text-green-700 font-medium" : ""}
                      ${isWrong ? "text-red-700" : ""}
                    `}
                  >
                    {text}
                  </span>
                </motion.label>
              );
            })}
          </div>
        </motion.div>
      ))}

      {!submitted ? (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: quizzes.length * 0.1 }}
        >
          <motion.button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quizzes.length}
            className={`
              mt-6 px-8 py-3 rounded-xl text-lg font-medium
              bg-gradient-to-r from-amber-400 to-amber-500
              text-white shadow-lg
              transition-all duration-300
              relative overflow-hidden
              ${Object.keys(answers).length !== quizzes.length ? "opacity-50 cursor-not-allowed" : "hover:shadow-amber-200"}
            `}
            whileHover={Object.keys(answers).length === quizzes.length ? { scale: 1.03 } : {}}
            whileTap={Object.keys(answers).length === quizzes.length ? { scale: 0.98 } : {}}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit Answers
            </span>
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>
      ) : (
        <AnimatePresence>
          {showResults && (
            <motion.div 
              className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="mb-6">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border-4 border-amber-200 flex items-center justify-center mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                  {score === quizzes.length ? "Perfect! 🏆" : score > quizzes.length / 2 ? "Good Job! ✨" : "Keep Learning! 📚"}
                </h3>
                <p className="text-lg text-stone-600">
                  You scored <span className="font-bold text-amber-600">{score}</span> out of <span className="font-bold">{quizzes.length}</span>
                </p>
              </div>
              
              <motion.button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-300 transition-colors duration-300 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default QuizComponent;