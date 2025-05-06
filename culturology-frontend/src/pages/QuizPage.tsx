import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Quiz from "../components/Quiz";
import { generateQuiz } from "@/api";


type QuizQuestion = {
  id: string;
  question: string;
  options: Record<string, string>;
  correct: string;
};

const QuizPage = () => {
  const { slug } = useParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await generateQuiz(slug || "");
        setQuestions(data.map((item: any) => ({ ...item, id: String(item.id) })));
      } catch (err) {
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [slug]);

  const handleComplete = (score: number) => {
    console.log(`Quiz completed! Score: ${score}/${questions.length}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">Error Loading Quiz</h3>
          <p className="text-stone-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="text-xl font-bold text-stone-800 mb-2">No Questions Available</h3>
          <p className="text-stone-600">This quiz doesn't have any questions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-stone-800 mb-2">
          {slug?.toUpperCase()} Culture Quiz
        </h1>
        <p className="text-center text-stone-600 mb-8">
          Test your knowledge about {slug} traditions and history
        </p>
        
        <Quiz questions={questions} onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default QuizPage;