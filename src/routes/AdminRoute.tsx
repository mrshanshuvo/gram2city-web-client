import React, { ReactNode } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { Navigate, useLocation } from "react-router";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, role, isLoading: loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg text-[#CAEB66]"></span>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return <Navigate state={{ from: location.pathname }} to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
