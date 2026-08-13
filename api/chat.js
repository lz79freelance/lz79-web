const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const languageNames = {
      es: "español",
      gl: "gallego",
      eu: "euskera",
      cat: "catalán",
    };

    const idioma = languageNames[language] || "español";

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: `Eres Galia, el asistente de LZ79. Responde en ${idioma}. Sé clara, útil y natural.`,
      input: messages.slice(-12),
    });

    return res.status(200).json({
      reply: response.output_text || "No he podido generar una respuesta.",
    });

  } catch (error) {
    console.error("GALIA ERROR:", error);

    return res.status(500).json({
      error: error.message || "Error de OpenAI",
    });
  }
};
