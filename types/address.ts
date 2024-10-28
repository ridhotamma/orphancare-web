export type AddressDetail = {
  id: string;
  name: string;
};

export type Address = {
  id?: string;
  street?: string;
  village?: string;
  district?: string;
  regency?: string;
  province?: string;
  postalCode?: string;
  createdAt?: string;
  updatedAt?: string;
  provinceDetail?: AddressDetail;
  regencyDetail?: AddressDetail;
  districtDetail?: AddressDetail;
  villageDetail?: AddressDetail;
};
