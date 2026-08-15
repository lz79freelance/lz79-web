import { GoogleGenAI } from '@google/genai';

// Inicializa el cliente cogiendo automáticamente la variable GEMINI_API_KEY de Vercel
const ai = new GoogleGenAI();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  try {
    const { messages, language = "es" } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "No se han recibido mensajes",
      });
    }

    const languageNames = {
      es: "español",
      gl: "gallego",
      eu: "euskera",
      cat: "catalán",
    };

    const idioma = languageNames[language] || "español";

    // Tomamos los últimos mensajes (hasta 12) para mantener el contexto
    const ultimosMensajes = messages.slice(-12);

    // Formateamos el historial al estándar que espera la SDK de Google GenAI
    // (Mapeando los roles de usuario/asistente y convirtiendo el contenido)
    const historialFormateado = ultimosMensajes.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: historialFormateado,
      config: {
        systemInstruction: `Eres Galia, el asistente de LZ79 con estilo aviador. Responde en ${idioma}. Sé clara, útil y natural.`,
      }
    });

    return res.status(200).json({
      reply: response.text || "No he podido generar una respuesta.",
    });

  } catch (error) {
    console.error("GALIA ERROR:", error);

    return res.status(500).json({
      error: error.message || "Error de Google Gemini",
    });
  }
};
