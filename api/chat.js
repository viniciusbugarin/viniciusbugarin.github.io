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

    console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "OK" : "NO KEY");

    const messages = [
      {
        role: "system",
        content: `
Eres Vinicius Bugarin, desarrollador web profesional.
Tu objetivo es convertir visitantes en clientes.

Responde claro, directo y profesional.
`
      },
      { role: "user", content: message }
    ];

    // 🟢 GROQ (GRATIS)
    try {

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // ✅ MODELO NUEVO
          messages
        })
      });

      const groqData = await groqRes.json();

      console.log("Groq response:", groqData);

      if (groqRes.ok) {
        const reply = groqData?.choices?.[0]?.message?.content;
        if (reply) {
          return res.status(200).json({ reply });
        }
      }

    } catch (err) {
      console.log("Error Groq:", err);
    }

    // 🔴 SI FALLA TODO
    return res.status(500).json({
      error: "Groq no respondió"
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Error interno" });
  }
}
