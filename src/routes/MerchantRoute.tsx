import React, { ReactNode } from "react";
import { useAuthStore } from "../features/auth/authStore";
import Redirect from "@/components/Shared/Redirect";

interface MerchantRouteProps {
  children: ReactNode;
}

const MerchantRoute: React.FC<MerchantRouteProps> = ({ children }) => {
  const { user, role, isLoading: loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (!user || role !== "merchant") {
    return <Redirect to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default MerchantRoute;
