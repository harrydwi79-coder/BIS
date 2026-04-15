import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAKaEyQjnpe0qkC7UQHiTv7X3uWEF5yJh4";
const ai = new GoogleGenAI({ apiKey });

export const generateSuratDescription = async (perihal: string, tempat: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatkan deskripsi tugas yang profesional untuk surat tugas dengan perihal: "${perihal}" di lokasi: "${tempat}". Berikan dalam 2-3 kalimat yang formal.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return null;
  }
};
