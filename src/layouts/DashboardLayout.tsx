import React, { useState, useEffect } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { Outlet, useLocation } from "react-router";

// Sub-components
import Sidebar from "./DashboardComponents/Sidebar";
import Topbar from "./DashboardComponents/Topbar";
import ChatWidget from "../components/Shared/ChatWidget";
import NavigationProgressBar from "../components/Shared/NavigationProgressBar";

const DashboardLayout: React.FC = () => {
  const { logout: logOut } = useAuthStore();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const closeDrawer = () => {
    const drawer = document.getElementById(
      "my-drawer-2",
    ) as HTMLInputElement | null;
    if (drawer?.checked) drawer.checked = false;
  };

  const pathParts = location.pathname
    .split("/")
    .filter((p) => p && p !== "dashboard");
  const breadcrumbs = [
    "Dashboard",
    ...pathParts.map(
      (p: string) =>
        p.charAt(0).toUpperCase() + p.slice(1).replace(/([A-Z])/g, " $1"),
    ),
  ];

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <div className="drawer lg:drawer-open bg-gray-50/30 font-inter min-h-screen">
      <NavigationProgressBar />
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col h-screen overflow-hidden">
        <div className="flex-none">
          <Topbar breadcrumbs={breadcrumbs} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto animate-in fade-in duration-700">
          <Outlet />
        </main>

        {/* Floating Real-time Chat */}
        <ChatWidget />
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer-2"
          className="drawer-overlay"
          aria-label="Close sidebar"
        ></label>
        <Sidebar
          activePath={activePath}
          closeDrawer={closeDrawer}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
