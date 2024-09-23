import { Address } from '@/app/types/address';
import { GuardianType } from '@/app/types/guardian-type';

export type Guardian = {
  id: string;
  fullName: string;
  phoneNumber?: string;
  address?: Address;
  guardianType: GuardianType;
  createdAt: Date;
  updatedAt: Date;
};
