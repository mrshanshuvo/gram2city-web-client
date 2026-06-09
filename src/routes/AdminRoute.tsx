"use client";

import React, { ReactNode } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { notFound } from "next/navigation";
import Loading from "@/app/loading";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, role, isLoading: loading } = useAuthStore();

  if (loading) {
    return <Loading />;
  }

  if (!user || role !== "admin") {
    notFound();
  }

  return <>{children}</>;
};

export default AdminRoute;
