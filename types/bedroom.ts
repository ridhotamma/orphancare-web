import { BedRoomType } from '@/types/bedroom-type';
import { Profile } from '@/types/profile';

export type BedRoom = {
  id: string; 
  name?: string;
  bedRoomType: BedRoomType;
  bedRoomTypeId: string;
  profiles?: Profile[];
  createdAt: string;
  updatedAt: string;
};