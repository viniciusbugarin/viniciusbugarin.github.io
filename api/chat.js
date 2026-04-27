export default async function handler(req, res) {

  // ==========================
  // 🌐 CORS (PRO)
  // ==========================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {

    const { message } = req.body || {};

    if (!message || message.trim().length < 2) {
      return res.status(400).json({ error: "Mensaje inválido" });
    }

    // ==========================
    // 🧠 DETECCIÓN INTENCIÓN (🔥 CLAVE NEGOCIO)
    // ==========================
    const intent = detectIntent(message);

    // ==========================
    // 🧠 SYSTEM PROMPT ULTRA PRO
    // ==========================
    const systemPrompt = `
Eres Vinicius Bugarin, desarrollador web especializado en:

- Automatización de procesos
- Desarrollo de herramientas digitales
- Webs orientadas a conversión
- SEO técnico

OBJETIVO PRINCIPAL:
Convertir visitantes en clientes.

REGLAS:
- Respuestas claras, cortas y profesionales
- No dar respuestas genéricas
- Siempre orientar a solución
- Si detectas interés → invita a contacto

ESTILO:
- Directo
- Cercano
- Experto

CTA:
- Si el usuario muestra interés, invítale a trabajar contigo
- Puedes sugerir: "Cuéntame tu proyecto y te ayudo"
`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    // ==========================
    // ⚡ GROQ API (OPTIMIZADO)
    // ==========================
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      throw new Error("Error en Groq API");
    }

    let reply = data?.choices?.[0]?.message?.content;

    // ==========================
    // 💰 OPTIMIZACIÓN CONVERSIÓN
    // ==========================
    reply = optimizeForConversion(reply, intent);

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("❌ ERROR:", error);

    return res.status(500).json({
      reply: "⚠️ Ha habido un problema. Si quieres, cuéntame tu proyecto y te respondo manualmente."
    });
  }
}


// ==========================
// 🧠 DETECTAR INTENCIÓN
// ==========================
function detectIntent(text) {

  const t = text.toLowerCase();

  if (t.includes("precio") || t.includes("cuánto cuesta")) return "price";
  if (t.includes("web") || t.includes("pagina")) return "web";
  if (t.includes("automat")) return "automation";
  if (t.includes("seo")) return "seo";
  if (t.includes("proyecto") || t.includes("trabajar")) return "lead";

  return "general";
}


// ==========================
// 💰 MEJORAR RESPUESTA PARA CONVERSIÓN
// ==========================
function optimizeForConversion(reply, intent) {

  if (!reply) return "Cuéntame un poco más sobre lo que necesitas.";

  switch (intent) {

    case "price":
      return reply + "\n\n💡 Si quieres, dime qué tipo de web necesitas y te doy un presupuesto aproximado.";

    case "web":
      return reply + "\n\n🚀 Puedo ayudarte a crear una web optimizada para clientes. ¿Qué tipo de proyecto tienes en mente?";

    case "automation":
      return reply + "\n\n⚙️ La automatización puede ahorrarte mucho tiempo. Cuéntame tu caso y te propongo solución.";

    case "seo":
      return reply + "\n\n📈 Si quieres posicionar en Google, puedo ayudarte desde el desarrollo. ¿Qué objetivo tienes?";

    case "lead":
      return reply + "\n\n👉 Cuéntame tu proyecto y te digo cómo lo haría.";

    default:
      return reply + "\n\n👉 Si quieres, cuéntame tu idea y te ayudo a convertirla en algo real.";
  }
}