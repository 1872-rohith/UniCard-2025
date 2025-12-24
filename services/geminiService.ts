import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCampusInsights = async (query: string): Promise<SearchResult> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a helpful assistant for a university campus app. Provide concise summaries of relevant events, news, or academic trends based on the user's query. Always include source links.",
      },
    });

    const text = response.text || "No information found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .map((chunk: any) => chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : null)
      .filter((source: any) => source !== null) as { uri: string; title: string }[];

    // De-duplicate sources
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return {
      text,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Error fetching campus insights:", error);
    return {
      text: "Unable to fetch external insights at this moment. Please try again later.",
      sources: []
    };
  }
};
