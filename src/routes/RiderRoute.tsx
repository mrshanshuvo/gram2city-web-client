"use client";

import React, { ReactNode } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { notFound } from "next/navigation";

import Loading from "@/app/loading";

interface RiderRouteProps {
  children: ReactNode;
}

const RiderRoute: React.FC<RiderRouteProps> = ({ children }) => {
  const { user, role, isLoading: loading } = useAuthStore();

  if (loading) {
    return <Loading />;
  }

  if (!user || role !== "rider") {
    notFound();
  }

  return <>{children}</>;
};

export default RiderRoute;
