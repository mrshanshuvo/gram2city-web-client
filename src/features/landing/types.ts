export interface Banner {
  _id?: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  icon?: string;
  color?: string;
  order?: number;
  isActive?: boolean;
}

export interface Service {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
}

export interface Feature {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
}

export interface Testimonial {
  _id?: string;
  name: string;
  title?: string;
  quote: string;
  image: string;
  rating: number;
  isActive?: boolean;
}

export interface Partner {
  _id?: string;
  name: string;
  logo: string;
  order?: number;
  isActive?: boolean;
}

export interface ProcessStep {
  _id?: string;
  step?: number;
  title: string;
  description: string;
  icon?: string;
  steps?: string[];
  order?: number;
  isActive?: boolean;
}

export interface LandingConfig {
  merchantSection: {
    title: string;
    description: string;
    benefits: string[];
    ctaText: string;
    ctaLink: string;
  };
  contactInfo: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  socialLinks: {
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  seo: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
  };
}

export interface Avatar {
  _id: string;
  url: string;
}

export type LandingItem =
  | Banner
  | Service
  | Feature
  | Testimonial
  | Partner
  | ProcessStep
  | Avatar;
