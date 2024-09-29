import { User } from "@/types/user";
import { DocumentType } from "@/types/document-type";

export type Document = {
  id: string;
  name?: string;
  url?: string;
  owner?: Partial<User>;
  documentType: Partial<DocumentType>;
  createdAt: string;
  updatedAt: string;
};
