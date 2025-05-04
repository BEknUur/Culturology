// src/api/index.ts
import axios from "axios";
import type { Culture } from "@/types/culture";
import type { Quiz } from "@/types/quiz";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000", 
  // теперь api.get("/api/cultures") → http://localhost:8000/api/cultures
});

// ---------- CULTURES ----------
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

// ---------- MAP POINTS ----------
export interface Point {
  slug: string;
  name: string;
  lat: number;
  lng: number;
}
export const getMapPoints = async (): Promise<Point[]> => {
  const { data } = await api.get<Point[]>("/api/map");
  return data;
};

// ---------- QUIZ ----------
export const getQuizByCulture = async (
  cultureId: number
): Promise<Quiz[]> => {
  const { data } = await api.get<Quiz[]>("/api/quiz", {
    params: { culture_id: cultureId },
  });
  return data;
};

// ---------- CHAT BOT ----------
export const chatWithAI = async (
  slug: string,
  question: string
): Promise<string> => {
  const { data } = await api.post<{ answer: string }>(`/api/chat/${slug}`, {
    question,
  });
  return data.answer;
};
