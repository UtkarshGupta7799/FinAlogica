
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
// Temporary seed route (since shell is disabled)
import { pool } from "./services/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

app.get("/setup-db", async (_, res) => {
    try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const rootDir = path.resolve(__dirname, "..");

        // Hardcoded schema for safety if file read fails to resolve paths relative to src correctly
        // or just read from known location
        const schemaSql = fs.readFileSync(path.join(rootDir, "db", "schema.sql"), "utf8");
        const seedSql = fs.readFileSync(path.join(rootDir, "db", "seed.sql"), "utf8");

        await pool.query(schemaSql);
        await pool.query(seedSql);

        res.send("Database Configured Successfully! 🚀");
    } catch (e) {
        res.status(500).send("Setup Failed: " + e.message);
    }
});

app.use("/api", routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
