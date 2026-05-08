// database/index.ts
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('erp-system.db');

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
      image_uri TEXT,
      brand TEXT,
      category TEXT,
      tax_rate REAL DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 1,
      notify_low_stock INTEGER DEFAULT 1,
      measurement_unit TEXT DEFAULT 'Cantidad',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Supporting tables for dropdown options
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS measurement_units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );
  `);

  // Seed supporting tables with default values
  const now = Date.now();
  
  await db.execAsync(`
    INSERT OR IGNORE INTO measurement_units (name, created_at) VALUES 
      ('Cantidad', ${now}),
      ('Unidades', ${now}),
      ('Kilos', ${now}),
      ('Litros', ${now}),
      ('Metros', ${now}),
      ('Cajas', ${now}),
      ('Paquetes', ${now}),
      ('Botellas', ${now}),
      ('Gramos', ${now}),
      ('Mililitros', ${now})
  `);

  await db.execAsync(`
    INSERT OR IGNORE INTO categories (name, created_at) VALUES 
      ('Alimentos', ${now}),
      ('Bebidas', ${now}),
      ('Limpieza', ${now}),
      ('Higiene Personal', ${now}),
      ('Electrónicos', ${now}),
      ('Ropa', ${now}),
      ('Hogar', ${now}),
      ('Salud', ${now}),
      ('Mascotas', ${now}),
      ('Otros', ${now})
  `);

  await db.execAsync(`
    INSERT OR IGNORE INTO brands (name, created_at) VALUES 
      ('Ninguna', ${now}),
      ('Genérico', ${now}),
      ('Propio', ${now})
  `);

  // Create indexes
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory(barcode);
    CREATE INDEX IF NOT EXISTS idx_measurement_units_name ON measurement_units(name);
    CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
    CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);
  `);

  console.log('SQLite database initialized successfully.');
  return db;
}