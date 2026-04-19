function revealOnScroll() {
  const elements = document.querySelectorAll(".reveal");

  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < window.innerHeight - 50) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

// CHAT UI
const toggleBtn = document.getElementById("toggleChat");
const chatBox = document.getElementById("chatBox");

if (toggleBtn) {
  toggleBtn.onclick = () => {
    chatBox.classList.toggle("hidden");
  };
}

async function send() {
  const input = document.getElementById("input");
  const message = input.value;

  const res = await fetch("https://TU-API.vercel.app/api/chat", { // 👈 IMPORTANTE
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  document.getElementById("messages").innerHTML += `
    <p><b>Tú:</b> ${message}</p>
    <p><b>Asistente:</b> ${data.reply}</p>
  `;

  input.value = "";
}

function quick(text) {
  document.getElementById("input").value = text;
  send();
}
