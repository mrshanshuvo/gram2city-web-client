"use client";

import React, { ReactNode } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { notFound } from "next/navigation";

import Loading from "@/app/loading";

interface MerchantRouteProps {
  children: ReactNode;
}

const MerchantRoute: React.FC<MerchantRouteProps> = ({ children }) => {
  const { user, role, isLoading: loading } = useAuthStore();

  if (loading) {
    return <Loading />;
  }

  if (!user || role !== "merchant") {
    notFound();
  }

  return <>{children}</>;
};

export default MerchantRoute;
