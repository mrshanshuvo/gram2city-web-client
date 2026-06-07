"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../features/auth/authStore";
import { usePathname } from "next/navigation";

// Sub-components
import Sidebar from "./DashboardComponents/Sidebar";
import Topbar from "./DashboardComponents/Topbar";
import ChatWidget from "../components/Shared/ChatWidget";
import NavigationProgressBar from "../components/Shared/NavigationProgressBar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout: logOut } = useAuthStore();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname || "");

  useEffect(() => {
    setActivePath(pathname || "");
  }, [pathname]);

  const closeDrawer = () => {
    const drawer = document.getElementById(
      "my-drawer-2",
    ) as HTMLInputElement | null;
    if (drawer?.checked) drawer.checked = false;
  };

  const pathParts = (pathname || "")
    .split("/")
    .filter((p) => p && p !== "dashboard");

  const breadcrumbs = [
    "Dashboard",
    ...pathParts.map(
      (p: string) =>
        p.charAt(0).toUpperCase() + p.slice(1).replace(/([A-Z])/g, " $1"),
    ),
  ];

  const handleLogout = () => {
    logOut();
  };

  return (
    <div className="drawer lg:drawer-open bg-slate-50 min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col h-screen overflow-hidden relative">
        <NavigationProgressBar />

        <div className="sticky top-0 z-30 w-full">
          <Topbar breadcrumbs={breadcrumbs} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto animate-in fade-in duration-700">
          {children}
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
