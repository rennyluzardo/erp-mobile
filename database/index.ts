// database/index.ts
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('gecko-app.db');

  // Enable WAL mode for better performance
  await db.execAsync('PRAGMA journal_mode = WAL;');

  // Create tables
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      quantity REAL NOT NULL DEFAULT 0,
      unit TEXT NOT NULL,
      price_usd REAL NOT NULL DEFAULT 0,
      price_bs REAL NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Create indexes
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory(barcode);
  `);

  console.log('SQLite database initialized successfully.');
  return db;
}