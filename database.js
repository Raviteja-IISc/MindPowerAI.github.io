

import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./blog.db');
export default db;

// Create posts table if it doesn't exist (without category first)
db.prepare(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Check if 'category' column exists
const tableInfo = db.prepare("PRAGMA table_info(posts)").all();
const hasCategory = tableInfo.some(col => col.name === 'category');

// If 'category' column is missing, add it with default value 'Yoga'
if (!hasCategory) {
  db.prepare("ALTER TABLE posts ADD COLUMN category TEXT DEFAULT 'Yoga'").run();
  console.log("Added missing 'category' column to posts table");
}

export default db;
