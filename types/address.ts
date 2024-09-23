export type Address = {
  id: string;
  street?: string;
  urbanVillage?: string;
  subdistrict?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  createdAt: Date;
  updatedAt: Date;
};