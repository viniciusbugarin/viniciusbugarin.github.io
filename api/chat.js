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

    // 🔍 DEBUG
    console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "OK" : "NO KEY");
    console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "OK" : "NO KEY");

    // 🔥 CONTEXTO OPTIMIZADO (VENDE)
    const messages = [
      {
        role: "system",
        content: `
Eres Vinicius Bugarin, desarrollador web freelance.

Tu objetivo es:
- ayudar al usuario
- detectar necesidades
- proponer soluciones
- convertir en cliente

Responde:
- claro
- directo
- profesional
- sin rodeos

Servicios:
- páginas web
- automatización
- calculadoras y herramientas

Si el usuario muestra interés:
- sugiere proyecto
- menciona beneficios
- invita a contactar
`
      },
      { role: "user", content: message }
    ];

    // 🟢 GROQ (PRIORIDAD)
    try {
      console.log("🚀 Intentando GROQ...");

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // ✅ FIX
          messages,
          temperature: 0.7
        })
      });

      const groqData = await groqRes.json();
      console.log("📦 GROQ:", groqData);

      if (groqRes.ok) {
        const reply = groqData?.choices?.[0]?.message?.content;

        if (reply) {
          console.log("✅ Respuesta GROQ");
          return res.status(200).json({ reply });
        }
      }

      console.log("⚠️ Groq sin respuesta válida");

    } catch (err) {
      console.log("❌ Error GROQ:", err);
    }

    // 🔁 OPENAI (FALLBACK)
    try {
      console.log("🔁 Usando OpenAI...");

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7
        })
      });

      const openaiData = await openaiRes.json();
      console.log("📦 OpenAI:", openaiData);

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

      console.log("✅ Respuesta OpenAI");
      return res.status(200).json({ reply });

    } catch (err) {
      console.log("❌ Error OpenAI:", err);
    }

    // 🚨 FALLBACK FINAL (UX IMPORTANTE)
    return res.status(200).json({
      reply: "Ahora mismo no puedo responder, pero puedes escribirme directamente y te ayudo con tu proyecto."
    });

  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ error: "Error interno" });
  }
}
