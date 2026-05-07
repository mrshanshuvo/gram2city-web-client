export interface SystemSettings {
  commission_rate?: number;
  delivery_charge_base?: number;
  base_delivery_fee?: number;
  cost_per_kg?: number;
  rider_commission_percentage?: number;
  [key: string]: unknown; // Allow for other settings
}

export interface Feedback {
  _id: string;
  category: string;
  userName?: string;
  userEmail: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface AdminStats {
  stats: {
    revenue: number;
    profit: number;
    parcels: {
      pending: number;
      onTheWay: number;
      delivered: number;
      cancelled: number;
      returned: number;
      total: number;
    };
    users: {
      customers: number;
      riders: number;
    };
    avgDeliveryTime: number;
    dailyBookings: { _id: string; count: number }[];
    parcelTypeDistribution: { _id: string; count: number }[];
    districtDistribution: { _id: string; count: number }[];
    riderLeaderboard: {
      name: string;
      email: string;
      deliveredCount: number;
      rating?: number;
    }[];
    fleetDistribution?: { _id: string; count: number }[];
  };
}

export interface Merchant {
  _id: string;
  userId: string;
  email: string;
  businessName: string;
  businessType?: string;
  tradeLicense?: string;
  logo?: string;
  address: string;
  district: string;
  phone: string;
  status: "pending" | "approved" | "suspended" | "rejected";
  createdAt: string;
  updatedAt?: string;
}
