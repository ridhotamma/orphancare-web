import { Document } from '@/app/types/document';

export type DocumentType = {
  id: string;
  name: string;
  type: string;
  documents: Set<Document>;
  createdAt: Date;
  updatedAt: Date;
};
