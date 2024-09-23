import { User } from "@/app/types/user";
import { DocumentType } from "@/app/types/document-type";

export type Document = {
  id: string;
  name?: string;
  url?: string;
  owner: User;
  documentType: DocumentType;
  createdAt: Date;
  updatedAt: Date;
};
