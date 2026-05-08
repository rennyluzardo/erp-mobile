// import * as SQLite from 'expo-sqlite';
// import * as FileSystem from 'expo-file-system';

// let db: SQLite.SQLiteDatabase | undefined;
// const DATABASE_NAME = 'gecko_app.db';
// const INVENTORY_TABLE_NAME = 'inventory';

// const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
//   if (!db) {
//     db = await SQLite.openDatabaseAsync(DATABASE_NAME);
//   }
//   return db;
// };

// export const initDatabase = async (): Promise<void> => {
//   try {
//     // const dbPath = `${FileSystem.documentDirectory}/SQLite/${DATABASE_NAME}`;
//     // await FileSystem.deleteAsync(dbPath, { idempotent: true });
//     // console.log('Base de datos existente borrada.');
//     console.log("Database path: ", `${FileSystem.documentDirectory}/SQLite/`);

//     const database = await openDatabase();
//     console.log('Nueva base de datos creada.');

//     // Crear la tabla de usuarios
//     await database.execAsync(`
//       CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL
//       );
//     `);
//     console.log('Tabla de usuarios creada o ya existente.');

//     // Insertar un registro predeterminado para usuarios
//     const defaultUsername = 'Gecko';
//     const defaultPassword = '123'; // ¡En una app real, esto estaría hasheado!

//     await database.runAsync(
//       'INSERT INTO users (username, password) VALUES (?, ?) ON CONFLICT(username) DO NOTHING',
//       defaultUsername,
//       defaultPassword
//     );

//     await database.execAsync(`
//       INSERT INTO users (username, password)
//       SELECT 'Gecko', '1234'
//       WHERE NOT EXISTS (SELECT 1 FROM users);
//     `);

//     console.log('Registro predeterminado de usuarios insertado.');

//     // Crear la tabla de inventario
//     await database.execAsync(`
//       CREATE TABLE IF NOT EXISTS ${INVENTORY_TABLE_NAME} (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         barcode TEXT UNIQUE NOT NULL,
//         name TEXT NOT NULL,
//         description TEXT,
//         quantity INTEGER NOT NULL DEFAULT 0,
//         unit TEXT NOT NULL, -- 'gr', 'und', etc.
//         priceUSD REAL NOT NULL DEFAULT 0.0,
//         priceBS REAL NOT NULL DEFAULT 0.0,
//         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     console.log('Tabla de inventario creada o ya existente.');

//   } catch (error) {
//     console.error('Error al inicializar la base de datos:', error);
//     throw error;
//   }
// };

// export const insertUser = async (username: string, passwordHash: string): Promise<void> => {
//   try {
//     const database = await openDatabase();
//     await database.runAsync('INSERT INTO users (username, password) VALUES (?, ?)', username, passwordHash);
//     console.log('Usuario insertado correctamente.');
//   } catch (error) {
//     console.error('Error al insertar usuario:', error);
//     throw error;
//   }
// };

// export const fetchUserByUsername = async (username: string): Promise<any> => {
//   try {
//     const database = await openDatabase();
//     const result = await database.getFirstAsync('SELECT * FROM users WHERE username = ?', username);
//     return result || null;
//   } catch (error) {
//     console.error('Error al buscar usuario:', error);
//     throw error;
//   }
// };

// // Funciones para el inventario
// export const insertInventoryItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> => {
//   const database = await openDatabase();
//   return await database.runAsync(
//     `INSERT INTO ${INVENTORY_TABLE_NAME} (barcode, name, description, quantity, unit, priceUSD, priceBS) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//     item.barcode,
//     item.name,
//     item.description ?? null,
//     item.quantity,
//     item.unit,
//     item.priceUSD,
//     item.priceBS
//   );
// };

// export const fetchAllInventoryItems = async (): Promise<InventoryItem[]> => {
//   const database = await openDatabase();
//   const result = await database.getAllAsync(`SELECT * FROM ${INVENTORY_TABLE_NAME}`);
//   return result as InventoryItem[];
// };

// export const fetchInventoryItemByBarcode = async (barcode: string): Promise<InventoryItem | null> => {
//   const database = await openDatabase();
//   const result = await database.getFirstAsync(`SELECT * FROM ${INVENTORY_TABLE_NAME} WHERE barcode = ?`, barcode);
//   return result as InventoryItem | null;
// };

// interface InventoryItem {
//   id: number;
//   barcode: string;
//   name: string;
//   description?: string;
//   quantity: number;
//   unit: string;
//   priceUSD: number;
//   priceBS: number;
//   createdAt?: string;
//   updatedAt?: string;
// }