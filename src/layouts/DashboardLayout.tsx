import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

// Sub-components
import Sidebar from "./DashboardComponents/Sidebar";
import Topbar from "./DashboardComponents/Topbar";

const DashboardLayout: React.FC = () => {
  const { user, logOut } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-2") as HTMLInputElement | null;
    if (drawer?.checked) drawer.checked = false;
  };

  const pathParts = location.pathname.split("/").filter((p) => p && p !== "dashboard");
  const breadcrumbs = [
    "Dashboard",
    ...pathParts.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1).replace(/([A-Z])/g, " $1")),
  ];

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <div className="drawer lg:drawer-open bg-gray-50/30 font-inter min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col min-h-screen overflow-x-hidden">
        <Topbar 
          breadcrumbs={breadcrumbs} 
          user={user} 
          role={role as string} 
        />

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto animate-in fade-in duration-700">
          <Outlet />
        </main>

        <footer className="p-8 text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Gram2City Logistics &bull; Command Center v2.4
        </footer>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay" aria-label="Close sidebar"></label>
        <Sidebar 
          user={user}
          role={role as string}
          roleLoading={roleLoading}
          activePath={activePath}
          closeDrawer={closeDrawer}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
