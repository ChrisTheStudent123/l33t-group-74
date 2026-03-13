import { Database } from "bun:sqlite";

export const db = new Database("app.db");

//Tables created here...
db.run(`
    CREATE TABLE IF NOT EXISTS  game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
    );
    `);
