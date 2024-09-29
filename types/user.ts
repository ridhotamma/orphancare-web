import { Profile } from '@/types/profile';
import { Document } from '@/types/document';
import { RoleType } from '@/types/enums';

export type User = {
  id: string;
  email: string;
  password: string;
  username: string;
  roles: RoleType[];
  profile: Partial<Profile> | null;
  active: boolean;
  documents: Set<Document>;
  createdAt: Date;
  updatedAt: Date;
};