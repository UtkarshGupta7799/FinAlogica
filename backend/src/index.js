
// backend/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: "20mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api", routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
