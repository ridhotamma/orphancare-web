import { User } from '@/types/user';
import { Address } from '@/types/address';
import { BedRoom } from '@/types/bedroom';
import { Guardian } from '@/types/guardian';
import { Gender } from '@/types/enums';

export type Profile = {
  id: string;
  fullName: string;
  profilePicture?: string;
  birthday?: string;
  joinDate?: string;
  leaveDate?: string;
  bio?: string;
  phoneNumber?: string;
  gender: Gender;
  user: Partial<User>;
  address?: Address;
  bedRoom?: BedRoom;
  guardian?: Guardian;
  createdAt: Date;
  updatedAt: Date;
};
