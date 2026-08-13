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
    const { messages, language = "es" } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "No se han recibido mensajes",
      });
    }

    const cleanMessages = messages
      .slice(-MAX_MESSAGES)
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    if (!cleanMessages.length) {
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

    const selectedLanguage =
      languageNames[language] || languageNames.es;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: `
Eres Galia, el asistente inteligente de LZ79.

Responde siempre en ${selectedLanguage}, salvo que el usuario pida explícitamente otro idioma.

Tu función es ayudar de forma clara, útil y natural.
Si el usuario pregunta por LZ79, sus servicios o el proyecto Galia,
utiliza únicamente la información que esté disponible en la conversación
y no inventes datos.

Sé concisa pero útil.
      `,
      input: cleanMessages,
      max_output_tokens: 700,
    });

    return res.status(200).json({
      reply: response.output_text || "No he podido generar una respuesta.",
    });
  } catch (error) {
    console.error("Galia API error:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};
