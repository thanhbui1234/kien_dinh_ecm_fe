export interface CompanyInfoItem {
  id: string;
  label: string;
  value: string;
  orderIndex?: number;
}

export interface Facility {
  id: string;
  region: string;
  country: string;
  name: string;
  address: string;
  phone: string;
  imageUrl?: string;
  orderIndex?: number;
}
