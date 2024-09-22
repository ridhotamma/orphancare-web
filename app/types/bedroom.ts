import { BedRoomType } from '@/app/types/bedroom-type';
import { Profile } from '@/app/types/profile';

export type BedRoom = {
  id: string; 
  name?: string;
  bedRoomType: BedRoomType;
  profiles: Profile[];
  createdAt: Date;
  updatedAt: Date;
};