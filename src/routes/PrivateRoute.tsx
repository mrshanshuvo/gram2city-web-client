"use client";

import React, { ReactNode } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { usePathname } from "next/navigation";
import Redirect from "@/components/Shared/Redirect";

import Loading from "@/app/loading";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading: loading } = useAuthStore();
  const pathname = usePathname();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Redirect
        to={`/login?from=${encodeURIComponent(pathname || "")}`}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
