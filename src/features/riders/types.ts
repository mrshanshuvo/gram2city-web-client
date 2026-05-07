export interface ReviewData {
  parcel_id: string;
  user_email?: string;
  user_name?: string;
  rider_email?: string;
  rider_name?: string;
  rating: number;
  comment: string;
}

export interface Review extends ReviewData {
  _id: string;
  date: string;
}

export interface Rider {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "approved" | "rejected" | "available" | "busy" | "on_leave";
  service_center?: string;
  photoURL?: string;
  bikeBrand?: string;
  bikeRegNo?: string;
  nid?: string;
  age?: number;
  region?: string;
  district?: string;
  additionalInfo?: string;
  createdAt?: string;
}

export interface ServiceCenter {
  _id: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  status: "active" | "limited" | "coming-soon";
}
