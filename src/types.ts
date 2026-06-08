import React from "react";
import { ServiceCenter } from "@/features/riders/types";
import { Socket } from "socket.io-client";

export interface Gram2CityLogoProps {
  width?: string;
  className?: string;
}

export interface NavItemProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  end?: boolean;
}

export interface FooterProps {
  foundingYear?: number;
}

export interface Payout {
  _id: string;
  rider_name: string;
  rider_email: string;
  amount: number;
  requested_at: string;
  status: "pending" | "approved" | "rejected";
}

export interface LogActivity {
  time: string | number | Date;
  trackingId: string;
  details: string;
  status: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  region: string;
  isDefault: boolean;
}

export interface NewAddressInput {
  label: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  region: string;
  isDefault: boolean;
}

export interface TrackingUpdate {
  _id: string;
  status: string;
  location: string;
  time: string | number | Date;
  details: string;
}

// Define a precise type for validation errors to avoid using any
export interface ValidationError {
  path: string[];
  message: string;
}

export interface AvatarOption {
  url: string;
}

export interface StatusItem {
  status: string;
  count: number;
}

export interface UserRecord {
  name?: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  role?: string;
  status?: string;
  last_login?: string;
}

export interface MerchantFormValues {
  businessName: string;
  businessType: string;
  shopAddress: string;
  contactNumber: string;
  district: string;
  expectedMonthlyVolume: string;
}

export interface FlyToDistrictProps {
  coords: [number, number];
}

export interface CoverageMapProps {
  serviceCenters: ServiceCenter[];
  targetCoords: [number, number] | null;
}

export interface TrackParcelClientProps {
  id?: string;
  initialData?: TrackingUpdate[];
}

export interface SocketState {
  socket: Socket | null;
  connected: boolean;
  initializeSocket: () => void;
  disconnectSocket: () => void;
}

export interface HeaderState {
  title: string | null;
  subtitle: string | null;
  setHeader: (title: string, subtitle?: string | null) => void;
  clearHeader: () => void;
}

export interface FeatureItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
}

export interface FeatureCardsProps {
  initialData?: FeatureItem[];
}

export interface ConfigState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  helpfulCount?: number;
}

export interface FAQProps {
  limit?: number;
  showSearch?: boolean;
  showCategories?: boolean;
  sortBy?: "order" | "helpful";
  title?: string;
  subtitle?: string;
}

export interface PartnerLogo {
  _id: string;
  name: string;
  logo: string;
}

export interface TopEnterprisesProps {
  initialData?: PartnerLogo[];
}

export interface TestimonialItem {
  _id: string;
  name: string;
  title: string;
  quote: string;
  image: string;
  rating: number;
}

export interface TestimonialsProps {
  initialData?: TestimonialItem[];
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  image?: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface OurServicesProps {
  initialData?: Service[];
}

export interface ProcessStep {
  _id: string;
  title: string;
  description: string;
  icon: string;
  steps: string[];
}

export interface BannerData {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaLink?: string;
  ctaText?: string;
  icon?: string;
  color?: string;
}

export interface BannerProps {
  initialData?: BannerData[];
}

export interface NavLinkItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export interface SidebarProps {
  activePath: string;
  closeDrawer: () => void;
  handleLogout: () => void;
}

export interface TrackingMapProps {
  riderLocation: { lat: number; lng: number } | null;
}

export interface SkeletonLoaderProps {
  type?: "table" | "card" | "chart";
  rows?: number;
}

