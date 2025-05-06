import axios from "axios";
import type { Culture } from "@/types/culture";
import type { Quiz, QuizItem } from "@/types/quiz";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000", 
  
});

export const getCultures = async (): Promise<Culture[]> => {
  const { data } = await api.get<Culture[]>("/api/cultures");
  return data;
};

export const searchCultures = async (
  query: string,
  region?: string
): Promise<Culture[]> => {
  const params: Record<string, string> = {};
  if (query) params.query = query;
  if (region) params.region = region;
  const { data } = await api.get<Culture[]>("/api/cultures/search", { params });
  return data;
};

export const getCultureBySlug = async (slug: string): Promise<Culture> => {
  const { data } = await api.get<Culture>(`/api/cultures/${slug}`);
  return data;
};


export const getRegions = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/api/cultures/regions");
  return data;
};



export const getCulturesByRegion = async (region: string): Promise<Culture[]> => {
  const resp = await axios.get("/api/cultures/search", {
    params: { region },
  });
  return resp.data;
};

export const getQuizByCulture = async (
  cultureId: number
): Promise<Quiz[]> => {
  const { data } = await api.get<Quiz[]>("/api/quiz", {
    params: { culture_id: cultureId },
  });
  return data;
};

export const generateQuiz = async (
  slug: string
): Promise<QuizItem[]> => {
  const { data } = await api.post<QuizItem[]>(`/api/quiz/generate/${slug}`);
  return data;
};

export const chatWithCulture = async (
  slug: string,
  question: string
): Promise<string> => {
  const { data } = await api.post<{ answer: string }>(`/api/chat/${slug}`, {
    question,
  });
  return data.answer;
};


export const chatGeneral = async (
  question: string
): Promise<string> => {
  const { data } = await api.post<{ answer: string }>(`/api/chat/`, {
    question,
  });
  return data.answer;
};