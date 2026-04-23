export default async function handler(req, res) {

  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    // 🔥 CONTEXTO PRO (VENDE POR TI)
    const messages = [
      {
        role: "system",
        content: `
Eres Vinicius Bugarin, desarrollador web profesional.
Tu objetivo es ayudar y convertir visitantes en clientes.

Responde de forma clara, profesional y orientada a negocio.

Servicios:
- Desarrollo web
- Automatización
- Calculadoras y simuladores

Si el usuario muestra interés:
- ofrece ayuda
- sugiere proyecto
- invita a contactar
`
      },
      { role: "user", content: message }
    ];

    // 🟢 1. INTENTAR CON GROQ (GRATIS)
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages
        })
      });

      const groqData = await groqRes.json();

      if (groqRes.ok) {
        const reply = groqData?.choices?.[0]?.message?.content;
        if (reply) {
          return res.status(200).json({ reply });
        }
      }

      console.log("Groq falló, usando OpenAI...");

    } catch (err) {
      console.log("Error Groq:", err);
    }

    // 🔁 2. FALLBACK A OPENAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages
      })
    });

    const openaiData = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(500).json({
        error: "Error en IA",
        details: openaiData
      });
    }

    const reply = openaiData?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "Respuesta vacía"
      });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Error interno" });
  }
}
