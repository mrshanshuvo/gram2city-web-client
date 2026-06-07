"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FiMenu, FiChevronRight, FiPackage, FiUserPlus } from "react-icons/fi";
import NotificationBell from "../../views/Shared/NotificationBell/NotificationBell";
import { useSocketStore } from "../../store/useSocketStore";
import { toast } from "sonner";

import { useAuthStore } from "../../features/auth/authStore";
import { useHeaderStore } from "../../store/useHeaderStore";

interface TopbarProps {
  breadcrumbs: string[];
}

const Topbar: React.FC<TopbarProps> = ({ breadcrumbs }) => {
  const { user, role } = useAuthStore();
  const { socket } = useSocketStore();
  const { title: storeTitle, subtitle } = useHeaderStore();

  const displayTitle = storeTitle || breadcrumbs[breadcrumbs.length - 1];

  // Listen for Real-time Admin Alerts
  useEffect(() => {
    if (socket && (role === "admin" || role === "superAdmin")) {
      console.log("🛠️ Admin Real-time Listener Active");

      // Alert 1: New Parcel Booked
      socket.on("new_parcel", (data) => {
        toast.info(
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-tighter">
              <FiPackage /> New Shipment Booked
            </div>
            <p className="text-[10px] text-gray-500 font-bold">
              ID: {data.trackingId} • Destination: {data.destination}
            </p>
          </div>,
          {
            icon: false,
            className: "rounded-2xl border-l-4 border-blue-500 shadow-xl",
          },
        );
      });

      // Alert 2: New Rider Application
      socket.on("new_rider_application", (data) => {
        toast.success(
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-tighter">
              <FiUserPlus /> New Rider Application
            </div>
            <p className="text-[10px] text-gray-500 font-bold">
              {data.name} from {data.district} applied.
            </p>
          </div>,
          {
            icon: false,
            className: "rounded-2xl border-l-4 border-emerald-500 shadow-xl",
          },
        );
      });

      return () => {
        socket.off("new_parcel");
        socket.off("new_rider_application");
      };
    }
  }, [socket, role]);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="navbar bg-white/40 backdrop-blur-md sticky top-0 z-30 border-b border-white/20 shadow-sm lg:hidden px-4">
        <div className="flex-none">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-ghost btn-circle drawer-button"
          >
            <FiMenu className="h-6 w-6" />
          </label>
        </div>
        <div className="flex-1 px-2">
          <span className="text-lg font-black tracking-tighter text-gray-800">
            Gram2City
          </span>
        </div>
        <div className="flex-none flex items-center gap-4">
          <NotificationBell />
          <div className="avatar">
            <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  fill
                  sizes="32px"
                  className="object-cover"
                  alt="User"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                  {(user?.displayName || user?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Topbar */}
      <header className="hidden lg:flex h-20 items-center justify-between px-10 bg-white/40 backdrop-blur-md sticky top-0 z-30 border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <span
                    className={
                      i === breadcrumbs.length - 1
                        ? "text-primary transition-colors"
                        : ""
                    }
                  >
                    {crumb}
                  </span>
                  {i < breadcrumbs.length - 1 && (
                    <FiChevronRight className="text-gray-300" />
                  )}
                </React.Fragment>
              ))}
            </nav>
            <h1 className="text-lg font-black text-gray-800 tracking-tight mt-0.5 flex items-center gap-3">
              {displayTitle}
              {subtitle && (
                <span className="text-[10px] font-bold text-slate-400 border-l border-slate-200 pl-3 uppercase tracking-widest">
                  {subtitle}
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-gray-50">
            <NotificationBell />
            <div className="h-8 w-px bg-gray-100"></div>
            <div className="flex items-center gap-3 pr-2">
              <div className="text-right">
                <p className="text-xs font-black text-gray-800 leading-none">
                  {user?.displayName}
                </p>
                <p className="text-[10px] uppercase font-bold text-primary tracking-tighter mt-1">
                  {role || "User"}
                </p>
              </div>
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-xl shadow-md border-2 border-white object-cover"
                  alt="User"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl shadow-md border-2 border-white bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {(user?.displayName || user?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Topbar;
