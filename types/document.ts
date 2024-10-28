import { User } from '@/types/user';
import { DocumentType } from '@/types/document-type';
import { Profile } from '@/types/profile';

export type Document = {
  id: string;
  name?: string;
  url?: string;
  owner?: Partial<Omit<User, 'profile'> & Profile>;
  documentType: Partial<DocumentType>;
  createdAt: string;
  updatedAt: string;
};
