import { GoogleGenAI } from "@google/genai";

export default async (req, context) => {
  // Asegurarse de que sea una petición POST
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

    // Inicializar el cliente oficial de Gemini usando la variable de entorno de Netlify
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Instrucciones estrictas de sistema para fijar la identidad, ubicación y tono de Galia
    const systemInstruction = `Eres Galia, el asistente inteligente oficial de LZ79freelance basado en O Porriño. Tu tono debe ser profesional, formal y técnico. El usuario se está comunicando en el idioma: ${language}. Responde estrictamente en ese idioma (Gallego, Euskera, Castellano o Catalán), manteniendo una coherencia absoluta sin saltos de idioma inesperados.`;

    // Mapear el historial al formato que exige el SDK de Gemini en Node.js
    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || "" }],
    }));

    // Llamada al modelo oficial de Gemini
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
};
