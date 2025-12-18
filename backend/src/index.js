
// backend/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

// Simplest permissive CORS
app.use(cors());

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json({ limit: "20mb" }));

// Root route for easy health check
app.get("/", (_, res) => res.json({ message: "FinAlogica Backend is running!" }));

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api", routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
