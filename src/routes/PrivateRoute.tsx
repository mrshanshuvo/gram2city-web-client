import React, { ReactNode } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { usePathname } from "next/navigation";
import Redirect from "@/components/Shared/Redirect";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading: loading } = useAuthStore();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg text-[#CAEB66]"></span>
      </div>
    );
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
