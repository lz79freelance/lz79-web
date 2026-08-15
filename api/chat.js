const { GoogleGenAI } = require('@google/genai');

const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 12;

const ai = new GoogleGenAI();

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" })
    };
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Falta configurar GEMINI_API_KEY en las variables de entorno de Netlify" })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const messages = body.messages;
    const language = body.language || "es";

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No se han recibido mensajes" })
      };
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
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Mensajes inválidos" })
      };
    }

    const languageNames = {
      es: "español",
      gl: "gallego",
      eu: "euskera",
      cat: "catalán",
    };

    const idioma = languageNames[language] || "español";

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
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Google Gemini no devolvió texto" })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("GALIA ERROR:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error?.message || "Error al comunicarse con Google Gemini" })
    };
  }
};
};
