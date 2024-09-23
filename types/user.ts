import { Profile } from '@/app/types/profile';
import { Document } from '@/app/types/document';
import { RoleType } from '@/app/types/enums';

export type User = {
  id: string;
  email: string;
  password: string;
  username: string;
  roles: Set<RoleType>;
  profile: Profile | null;
  active: boolean;
  documents: Set<Document>;
  createdAt: Date;
  updatedAt: Date;
};