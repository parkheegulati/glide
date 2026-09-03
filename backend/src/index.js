require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const productsRouter = require("./routes/products");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve product images from /public
app.use(express.static(path.join(__dirname, "..", "public")));

// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/products", productsRouter);
app.use("/api/chat", chatRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "glide-api" });
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Glide API running on http://localhost:${PORT}`);
});
