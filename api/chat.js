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
  // 🛡️ RATE LIMIT (MEJORADO)
  // ==========================
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!global.rateLimit) global.rateLimit = new Map();

  const now = Date.now();
  const windowTime = 60000;
  const limit = 25;

  const user = global.rateLimit.get(ip) || { count: 0, time: now };

  if (now - user.time < windowTime) {
    user.count++;
    if (user.count > limit) {
      return res.status(429).json({
        reply: "⚠️ Demasiadas peticiones. Espera unos segundos."
      });
    }
  } else {
    user.count = 1;
    user.time = now;
  }

  global.rateLimit.set(ip, user);

  // 🔥 limpiar memoria (CLAVE)
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
    // 🧠 SCORING PRO
    // ==========================
    const score = calculateScore(lead, intent);

    // ==========================
    // 💾 GUARDAR SIEMPRE (CLAVE)
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
    // 🔥 CIERRE DIRECTO SI HAY CONTACTO
    // ==========================
    if (lead.contact) {
      return res.status(200).json({
        reply: closeLeadMessage(score)
      });
    }

    // ==========================
    // 🤖 IA
    // ==========================
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    let reply = null;

    try {

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (groqRes.ok) {
        const data = await groqRes.json();
        reply = data?.choices?.[0]?.message?.content;
      }

    } catch (e) {
      console.error("Groq fallo:", e);
    }

    // ==========================
    // 🧠 FALLBACK INTELIGENTE
    // ==========================
    if (!reply) {
      reply = fallbackReply(intent);
    }

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
// 🧠 INTENT (MEJORADO)
//////////////////////////////////////////////////

function detectIntent(text) {
  const t = text.toLowerCase();

  if (/precio|coste|cu[aá]nto/.test(t)) return "price";
  if (/web|pagina|sitio/.test(t)) return "web";
  if (/automat|bot|proceso/.test(t)) return "automation";
  if (/seo|google/.test(t)) return "seo";
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
// 🎯 SCORING REAL
//////////////////////////////////////////////////

function calculateScore(lead, intent) {
  let score = 0;

  if (lead?.budget >= 1500) score += 3;
  if (intent === "automation") score += 3;
  if (intent === "web") score += 2;
  if (intent === "hot") score += 4;
  if (lead?.contact) score += 5;

  return score;
}

//////////////////////////////////////////////////
// 🧠 PROMPT PRO (VENTAS)
//////////////////////////////////////////////////

function buildPrompt(intent, score) {
  return `
Eres un desarrollador web experto en cerrar clientes.

OBJETIVO:
Convertir visitantes en clientes.

ESTILO:
- Directo
- Persuasivo
- Máx 3-4 líneas
- Lenguaje claro

CONTEXTO:
Intent: ${intent}
Score: ${score}

REGLAS:
- No expliques demasiado
- Empuja a contacto
- Si está interesado → cerrar
`;
}

//////////////////////////////////////////////////
// 🔥 CIERRE
//////////////////////////////////////////////////

function closeLeadMessage(score) {

  if (score >= 7) {
    return `🔥 Esto encaja perfecto.

👉 Te escribo ahora mismo y lo vemos rápido.`;
  }

  return "👌 Te contacto en breve con una propuesta.";
}

//////////////////////////////////////////////////
// 💬 FALLBACK
//////////////////////////////////////////////////

function fallbackReply(intent) {
  const replies = {
    web: "Puedo ayudarte a crear una web que genere clientes.",
    automation: "La automatización puede ahorrarte mucho tiempo.",
    price: "Depende del proyecto, pero puedo orientarte rápido.",
    hot: "Perfecto, esto encaja bien.",
    general: "Cuéntame qué necesitas."
  };

  return replies[intent] || replies.general;
}

//////////////////////////////////////////////////
// 💰 OPTIMIZACIÓN CONVERSIÓN
//////////////////////////////////////////////////

function optimizeReply(reply, intent, score) {

  if (score >= 6) {
    return reply + "\n\n🔥 Déjame tu email y lo vemos hoy mismo.";
  }

  return reply + "\n\n👉 Cuéntame más detalles.";
}

//////////////////////////////////////////////////
// 🛡️ SANITIZE
//////////////////////////////////////////////////

function sanitize(text) {
  return text.replace(/[<>]/g, "").trim();
}

//////////////////////////////////////////////////
// 💾 SAVE LEAD (NO BLOQUEANTE)
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