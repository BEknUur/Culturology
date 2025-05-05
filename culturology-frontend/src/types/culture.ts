export interface Image {
    url: string;
    caption?: string | null;
  }

  export interface MediaItem {
    type: "image" | "video";
    url: string;               
    thumbnail?: string;        
    caption?: string | null;   
    audioUrl?: string;         
    subtitlesUrl?: string;     
  }
  
  export interface Culture {
    id: number;
    slug: string;
    name: string;
    region?: string | null;
    location?: string | null;
    population?: number | null;
    language?: string | null;
    about?: string | null;
    traditions?: string | null;
    lifestyle?: string | null;
    gallery: Image[];
  }