export interface Cashout {
  _id: string;
  rider_email: string;
  earning: number;
  cashed_out_at: string;
  trackingId: string;
  parcel_name?: string;
  parcel_id: string;
}

export interface Payment {
  _id: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  paid_at: string;
  user_email?: string;
  parcel_id?: string;
}
