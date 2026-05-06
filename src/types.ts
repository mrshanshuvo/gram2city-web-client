import React from "react";


export interface Gram2CityLogoProps {
  width?: string;
  className?: string;
}

export interface NavItemProps {
  to: string;
  children: React.ReactNode;
  icon?: any; 
  end?: boolean;
}

export interface FooterProps {
  foundingYear?: number;
}
