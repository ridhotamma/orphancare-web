import { Address } from '@/types/address';
import { BedRoom } from '@/types/bedroom';
import { Guardian } from '@/types/guardian';
import { Gender } from '@/types/enums';

export type Profile = {
  id: string;
  fullName?: string;
  profilePicture?: string;
  birthday?: string;
  joinDate?: string;
  leaveDate?: string;
  bio?: string;
  phoneNumber?: string;
  gender?: Gender;
  address?: Address;
  bedRoom?: BedRoom;
  guardian?: Guardian;
  careTaker?: boolean,
  alumni?: boolean,
  bedRoomId?: string,
  createdAt?: string;
  updatedAt?: string;
};
