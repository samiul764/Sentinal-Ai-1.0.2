"use strict";

/* =========================
   SENTINEL AI CORE v2 PRO
========================= */

// ===== SAFE DOM ACCESS =====
const $ = (id) => document.getElementById(id);

const chatEl = $("chat");
const inputEl = $("userInput");
const sendBtn = $("sendBtn");
const clearBtn = $("clearBtn");
const uploadBtn = $("uploadBtn");
const translateBtn = $("translateBtn");
const fileInput = $("fileInput");
const newChatBtn = $("newChatBtn");
const recentChats = $("recentChats");

const botSound = $("botSound");
const statusEl = $("serverStatus");

let translateMode = false;
let thinkingLock = false;

// ===== AI CONFIG =====
const AI_NAME = "SentinelAI";
const AI_VERSION = "v2-Pro";

// ===== TRIGGERS =====
const triggers = new Map([
  ["who created you", "🛠️ Created by Samiul Azim Prottoy — SentinelAI System Architect."],
  ["who developed you", "🛠️ Engineered by Samiul Azim Prottoy."],
  ["your name", "I am SentinelAI — Cyber Defense Intelligence System."],
  ["what's your purpose", "🎯 I analyze, protect, and assist with cyber intelligence."],
  ["what are you", "🧠 I am a defensive AI system built for structured reasoning."]
]);

// ===== BANGLA =====
const bangla = {
  hello: "আসসালামু আলাইকুম। আমি SentinelAI, কীভাবে সাহায্য করতে পারি?",
  hi: "আসসালামু আলাইকুম। বলুন কী লাগবে?",
  hey: "জি বলুন, আমি আছি।",
  salam: "ওয়ালাইকুমুস সালাম।"
};

// ===== UTIL =====
function normalize(text = "") {
  return text.toLowerCase().trim();
}

