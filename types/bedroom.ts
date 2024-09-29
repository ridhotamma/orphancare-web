import { BedRoomType } from '@/types/bedroom-type';
import { Profile } from '@/types/profile';

export type BedRoom = {
  id: string; 
  name?: string;
  bedRoomType: BedRoomType;
  profiles?: Profile[];
  createdAt: Date;
  updatedAt: Date;
};