import React, { ReactNode } from "react";
import { useAuthStore } from "../features/auth/authStore";
import Redirect from "@/components/Shared/Redirect";

interface RiderRouteProps {
  children: ReactNode;
}

const RiderRoute: React.FC<RiderRouteProps> = ({ children }) => {
  const { user, role, isLoading: loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg text-[#CAEB66]"></span>
      </div>
    );
  }

  if (!user || role !== "rider") {
    return <Redirect to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default RiderRoute;
