import { Document } from '@/types/document';

export type DocumentType = {
  id: string;
  name: string;
  type: string;
  documents: Set<Document>;
  mandatory: boolean,
  createdAt: Date;
  updatedAt: Date;
};
