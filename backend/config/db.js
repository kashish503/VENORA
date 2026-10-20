const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "venora.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('vendor', 'supplier')),
    location TEXT DEFAULT '',
    industry TEXT DEFAULT 'Other',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    name TEXT NOT NULL,
    companyName TEXT NOT NULL,
    industry TEXT NOT NULL,
    materials TEXT NOT NULL,
    pricePerUnit REAL NOT NULL,
    qualityScore REAL NOT NULL,
    deliveryDays INTEGER NOT NULL,
    rating REAL DEFAULT 0,
    availableQuantity REAL NOT NULL,
    location TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

console.log("Connected to local SQLite database.");

module.exports = db;