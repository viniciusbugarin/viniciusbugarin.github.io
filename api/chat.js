export default async function handler(req, res) {

  // ==========================
  // 🌐 CORS
  // ==========================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  // ==========================
  // 🛡️ RATE LIMIT PRO + CLEAN
  // ==========================
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!global.rateLimit) global.rateLimit = new Map();

  const now = Date.now();
  const windowTime = 60000;
  const limit = 30;

  const user = global.rateLimit.get(ip) || { count: 0, time: now };

  if (now - user.time < windowTime) {
    user.count++;
    if (user.count > limit) {
      return res.status(429).json({
        reply: "⚠️ Muchas peticiones. Espera un momento."
      });
    }
  } else {
    user.count = 1;
    user.time = now;
  }

  global.rateLimit.set(ip, user);

  // limpiar memoria
  for (const [key, val] of global.rateLimit.entries()) {
    if (now - val.time > windowTime) {
      global.rateLimit.delete(key);
    }
  }

  try {

    // ==========================
    // INPUT
    // ==========================
    let { message, lead = {} } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensaje inválido" });
    }

    message = sanitize(message);

    // ==========================
    // 🧠 INTENT + CONTACT
    // ==========================
    const intent = detectIntent(message);
    const contact = detectContact(message);

    if (contact) lead.contact = contact;

    // ==========================
    // 🧠 SCORING AVANZADO
    // ==========================
    const score = calculateScore(lead, intent, message);

    // ==========================
    // 💾 GUARDAR SIEMPRE (CRM)
    // ==========================
    saveLeadSafe({
      ...lead,
      message,
      intent,
      score,
      ip,
      date: new Date().toISOString()
    });

    // ==========================
    // 🔥 CIERRE DIRECTO (CLAVE)
    // ==========================
    if (lead.contact) {
      return res.status(200).json({
        reply: closeLeadMessage(score, intent)
      });
    }

    // ==========================
    // 🤖 IA
    // ==========================
    let reply = await generateAIReply(message, intent, score);

    // ==========================
    // 💰 OPTIMIZACIÓN CONVERSIÓN
    // ==========================
    reply = optimizeReply(reply, intent, score);

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("❌ ERROR:", error);

    return res.status(500).json({
      reply: "⚠️ Dime qué necesitas y te ayudo personalmente."
    });
  }
}

//////////////////////////////////////////////////
// 🤖 IA ROBUSTA
//////////////////////////////////////////////////

async function generateAIReply(message, intent, score) {

  try {

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: buildPrompt(intent, score) },
          { role: "user", content: message }
        ],
        temperature: 0.5,
        max_tokens: 200
      })
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    return data?.choices?.[0]?.message?.content;

  } catch {
    return fallbackReply(intent);
  }
}

//////////////////////////////////////////////////
// 🧠 INTENT PRO
//////////////////////////////////////////////////

function detectIntent(text) {
  const t = text.toLowerCase();

  if (/precio|coste|cu[aá]nto/.test(t)) return "price";
  if (/web|pagina|sitio/.test(t)) return "web";
  if (/automat|bot|proceso/.test(t)) return "automation";
  if (/seo|google/.test(t)) return "seo";
  if (/urgente|ya|rápido/.test(t)) return "urgent";
  if (/quiero|necesito|busco/.test(t)) return "hot";

  return "general";
}

//////////////////////////////////////////////////
// 📞 CONTACT
//////////////////////////////////////////////////

function detectContact(text) {
  const email = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  const phone = text.match(/\b\d{9}\b/);
  return email?.[0] || phone?.[0] || null;
}

//////////////////////////////////////////////////
// 🎯 SCORING REAL (CLAVE)
//////////////////////////////////////////////////

function calculateScore(lead, intent, message) {

  let score = 0;

  if (lead?.budget >= 1500) score += 3;
  if (intent === "automation") score += 3;
  if (intent === "web") score += 2;
  if (intent === "urgent") score += 3;
  if (intent === "hot") score += 4;
  if (lead?.contact) score += 5;

  if (/empresa|negocio/.test(message.toLowerCase())) score += 2;

  return score;
}

//////////////////////////////////////////////////
// 🧠 PROMPT VENTAS REAL
//////////////////////////////////////////////////

function buildPrompt(intent, score) {
  return `
Eres un desarrollador web experto en cerrar clientes.

OBJETIVO:
Convertir visitantes en clientes.

ESTILO:
- Muy directo
- Persuasivo
- Máx 3 líneas

CONTEXTO:
Intent: ${intent}
Score: ${score}

REGLAS:
- Si está interesado → cerrar
- Empujar a contacto siempre
- Hablar en términos de negocio (clientes, dinero, resultados)
`;
}

//////////////////////////////////////////////////
// 🔥 CIERRE REAL
//////////////////////////////////////////////////

function closeLeadMessage(score, intent) {

  if (score >= 8) {
    return `🔥 Esto encaja perfecto.

👉 Te escribo ahora mismo y te preparo una estrategia para conseguir clientes.`;
  }

  if (score >= 5) {
    return `👌 Perfecto.

👉 Te contacto y te explico cómo lo enfocaría.`;
  }

  return `👌 Genial.

👉 Te escribo y vemos opciones.`;
}

//////////////////////////////////////////////////
// 💬 FALLBACK
//////////////////////////////////////////////////

function fallbackReply(intent) {

  const replies = {
    web: "Puedo ayudarte a crear una web que genere clientes.",
    automation: "Automatizar puede ahorrarte tiempo y dinero.",
    price: "Depende del proyecto, pero puedo orientarte.",
    urgent: "Perfecto, podemos hacerlo rápido.",
    hot: "Esto encaja bien.",
    general: "Cuéntame qué necesitas."
  };

  return replies[intent] || replies.general;
}

//////////////////////////////////////////////////
// 💰 CONVERSIÓN (CLAVE)
//////////////////////////////////////////////////

function optimizeReply(reply, intent, score) {

  if (!reply) return "Cuéntame qué necesitas.";

  if (score >= 7) {
    return reply + "\n\n🔥 Déjame tu email y lo vemos hoy mismo.";
  }

  if (intent === "price") {
    return reply + "\n\n💡 Dime tu idea y te doy precio exacto.";
  }

  return reply + "\n\n👉 Cuéntame más.";
}

//////////////////////////////////////////////////
// 🛡️ SANITIZE
//////////////////////////////////////////////////

function sanitize(text) {
  return text.replace(/[<>]/g, "").trim();
}

//////////////////////////////////////////////////
// 💾 CRM (MAKE)
//////////////////////////////////////////////////

function saveLeadSafe(data) {
  fetch("https://hook.eu1.make.com/2yahcl1bade5wz61gt54juj0zj2bdb7x", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).catch(() => {});
}