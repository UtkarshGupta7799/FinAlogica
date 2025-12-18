
// backend/src/services/db.js
import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production' || process.env.Render;
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});
export const query = (text, params) => pool.query(text, params);
