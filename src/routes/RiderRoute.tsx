import React, { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

interface RiderRouteProps {
  children: ReactNode;
}

const RiderRoute: React.FC<RiderRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg text-[#CAEB66]"></span>
      </div>
    );
  }

  if (!user || role !== "rider") {
    return <Navigate state={{ from: location.pathname }} to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default RiderRoute;