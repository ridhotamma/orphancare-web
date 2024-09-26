import { Inventory } from '@/types/inventory';
import { InventoryType } from '@/types/inventory-type';

// Mock data
export const mockInventoryTypes: InventoryType[] = [
  {
    id: '1',
    name: 'Food',
    type: 'Consumable',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Clothing',
    type: 'Wearable',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Toys',
    type: 'Entertainment',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockInventories: Inventory[] = [
  {
    id: '1',
    name: 'Rice',
    quantity: 100,
    inventoryType: mockInventoryTypes[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'T-shirts',
    quantity: 50,
    inventoryType: mockInventoryTypes[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Teddy Bears',
    quantity: 30,
    inventoryType: mockInventoryTypes[2],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Milk',
    quantity: 75,
    inventoryType: mockInventoryTypes[0],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Pants',
    quantity: 40,
    inventoryType: mockInventoryTypes[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
