import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Gram2CityLogoProps } from "@/types";

const Gram2CityLogo: React.FC<Gram2CityLogoProps> = ({ width, className }) => {
  return (
    <Link href="/">
      <div
        className={`flex items-center gap-2 ${width} ${className}`}
        aria-label="Gram2City logo"
      >
        <div className="relative h-12 w-37.5">
          <Image
            src="/assets/logo/landscape-logo.png"
            alt="Gram2City logo"
            fill
            sizes="150px"
            className="object-contain"
            priority
          />
        </div>

        {/* Brand Text */}
        <span className="text-2xl font-extrabold tracking-tight">
          <span className="text-primary">Gram</span>
          <span className="text-accent">2</span>
          <span className="text-secondary">City</span>
        </span>
      </div>
    </Link>
  );
};

export default Gram2CityLogo;
