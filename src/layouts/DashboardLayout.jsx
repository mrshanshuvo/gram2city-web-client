import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import Gram2CityLogo from "../pages/Shared/Gram2CityLogo/Gram2CityLogo";
import {
  FiHome,
  FiPackage,
  FiSearch,
  FiCreditCard,
  FiEdit,
  FiUserCheck,
  FiCheck,
} from "react-icons/fi";
import {
  MdOutlineGroups,
  MdOutlineLocalShipping,
  MdOutlinePending,
} from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import { FaMotorcycle } from "react-icons/fa";
import NotificationBell from "../pages/Shared/NotificationBell/NotificationBell";
import { FiMenu } from "react-icons/fi";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const [activePath, setActivePath] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const location = useLocation();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch parcels data
  const { data: parcelsData = [] } = useQuery({
    enabled: !!user?.email,
    queryKey: ["dashboard-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-2");
    if (drawer?.checked) drawer.checked = false;
  };
  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <FiHome className="text-lg" />,
      delay: "0s",
    },
    {
      to: "/dashboard/myParcels",
      label: "My Parcels",
      icon: <FiPackage className="text-lg" />,
      delay: "0.1s",
    },
    {
      to: "/dashboard/paymentHistory",
      label: "Payment History",
      icon: <FiCreditCard className="text-lg" />,
      delay: "0.1s",
    },
    {
      to: "/dashboard/trackParcel",
      label: "Track Parcels",
      icon: <MdOutlineLocalShipping className="text-lg" />,
      delay: "0.2s",
    },
    {
      to: "/dashboard/updateProfile",
      label: "Update Profile",
      icon: <FiEdit className="text-lg" />,
      delay: "0.4s",
    },
    // Conditionally push rider-only routes
    ...(!roleLoading && role === "rider"
      ? [
        {
          to: "/dashboard/pendingDeliveries",
          label: "Pending Deliveries",
          icon: <FiPackage className="text-lg" />,
          delay: "0.35s",
        },
        {
          to: "/dashboard/completedDeliveries",
          label: "Completed Deliveries",
          icon: <FiCheck className="text-lg" />,
          delay: "0.4s",
        },
        {
          to: "/dashboard/myEarnings",
          label: "My Earnings",
          icon: <FiCreditCard className="text-lg" />,
          delay: "0.4s",
        }
      ]
      : []),

    // Conditionally push admin-only routes
    ...(!roleLoading && role === "admin"
      ? [
        {
          to: "/dashboard/approvedRiders",
          label: "Approved Riders",
          icon: <MdOutlineGroups className="text-lg" />,
          delay: "0.5s",
        },
        {
          to: "/dashboard/pendingRiders",
          label: "Pending Riders",
          icon: <MdOutlinePending className="text-lg" />,
          delay: "0.6s",
        },
        {
          to: "/dashboard/makeAdmins",
          label: "Make Admins",
          icon: <FiUserCheck className="text-lg" />,
          delay: "0.7s",
        },
        {
          to: "/dashboard/assignRider",
          label: "Assign Rider",
          icon: <FaMotorcycle className="text-lg" />,
          delay: "0.8s",
        },
        {
          to: "/dashboard/allParcels",
          label: "All Parcels",
          icon: <FiPackage className="text-lg" />,
          delay: "0.9s",
        },
      ]
      : []),
  ];

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen bg-base-100">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Top Navbar for Mobile/Small Screens */}
        <div className="navbar bg-white border-b border-gray-100 lg:hidden px-4">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle drawer-button">
              <FiMenu className="h-6 w-6" />
            </label>
          </div>
          <div className="flex-1 px-2">
            <Gram2CityLogo width="w-24" />
          </div>
          <div className="flex-none gap-2">
            <NotificationBell />
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src={user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png"} alt="User" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {/* Horizontal Header for Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back, {user?.displayName?.split(' ')[0]}!</h1>
                <p className="text-gray-400 text-sm">Managing your deliveries with Gram2City</p>
              </div>
              <div className="flex items-center gap-6">
                <NotificationBell />
                <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <img src={user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png"} className="w-8 h-8 rounded-full" alt="User" />
                  <span className="text-sm font-semibold text-gray-700">{user?.displayName}</span>
                </div>
              </div>
            </div>

            {/* Action Bar (Only shown on My Parcels route) */}
            {activePath === "/dashboard/myParcels" && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiPackage className="text-primary" /> My Parcels
                </h2>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or type..."
                      className="input input-bordered pl-10 w-full focus:ring-2 focus:ring-primary/20 transition-all border-none bg-gray-50 h-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="select select-bordered w-full md:w-auto bg-gray-50 border-none h-10"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">📊 All Statuses</option>
                    <option value="paid">✅ Paid</option>
                    <option value="unpaid">⏳ Unpaid</option>
                  </select>
                </div>
              </div>
            )}

            <div className="bg-transparent">
              <Outlet context={{ parcelsData, searchTerm, filterStatus }} />
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          className="drawer-overlay"
          aria-label="Close sidebar"
        ></label>
        <div className="menu p-4 overflow-y-auto w-50 bg-base-100 text-base-content border-r border-base-200 flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-6">
            <Gram2CityLogo />
          </div>

          {/* Primary Navigation */}
          <ul className="flex-1">
            {navLinks.map(({ to, label, icon, delay, badge }) => (
              <li
                key={to}
                className="mb-1"
                style={{
                  animation: `fadeIn 0.5s ease forwards`,
                  animationDelay: delay,
                }}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-primary bg-primary/10 rounded-lg px-4 py-3 transition-all"
                      : "hover:bg-base-200 rounded-lg px-4 py-3 transition-all"
                  }
                  onClick={closeDrawer}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{icon}</span>
                    <span>{label}</span>
                  </div>
                  {badge > 0 && (
                    <span className="badge badge-primary badge-sm">
                      {badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
