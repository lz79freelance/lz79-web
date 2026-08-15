import { GoogleGenAI } from '@google/genai';

const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 12;

// Inicializa el SDK usando automáticamente process.env.GEMINI_API_KEY
const ai = new GoogleGenAI();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Falta configurar GEMINI_API_KEY en Vercel",
      });
    }

    const { messages, language = "es" } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "No se han recibido mensajes",
      });
    }

    const cleanMessages = messages
      .slice(-MAX_MESSAGES)
      .filter(
        (message) =>
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string"
      )
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    if (cleanMessages.length === 0) {
      return res.status(400).json({
        error: "Mensajes inválidos",
      });
    }

    const languageNames = {
      es: "español",
      gl: "gallego",
      eu: "euskera",
      cat: "catalán",
    };

    const idioma = languageNames[language] || "español";

    // Formatear al estándar de Google GenAI (los roles de asistente se mapean como 'model')
    const historialFormateado = cleanMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: historialFormateado,
      config: {
        systemInstruction: `Eres Galia, el asistente inteligente de LZ79. Responde en ${idioma}, salvo que el usuario solicite expresamente otro idioma. Ayuda de forma clara, natural y útil. No inventes información sobre LZ79 ni sobre sus servicios. Si no conoces un dato, dilo claramente. Sé concisa pero útil.`,
      }
    });

    const reply = response.text?.trim();

    if (!reply) {
      return res.status(502).json({
        error: "Google Gemini no devolvió texto",
      });
    }

    return res.status(200).json({
      reply,
    });

  } catch (error) {
    console.error("GALIA ERROR:", error);

    return res.status(500).json({
      error: error?.message || "Error al comunicarse con Google Gemini",
    });
  }
}
