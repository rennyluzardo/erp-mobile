// database/seeders/index.ts
import * as SQLite from 'expo-sqlite';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'supersecretpassword'; // CAMBIA ESTO EN PRODUCCIÓN

export async function seedAdminUser(db: SQLite.SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM users WHERE username = ?',
    [ADMIN_USERNAME]
  );

  if (!existing) {
    const now = Date.now();
    await db.runAsync(
      'INSERT INTO users (username, password, is_admin, created_at, updated_at) VALUES (?, ?, 1, ?, ?)',
      [ADMIN_USERNAME, ADMIN_PASSWORD, now, now]
    );
    console.log('Seeding: Admin user created successfully.');
  } else {
    console.log('Seeding: Admin user already exists. Skipping.');
  }
}