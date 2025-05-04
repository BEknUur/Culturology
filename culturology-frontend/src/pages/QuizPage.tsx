
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import type { QuizItem } from "@/types/quiz";
import { generateQuiz } from "@/api/index";
import QuizComponent from "@/components/QuizComponent";

const QuizPage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { slug } = useParams<{ slug: string }>();

 
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await generateQuiz(slug);
        setQuestions(data);
      } catch (err: any) {
        setError(err.message ?? "Ошибка генерации викторины");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-900 to-stone-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-4" />
          <p className="text-amber-100">Generate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-900 to-stone-900">
        <div className="text-center p-6 bg-stone-900/60 rounded-xl">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-600 text-amber-100 rounded hover:bg-amber-500 transition"
          >
           Try later
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-900 to-stone-900">
        <p className="text-amber-100 text-lg">This culture doesn't have quiz.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 pt-24 pb-12">
      
      <div className="container mx-auto px-4 flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold text-amber-100 text-center">
          Quiziz culture{" "}
          <span className="text-amber-400 capitalize">{slug}</span>
        </h1>

        <div className="w-full max-w-3xl">
          <QuizComponent quizzes={questions} />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
