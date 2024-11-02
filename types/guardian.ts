import { Address } from '@/types/address';

export type Guardian = {
  id: string;
  fullName?: string;
  phoneNumber?: string;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
};
