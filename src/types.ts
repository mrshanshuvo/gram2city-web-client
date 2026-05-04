import React from "react";
import { User as FirebaseUser, UserCredential } from "firebase/auth";

export interface User extends FirebaseUser {
  // Add custom properties if needed
  role?: "user" | "rider" | "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  signInUser: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  updateUserProfile: (profileInfo: { displayName?: string | null; photoURL?: string | null }) => Promise<void>;
  logOut: () => Promise<void>;
}

export interface UserInfoDB {
  email: string;
  name: string;
  photoURL: string | null;
  role?: string;
  created_at?: string;
  last_login?: string;
}

export interface Notification {
  _id: string;
  type: string;
  message: string;
  time: string;
}

export interface Parcel {
  _id: string;
  phoneNumber: string;
  parcelType: string;
  parcelWeight: number;
  receiverName: string;
  receiverPhoneNumber: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryAddressLatitude: number;
  deliveryAddressLongitude: number;
  price: number;
  status: "pending" | "on-the-way" | "delivered" | "cancelled";
  bookingDate: string;
  senderEmail: string;
  senderName: string;
  trackingId?: string;
  creation_date?: string;
  parcelName?: string;
  senderContact?: string;
  cost?: number;
  senderRegion?: string;
  receiverRegion?: string;
  senderServiceCenter?: string;
  senderAddress?: string;
  delivery_status?: string;
  pickupInstruction?: string;
  deliveryInstruction?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password?: string;
}

export interface LoginFormData {
  email: string;
  password?: string;
}

export interface Gram2CityLogoProps {
  width?: string;
  className?: string;
}

export interface NavItemProps {
  to: string;
  children: React.ReactNode;
  icon?: any; // LucideIcon type can be tricky to export centrally without specific imports
  end?: boolean;
}

export interface FooterProps {
  foundingYear?: number;
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
