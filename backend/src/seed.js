import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './services/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..'); // Go up from src/ to backend root

async function seed() {
    try {
        console.log('🌱 Connecting to database...');
        // Test connection
        await pool.query('SELECT 1');
        console.log('✅ Connected.');

        // Read files
        const schemaPath = path.join(rootDir, 'db', 'schema.sql');
        const seedPath = path.join(rootDir, 'db', 'seed.sql');

        console.log(`📖 Reading schema from ${schemaPath}...`);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log(`📖 Reading seed data from ${seedPath}...`);
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('⚡ Applying schema...');
        await pool.query(schemaSql);

        console.log('⚡ Applying seed data...');
        await pool.query(seedSql);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed (continuing anyway):', err);
        process.exit(0);
    }
}

seed();
