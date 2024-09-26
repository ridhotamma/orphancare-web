import { InventoryType } from "@/types/inventory-type";
import { Unit } from "@/types/unit";

export interface Inventory {
  id: string;
  name: string;
  quantity: number;
  inventoryType: InventoryType;
  unit?: Unit;
  createdAt: Date;
  updatedAt: Date;
}
