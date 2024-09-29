import { Address } from '@/types/address';
import { GuardianType } from '@/types/guardian-type';

export type Guardian = {
  id: string;
  fullName?: string;
  phoneNumber?: string;
  address?: Address;
  guardianType?: GuardianType;
  createdAt?: Date;
  updatedAt?: Date;
};
