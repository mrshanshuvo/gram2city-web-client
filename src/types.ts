import React from "react";

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
