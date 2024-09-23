import { User } from '@/app/types/user';
import { Address } from '@/app/types/address';
import { BedRoom } from '@/app/types/bedroom';
import { Guardian } from '@/app/types/guardian';
import { Gender } from '@/app/types/enums';

export type Profile = {
  id: string;
  fullName: string;
  profilePicture?: string;
  birthday?: Date;
  joinDate?: Date;
  leaveDate?: Date;
  bio?: string;
  phoneNumber?: string;
  gender: Gender;
  user: User;
  address?: Address;
  bedRoom?: BedRoom;
  guardian?: Guardian;
  createdAt: Date;
  updatedAt: Date;
};
