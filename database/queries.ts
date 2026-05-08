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
  item: { barcode: string; name: string; description?: string; quantity: number; unit: string; price_usd: number; price_bs: number }
): Promise<InventoryRow> {
  const now = Date.now();
  const result = await db.runAsync(
    'INSERT INTO inventory (barcode, name, description, quantity, unit, price_usd, price_bs, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [item.barcode, item.name, item.description ?? null, item.quantity, item.unit, item.price_usd, item.price_bs, now, now]
  );
  return {
    id: result.lastInsertRowId,
    ...item,
    description: item.description ?? null,
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