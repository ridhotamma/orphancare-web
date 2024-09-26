import { InventoryType } from "@/types/inventory-type";
import { Unit } from "@/types/unit";

export type Inventory = {
  id: string;
  name: string;
  quantity: number;
  inventoryType: InventoryType;
  unit?: Partial<Unit>;
  createdAt: Date;
  updatedAt: Date;
}
