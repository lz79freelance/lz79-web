const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 12;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Falta configurar OPENAI_API_KEY en Vercel",
      });
    }

    const body = req.body || {};
    const messages = body.messages;
    const language = body.language || "es";

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

    const languages = {
      es: "español",
      gl: "gallego",
      eu: "euskera",
      cat: "catalán",
    };

    const selectedLanguage = languages[language] || "español";

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: `
Eres Galia, el asistente inteligente de LZ79.

Responde en ${selectedLanguage}, salvo que el usuario solicite expresamente otro idioma.

Ayuda de forma clara, natural y útil.
No inventes información sobre LZ79 ni sobre sus servicios.
Si no conoces un dato, dilo claramente.

Sé concisa pero útil.
      `,
      input: cleanMessages,
      max_output_tokens: 700,
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      return res.status(502).json({
        error: "OpenAI no devolvió texto",
      });
    }

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("Galia API error:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Error al comunicarse con OpenAI",
    });
  }
};
