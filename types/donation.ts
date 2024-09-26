import { DonationType } from '@/types/donation-type';
import { Unit } from '@/types/unit';

export type Donation = {
  id: string;
  name: string;
  amount: number;
  receivedDate: Date;
  receiver: string;
  donatorName: string;
  donationType: DonationType;
  unit: Unit | null;
  createdAt: Date;
  updatedAt: Date;
};
