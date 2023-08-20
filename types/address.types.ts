export interface City {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
}

export interface District {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
}
export interface Ward {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}
export type Address = {
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  type: string;
  default?: boolean;
  codeCity: number;
  codeDistrict: number;
  codeWard: number;
  _id: string;
};
