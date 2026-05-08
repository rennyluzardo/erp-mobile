// database/models/user.ts
export interface User {
  id: number;
  username: string;
  password: string;
  is_admin: number; // SQLite uses 0/1 for booleans
  created_at: number;
  updated_at: number;
}