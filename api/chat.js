import { GoogleGenAI } from "@google/genai";

export default async function handler(req, context) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const language = body.language || "es";
    const messages = body.messages || [];

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `Eres Galia, el asistente inteligente oficial de LZ79freelance basado en O Porriño. Tu tono debe ser profesional, formal y técnico. El usuario se está comunicando en el idioma: ${language}. Responde estrictamente en ese idioma (Gallego, Euskera, Castellano o Catalán), manteniendo una coherencia absoluta sin saltos de idioma inesperados.`;

    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || "" }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      },
    });

    return new Response(JSON.stringify({ reply: response.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
