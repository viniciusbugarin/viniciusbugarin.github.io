export default async function handler(req, res) {

  // ✅ CORS (MUY IMPORTANTE)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight (necesario para fetch)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Solo permitir POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un asistente experto en desarrollo web que ayuda a clientes y recomienda soluciones."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error OpenAI:", data);
      return res.status(500).json({
        error: "Error en OpenAI"
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "Respuesta inválida"
      });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Error servidor:", error);

    return res.status(500).json({
      error: "Error interno"
    });
  }
}
