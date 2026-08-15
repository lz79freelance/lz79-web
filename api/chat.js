exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Método no permitido" }) };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "Falta configurar GEMINI_API_KEY en Netlify" }) };
    }

    const body = JSON.parse(event.body || "{}");
    const messages = body.messages || [];
    const language = body.language || "es";

    const languageNames = {
      es: "español",
      gl: "gallego",
      eu: "euskera",
      cat: "catalán",
    };
    const idioma = languageNames[language] || "español";

    // Transformar historial al formato de la API REST de Gemini
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: `Eres Galia, el asistente inteligente de LZ79. Responde en ${idioma}, de forma clara, concisa y útil.` }]
        },
        contents: contents
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Error en la API de Gemini");
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sin respuesta generada";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("ERROR EN CHAT:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Error interno del servidor" })
    };
  }
};
