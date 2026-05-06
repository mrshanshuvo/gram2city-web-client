export interface Parcel {
  _id: string;
  trackingId?: string;
  parcelName: string;
  parcelType: string;
  parcelWeight: number;
  weight?: number; // Consistency with backend
  receiverName: string;
  receiverPhoneNumber: string;
  deliveryAddress: string;
  deliveryDate: string;
  creation_date?: string;
  createdAt?: string; // For sorting and display
  
  senderEmail?: string;
  senderName?: string;
  senderContact?: string;
  senderRegion?: string;
  senderAddress?: string;
  senderServiceCenter?: string;
  
  receiverRegion?: string;
  price?: number;
  cost?: number;
  
  status?: "pending" | "on-the-way" | "delivered" | "cancelled";
  delivery_status?: string;
  
  pickupInstruction?: string;
  deliveryInstruction?: string;

  // Additional fields for compatibility
  phoneNumber?: string;
  bookingDate?: string;
  deliveryAddressLatitude?: number;
  deliveryAddressLongitude?: number;
  
  assigned_rider_id?: string;
  assigned_rider_name?: string;
  assigned_rider_email?: string;
}
