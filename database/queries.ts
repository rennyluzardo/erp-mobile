// database/queries.ts
import * as SQLite from 'expo-sqlite';
import { User } from './models/user';

export async function createUser(
  db: SQLite.SQLiteDatabase,
  username: string,
  password: string
): Promise<User> {
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO users (username, password, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)',
    [username, password, now, now]
  );
  return {
    id: result.lastInsertRowId,
    username,
    password,
    is_admin: 0,
    created_at: now,
    updated_at: now,
  };
}

export async function fetchUserByUsername(
  db: SQLite.SQLiteDatabase,
  username: string
): Promise<User | null> {
  const user = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return user ?? null;
}

// ---- Inventory Queries ----

export interface InventoryRow {
  id: number;
  barcode: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: string;
  price_usd: number;
  price_bs: number;
  image_uri: string | null;
  brand: string | null;
  category: string | null;
  tax_rate: number;
  low_stock_threshold: number;
  notify_low_stock: number;
  measurement_unit: string;
  created_at: number;
  updated_at: number;
}

export async function fetchAllInventoryItems(
  db: SQLite.SQLiteDatabase
): Promise<InventoryRow[]> {
  return await db.getAllAsync<InventoryRow>('SELECT * FROM inventory ORDER BY created_at DESC');
}

export async function createInventoryItem(
  db: SQLite.SQLiteDatabase,
  item: { 
    barcode: string; 
    name: string; 
    description?: string; 
    quantity: number; 
    unit: string; 
    price_usd: number; 
    price_bs: number;
    image_uri?: string;
    brand?: string;
    category?: string;
    tax_rate?: number;
    low_stock_threshold?: number;
    notify_low_stock?: number;
    measurement_unit?: string;
  }
): Promise<InventoryRow> {
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO inventory (barcode, name, description, quantity, unit, price_usd, price_bs, image_uri, brand, category, tax_rate, low_stock_threshold, notify_low_stock, measurement_unit, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      item.barcode, 
      item.name, 
      item.description ?? null, 
      item.quantity, 
      item.unit, 
      item.price_usd, 
      item.price_bs,
      item.image_uri ?? null,
      item.brand ?? null,
      item.category ?? null,
      item.tax_rate ?? 0,
      item.low_stock_threshold ?? 1,
      item.notify_low_stock ?? 1,
      item.measurement_unit ?? 'Cantidad',
      now, 
      now
    ]
  );
  return {
    id: result.lastInsertRowId,
    barcode: item.barcode,
    name: item.name,
    description: item.description ?? null,
    quantity: item.quantity,
    unit: item.unit,
    price_usd: item.price_usd,
    price_bs: item.price_bs,
    image_uri: item.image_uri ?? null,
    brand: item.brand ?? null,
    category: item.category ?? null,
    tax_rate: item.tax_rate ?? 0,
    low_stock_threshold: item.low_stock_threshold ?? 1,
    notify_low_stock: item.notify_low_stock ?? 1,
    measurement_unit: item.measurement_unit ?? 'Cantidad',
    created_at: now,
    updated_at: now,
  };
}

export async function deleteInventoryItem(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM inventory WHERE id = ?', [id]);
}

// ---- Supporting Tables Queries ----

export async function fetchMeasurementUnits(
  db: SQLite.SQLiteDatabase
): Promise<{ id: number; name: string }[]> {
  return await db.getAllAsync('SELECT id, name FROM measurement_units ORDER BY name ASC');
}

export async function fetchCategories(
  db: SQLite.SQLiteDatabase
): Promise<{ id: number; name: string }[]> {
  return await db.getAllAsync('SELECT id, name FROM categories ORDER BY name ASC');
}

export async function fetchBrands(
  db: SQLite.SQLiteDatabase
): Promise<{ id: number; name: string }[]> {
  return await db.getAllAsync('SELECT id, name FROM brands ORDER BY name ASC');
}

export async function addMeasurementUnit(
  db: SQLite.SQLiteDatabase,
  name: string
): Promise<{ id: number; name: string }> {
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO measurement_units (name, created_at) VALUES (?, ?)',
    [name, now]
  );
  return {
    id: result.lastInsertRowId,
    name
  };
}

export async function addCategory(
  db: SQLite.SQLiteDatabase,
  name: string
): Promise<{ id: number; name: string }> {
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO categories (name, created_at) VALUES (?, ?)',
    [name, now]
  );
  return {
    id: result.lastInsertRowId,
    name
  };
}

export async function addBrand(
  db: SQLite.SQLiteDatabase,
  name: string
): Promise<{ id: number; name: string }> {
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO brands (name, created_at) VALUES (?, ?)',
    [name, now]
  );
  return {
    id: result.lastInsertRowId,
    name
  };
}