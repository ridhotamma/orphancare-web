import { Address } from '@/types/address';
import { BedRoom } from '@/types/bedroom';
import { Guardian } from '@/types/guardian';
import { Gender } from '@/types/enums';
import { GuardianType } from './guardian-type';
import { OrphanType } from './user';

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
  careTaker?: boolean;
  alumni?: boolean;
  bedRoomId?: string;
  guardianTypeId?: string;
  guardianRelationship?: GuardianType;
  kkNumber?: string;
  nikNumber?: string;
  orphanType?: OrphanType;
  createdAt?: string;
  updatedAt?: string;
  orphanTypeText?: string;
  orphanStatus?: OrphanType;
};
