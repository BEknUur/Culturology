import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronRight, Award, BookOpen } from "lucide-react";

type QuizItem = {
  id: string;
  question: string;
  options: Record<string, string>;
  correct: string;
  explanation?: string;
};

interface QuizProps {
  questions: QuizItem[];
  onComplete?: (score: number) => void;
}

const Quiz = ({ questions, onComplete }: QuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion.correct;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setIsSubmitted(true);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (isLastQuestion) {
      setTimeout(() => {
        setShowResults(true);
        if (onComplete) onComplete(isCorrect ? score + 1 : score);
      }, 1500);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200">
      
      <div className="h-2 bg-stone-100">
        <motion.div
          className="h-full bg-amber-500"
          initial={{ width: 0 }}
          animate={{ 
            width: `${((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100}%` 
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-6">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookOpen className="text-amber-500 mr-2" size={18} />
            <span className="text-stone-500 font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            Score: {score}
          </div>
        </div>

        
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-stone-800 mb-6">
            {currentQuestion.question}
          </h3>

          
          <div className="space-y-3 mb-8">
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              const isSelected = selectedOption === key;
              const isActuallyCorrect = key === currentQuestion.correct;
              
              return (
                <motion.button
                  key={key}
                  whileTap={{ scale: isSubmitted ? 1 : 0.98 }}
                  whileHover={{ scale: isSubmitted ? 1 : 1.02 }}
                  onClick={() => handleSelect(key)}
                  disabled={isSubmitted}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-all
                    ${isSubmitted && isActuallyCorrect 
                      ? "bg-green-50 border-green-300" 
                      : ""}
                    ${isSelected && !isCorrect && isSubmitted 
                      ? "bg-red-50 border-red-300" 
                      : ""}
                    ${isSelected 
                      ? "bg-amber-50 border-amber-300" 
                      : "border-stone-200 hover:border-amber-200"}
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-6 h-6 rounded-full mr-3
                      border-2 flex-shrink-0
                      ${isSubmitted && isActuallyCorrect 
                        ? "bg-green-500 border-green-500 text-white" 
                        : ""}
                      ${isSelected && !isCorrect && isSubmitted 
                        ? "border-red-300 text-red-500" 
                        : ""}
                      ${isSelected 
                        ? "border-amber-500" 
                        : "border-stone-300"}
                    `}>
                      {isSubmitted && isActuallyCorrect && <Check size={14} />}
                      {isSelected && !isCorrect && isSubmitted && <X size={14} />}
                    </div>
                    <span className={`
                      ${isSubmitted && isActuallyCorrect 
                        ? "text-green-800 font-medium" 
                        : ""}
                      ${isSelected && !isCorrect && isSubmitted 
                        ? "text-red-800" 
                        : "text-stone-700"}
                    `}>
                      {value}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          
          {isSubmitted && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-stone-50 p-4 rounded-lg border border-stone-200 mb-6"
            >
              <p className="text-stone-600">{currentQuestion.explanation}</p>
            </motion.div>
          )}

          
          <div className="flex justify-end">
            {!isSubmitted ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`
                  px-6 py-2 rounded-lg font-medium flex items-center
                  ${selectedOption 
                    ? "bg-amber-500 text-white shadow-md hover:bg-amber-600" 
                    : "bg-stone-100 text-stone-400 cursor-not-allowed"}
                `}
              >
                {isLastQuestion ? "Submit Quiz" : "Check Answer"}
                <ChevronRight className="ml-1" size={18} />
              </motion.button>
            ) : !isLastQuestion ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium flex items-center"
              >
                Next Question
                <ChevronRight className="ml-1" size={18} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowResults(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium flex items-center"
              >
                See Results
                <Award className="ml-1" size={18} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl"
            >
              <div className="text-center">
                <div className="mx-auto bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <Award className="text-amber-600" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                  {score === questions.length
                    ? "Perfect! You're a Sage!"
                    : score >= questions.length * 0.7
                    ? "Well Done! Scholar Level"
                    : "Good Effort! Keep Learning"}
                </h3>
                
                <p className="text-stone-600 mb-6">
                  You scored {score} out of {questions.length}
                </p>
                
                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestart}
                    className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium"
                  >
                    Try Again
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 border border-stone-300 rounded-lg font-medium"
                  >
                    New Quiz
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;