// ===== UI MESSAGE =====
function addMessage(role, text) {
  if (!chatEl || !text) return;

  const row = document.createElement("div");
  row.className = `message-row ${role}-row`;

  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${role}`;

  // USER message (no name)
  if (role === "user") {
    bubble.textContent = text;
  }

  // BOT message (with AI name label)
  if (role === "bot") {
    const nameTag = document.createElement("div");
    nameTag.className = "ai-name-tag";
    nameTag.textContent = AI_NAME;

    const msgText = document.createElement("div");
    msgText.className = "ai-message-text";
    msgText.textContent = text;

    bubble.appendChild(nameTag);
    bubble.appendChild(msgText);
  }

  row.appendChild(bubble);
  chatEl.appendChild(row);

  chatEl.scrollTop = chatEl.scrollHeight;
}

// ===== THINKING =====
function showThinking() {
  if (!chatEl || thinkingLock) return null;

  thinkingLock = true;

  const row = document.createElement("div");
  row.className = "message-row bot-row thinking";

  row.innerHTML = `
    <div class="message-bubble bot thinking-bubble">

      <div class="scan-header">
        <span class="scan-dot"></span>
        <span class="scan-title">NEURAL ENGINE ACTIVE</span>
      </div>

      <div class="scan-text" id="scanText">
        Initializing system...
      </div>

      <div class="scan-bar">
        <div class="scan-fill"></div>
      </div>

    </div>
  `;

  chatEl.appendChild(row);
  chatEl.scrollTop = chatEl.scrollHeight;

  // animated text cycle
  const texts = [
    "Analyzing input patterns...",
    "Scanning knowledge database...",
    "Processing neural weights...",
    "Generating response vectors...",
    "Finalizing output..."
  ];

  let i = 0;
  const textEl = row.querySelector("#scanText");

  const interval = setInterval(() => {
    if (!textEl) return;
    textEl.textContent = texts[i % texts.length];
    i++;
  }, 700);

  row.dataset.interval = interval;

  return row;
}
function clearThinking(node) {
  thinkingLock = false;

  if (node?.dataset?.interval) {
    clearInterval(node.dataset.interval);
  }

  node?.remove();
}

// ===== SOUND =====
function playSound() {
  if (!botSound) return;
  botSound.currentTime = 0;
  botSound.play().catch(() => {});
}

// =========================
// CHAT ENGINE (WITH LOADING DELAY)
// =========================
async function sendMessage(text) {
  const msg = normalize(text);
  if (!msg || !chatEl) return;

  addMessage("user", text);
  if (inputEl) inputEl.value = "";

  // triggers
  for (const [key, value] of triggers.entries()) {
    if (msg.includes(key)) {
      addMessage("bot", value);
      playSound();
      return;
    }
  }

  // bangla
  if (translateMode && bangla[msg]) {
    addMessage("bot", bangla[msg]);
    playSound();
    return;
  }

  const thinking = showThinking();

  const startTime = Date.now();
  const MIN_LOADING = 3500; // 3.5 seconds minimum

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: text,
        system: {
          name: AI_NAME,
          mode: translateMode ? "bn" : "en"
        }
      })
    });

    const data = await response.json();

    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, MIN_LOADING - elapsed);

    setTimeout(() => {
      clearThinking(thinking);

      addMessage(
        "bot",
        data?.reply || "⚠️ SentinelAI could not generate response."
      );

      playSound();
    }, wait);

  } catch (err) {
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, MIN_LOADING - elapsed);

    setTimeout(() => {
      clearThinking(thinking);
      addMessage("bot", "⚠️ Connection failure. System offline.");
    }, wait);

    console.error(err);
  }
}

// ===== CHAT SYSTEM =====
function createNewChat(name) {
  if (!recentChats) return;

  const item = document.createElement("button");
  item.className = "recent-chat-item";
  item.textContent = name;

  item.onclick = () => {
    if (chatEl) chatEl.innerHTML = "";
    addMessage("bot", `🔰 New session started: ${name}`);
  };

  recentChats.prepend(item);
}

// ===== EVENTS =====
sendBtn?.addEventListener("click", () => {
  sendMessage(inputEl?.value || "");
});

inputEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn?.click();
  }
});

clearBtn?.addEventListener("click", () => {
  if (chatEl) chatEl.innerHTML = "";
});

uploadBtn?.addEventListener("click", () => fileInput?.click());

fileInput?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file?.type.startsWith("image")) return;

  new FileReader().readAsDataURL(file);
  addMessage("user", "[Image Uploaded]");
});

translateBtn?.addEventListener("click", () => {
  translateMode = !translateMode;
  translateBtn.textContent = translateMode ? "🌐 বাংলা ON" : "বাংলা";
});

newChatBtn?.addEventListener("click", () => {
  const name = prompt("Enter session name:");
  if (!name) return;

  createNewChat(name);
  if (chatEl) chatEl.innerHTML = "";
});

// ===== INIT =====
if (chatEl && !chatEl.innerHTML.trim()) {
  addMessage("bot", `${AI_NAME} ${AI_VERSION} Online — Ready.`);
}

// =========================
// SERVER STATUS SYSTEM
// =========================
async function checkServerStatus() {
  if (!statusEl) return;

  const start = performance.now();

  statusEl.className = "status checking";
  statusEl.innerHTML = "<span class='dot'></span> CHECKING...";

  try {
    const res = await fetch("/health", { cache: "no-store" });

    if (!res.ok) throw new Error();

    const ping = Math.round(performance.now() - start);

    statusEl.className = "status online";
    statusEl.innerHTML = `<span class="dot"></span> ONLINE • ${ping}ms`;

  } catch (err) {
    statusEl.className = "status offline";
    statusEl.innerHTML = "<span class='dot'></span> OFFLINE";
  }
}

// start loop
checkServerStatus();
setInterval(checkServerStatus, 5000);

console.log(`🧠 ${AI_NAME} CORE v2 PRO LOADED`);
