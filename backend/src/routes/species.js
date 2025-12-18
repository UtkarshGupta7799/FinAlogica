
// backend/src/routes/species.js
import { Router } from "express";
import { query } from "../services/db.js";

const r = Router();
r.get("/", async (_, res) => {
  try {
    const { rows } = await query("SELECT id, common_name, scientific_name FROM species ORDER BY id ASC");
    res.json(rows);
  } catch (e) {
    console.error("Species API Error:", e);
    res.status(500).json({ error: "Database error" });
  }
});
export default r;
