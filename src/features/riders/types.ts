export interface Rider {
  _id: string;
  name: string;
  phone: string;
  district: string;
  status?: string;
  vehicle_type?: string;
}

export interface ServiceCenter {
  region: string;
  district: string;
  city: string;
  covered_area: string[];
  status: string;
  flowchart: string;
  longitude: number;
  latitude: number;
}
