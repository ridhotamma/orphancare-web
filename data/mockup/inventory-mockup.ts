import { Inventory } from '@/types/inventory';

export const mockInventories: Inventory[] = [
  {
    id: '1',
    name: 'Sapu Lorem Ipsum Doler Sit Amet',
    quantity: 10,
    inventoryType: {
      id: '1',
      name: 'Kendaraan Bermotor',
      type: 'consumable',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    unit: { id: '1', name: 'pcs' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Item 2',
    quantity: 5,
    inventoryType: {
      id: '2',
      name: 'Type 2',
      type: 'non-consumable',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Item 3',
    quantity: 5,
    inventoryType: {
      id: '2',
      name: 'Type 2',
      type: 'non-consumable',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
