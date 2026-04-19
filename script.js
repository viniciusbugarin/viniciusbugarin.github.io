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

import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer TU_API_KEY`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto desarrollador web y asesor profesional."
        },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.listen(3000, () => console.log("Server running"));
const toggleBtn = document.getElementById("toggleChat");
const chatBox = document.getElementById("chatBox");

toggleBtn.onclick = () => {
  chatBox.classList.toggle("hidden");
};

async function send() {
  const input = document.getElementById("input");
  const message = input.value;

  const res = await fetch("/api/chat", {
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
