import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fetch from "node-fetch";

// =========================
// SETUP
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env quietly (no logs)
dotenv.config({
  path: path.join(__dirname, ".env"),
  quiet: true
});

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());

const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// =========================
// ROUTES
// =========================

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "SentinelAI.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// =========================
// CHAT ROUTE
// =========================
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.MODEL,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data?.error?.message || "AI request failed"
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() || "No response";

    res.json({ reply });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Server failed" });
  }
});

// =========================
// SAFETY CRASH HANDLERS
// =========================
process.on("uncaughtException", (err) => {
  console.log("❌ CRASH:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ PROMISE CRASH:", err);
});

// =========================
// START SERVER (IMPORTANT)
// =========================
app.listen(PORT, () => {
  console.log("\n" + "\x1b[32m================================\x1b[0m");
  console.log("\x1b[36m   SENTINEL AI ENGINE ONLINE\x1b[0m");
  console.log("\x1b[32m================================\x1b[0m");

  console.log("\x1b[36m🌐 Server:\x1b[0m http://localhost:" + PORT);
  console.log("\x1b[32m🧠 Status:\x1b[0m READY");
  console.log("\x1b[33m⚡ Mode:\x1b[0m STABLE CORE ACTIVE");

  console.log("\x1b[35m================================\x1b[0m\n");
});
