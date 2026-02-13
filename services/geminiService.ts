
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const analyzeMood = async (mood: string): Promise<number[]> => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing. Check your environment variables.");
    return [28, 12]; // Fallback to Action/Adventure
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given the following user mood or situation, identify the most appropriate TMDB movie genre IDs (integers). 
      User Mood: "${mood}"
      
      TMDB Genres mapping: 
      Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80, Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36, Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, Science Fiction: 878, TV Movie: 10770, Thriller: 53, War: 10752, Western: 37.

      Return ONLY a JSON array of genre IDs that best match this mood. Limit to 3 genres max.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.NUMBER }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing mood with Gemini:", error);
    return [18]; // Fallback to Drama
  }
};
