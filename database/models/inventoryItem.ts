// database/models/inventoryItem.ts
export interface InventoryItem {
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