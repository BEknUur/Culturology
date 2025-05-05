
import axios from "axios";

export interface MediaItem {
  id: number;
  type: "video" | "audio";
  url: string;
  thumbnail?: string;
  caption?: string;
  subtitles_url?: string;
  duration?: number;
}

const mediaApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
});

export const getMediaItems = async (): Promise<MediaItem[]> => {
  const { data } = await mediaApi.get<MediaItem[]>("/api/media");
  return data;
};
