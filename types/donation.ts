import { DonationType } from '@/types/donation-type';
import { Unit } from '@/types/unit';

export type Donation = {
  id?: string;
  name: string;
  amount: number;
  receivedDate: string;
  receiver: string;
  donatorName: string;
  donationType?: DonationType | null;
  donationTypeId?: string | null;
  unit: Unit | null;
  unitId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};
