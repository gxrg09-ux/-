import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize safely. If no key, we will handle gracefully in UI.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateRoyalGreeting = async (recipient: string, tone: string): Promise<string> => {
  if (!ai) {
    return "Arix Signature: API Key missing. Please configure your environment to receive royal correspondence.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, luxurious, and cinematic Christmas greeting card message for ${recipient}. 
    The tone should be ${tone}. 
    Max 30 words. 
    Use sophisticated vocabulary (e.g., "opulence", "splendor", "gilded"). 
    Do not use emojis. 
    Sign it off as "The Arix Collection".`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.8, // Creative and elegant
      }
    });

    return response.text || "May your holidays be filled with golden splendor.";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "The stars are aligning. Please try again later for your royal decree.";
  }
};
