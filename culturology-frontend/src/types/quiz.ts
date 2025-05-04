export interface Quiz {
    id: number;
    culture_id: number;
    question: string;
    answer: string;
  }

  export interface QuizItem {
    id: number;
    question: string;
    answer: string;
    
    options?: Record<"A"|"B"|"C"|"D", string>;
    correct?: "A"|"B"|"C"|"D";
  }
  export interface ChatRequest {
    slug: string;
    question: string;
  }
  export interface ChatResponse {
    answer: string;
  }