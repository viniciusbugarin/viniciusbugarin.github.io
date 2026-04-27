// ==========================
// CONFIG
// ==========================
const API_URL = "https://viniciusbugarin-github-io.vercel.app/api/chat";

// ==========================
// SCROLL ANIMATION (MEJORADO)
// ==========================
function revealOnScroll() {
  const elements = document.querySelectorAll(".reveal");

  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < window.innerHeight - 80) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll); // 👈 importante

// ==========================
// CHAT UI
// ==========================
const toggleBtn = document.getElementById("toggleChat");
const chatBox = document.getElementById("chatBox");
const messages = document.getElementById("messages");
const input = document.getElementById("input");

if (toggleBtn && chatBox) {
  toggleBtn.onclick = () => {
    chatBox.classList.toggle("hidden");
  };
}

// ==========================
// GUARDAR CHAT (UX PRO)
// ==========================
function saveChat() {
  localStorage.setItem("chat_history", messages.innerHTML);
}

function loadChat() {
  const saved = localStorage.getItem("chat_history");
  if (saved) messages.innerHTML = saved;
}

window.addEventListener("load", loadChat);

// ==========================
// SEND MESSAGE
// ==========================
async function send() {
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const typing = addTyping();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    // 🔥 error backend
    if (!res.ok) {
      throw new Error("Error servidor");
    }

    const data = await res.json();

    removeTyping(typing);

    if (!data.reply) {
      addMessage("No he podido responder correctamente.", "bot");
      return;
    }

    addMessage(data.reply, "bot");

  } catch (error) {
    removeTyping(typing);

    addMessage("⚠️ Error de conexión. Inténtalo de nuevo.", "bot");
    console.error(error);
  }

  scrollToBottom();
  saveChat(); // 💾 guardar conversación
}

// ==========================
// QUICK BUTTONS
// ==========================
function quick(text) {
  input.value = text;
  send();
}

// ==========================
// ADD MESSAGE (UI PRO)
// ==========================
function addMessage(text, type) {
  const div = document.createElement("div");

  div.classList.add("message", type);

  // 🔥 formato tipo chat real
  div.innerHTML = `
    <span class="bubble">${text}</span>
  `;

  messages.appendChild(div);
  scrollToBottom();

  return div;
}

// ==========================
// TYPING EFECTO PRO
// ==========================
function addTyping() {
  const div = document.createElement("div");
  div.classList.add("message", "bot");
  div.id = "typing";

  div.innerHTML = `
    <span class="bubble typing">
      <span></span><span></span><span></span>
    </span>
  `;

  messages.appendChild(div);
  scrollToBottom();

  return div;
}

function removeTyping(el) {
  if (el) el.remove();
}

// ==========================
// AUTO SCROLL
// ==========================
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

// ==========================
// ENTER PARA ENVIAR
// ==========================
input?.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    send();
  }
});

// ==========================
// AUTOFOCUS (UX PRO)
// ==========================
window.addEventListener("load", () => {
  input?.focus();
});