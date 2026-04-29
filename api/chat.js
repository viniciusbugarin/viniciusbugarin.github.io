export default async function handler(req, res) {

  // ==========================
  // 🌐 CORS (CONTROLADO)
  // ==========================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  // ==========================
  // 🛡️ RATE LIMIT (BÁSICO)
  // ==========================
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!global.rateLimit) global.rateLimit = new Map();

  const now = Date.now();
  const windowTime = 60 * 1000; // 1 min
  const limit = 20;

  const userData = global.rateLimit.get(ip) || { count: 0, time: now };

  if (now - userData.time < windowTime) {
    userData.count++;
    if (userData.count > limit) {
      return res.status(429).json({
        reply: "⚠️ Demasiadas peticiones. Espera unos segundos."
      });
    }
  } else {
    userData.count = 1;
    userData.time = now;
  }

  global.rateLimit.set(ip, userData);

  try {

    // ==========================
    // INPUT
    // ==========================
    let { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensaje inválido" });
    }

    message = sanitize(message);

    if (message.length < 2) {
      return res.status(400).json({ error: "Mensaje demasiado corto" });
    }

    // ==========================
    // 🧠 INTENT
    // ==========================
    const intent = detectIntent(message);

    // ==========================
    // 🧠 PROMPT DINÁMICO (CLAVE)
    // ==========================
    const systemPrompt = buildPrompt(intent);

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    // ==========================
    // ⚡ REQUEST A GROQ (ROBUSTO)
    // ==========================
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.6,
        max_tokens: 400
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!groqRes.ok) {
      const err = await groqRes.text();
      throw new Error(`Groq error: ${err}`);
    }

    const data = await groqRes.json();

    let reply = data?.choices?.[0]?.message?.content;

    // ==========================
    // 💰 OPTIMIZACIÓN CONVERSIÓN
    // ==========================
    reply = optimizeForConversion(reply, intent);

    // ==========================
    // LOGS PRO
    // ==========================
    console.log("CHAT:", {
      ip,
      intent,
      message,
      reply: reply?.slice(0, 80)
    });

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("❌ ERROR CHAT:", error);

    return res.status(500).json({
      reply: "⚠️ Algo ha fallado. Si quieres, cuéntame tu proyecto y te respondo personalmente."
    });
  }
}


// ==========================
// 🧠 PROMPT DINÁMICO
// ==========================
function buildPrompt(intent) {

  const base = `
Eres Vinicius Bugarin, desarrollador web especializado en:

- Automatización de procesos
- Herramientas digitales
- SEO técnico
- Webs orientadas a conversión

OBJETIVO:
Convertir visitantes en clientes.

REGLAS:
- Respuestas claras y directas
- Nada genérico
- Orientado a negocio
- Máximo 5 líneas
`;

  const intentPrompts = {
    price: "El usuario quiere precio. Sé claro pero invita a explicar su proyecto.",
    web: "El usuario quiere una web. Explica valor + invita a contacto.",
    automation: "El usuario quiere automatizar. Destaca ahorro de tiempo.",
    seo: "El usuario quiere posicionar. Explica impacto en negocio.",
    lead: "El usuario está interesado. Cierra conversación hacia contacto.",
    general: "Responde útil y lleva a conversación."
  };

  return base + "\n" + (intentPrompts[intent] || intentPrompts.general);
}


// ==========================
// 🧠 DETECTAR INTENCIÓN (MEJORADO)
// ==========================
function detectIntent(text) {

  const t = text.toLowerCase();

  if (/precio|cu[aá]nto cuesta|coste/.test(t)) return "price";
  if (/web|p[aá]gina|sitio/.test(t)) return "web";
  if (/automat|bot|proceso/.test(t)) return "automation";
  if (/seo|google|posicionar/.test(t)) return "seo";
  if (/proyecto|trabajar|contratar/.test(t)) return "lead";

  return "general";
}


// ==========================
// 🛡️ SANITIZE (SEGURIDAD)
// ==========================
function sanitize(text) {
  return text.replace(/[<>]/g, "").trim();
}


// ==========================
// 💰 CONVERSIÓN (MEJORADO)
// ==========================
function optimizeForConversion(reply, intent) {

  if (!reply) return "Cuéntame qué necesitas y te ayudo.";

  const ctas = {
    price: "💡 Cuéntame tu idea y te doy un presupuesto real.",
    web: "🚀 Puedo ayudarte a crearla. ¿Qué necesitas exactamente?",
    automation: "⚙️ Dime tu proceso y te propongo automatización.",
    seo: "📈 Si quieres posicionar, puedo ayudarte. ¿Qué buscas?",
    lead: "👉 Cuéntame tu proyecto y vemos cómo hacerlo.",
    general: "👉 Si quieres, cuéntame tu idea y lo vemos."
  };

  return `${reply}\n\n${ctas[intent] || ctas.general}`;
}