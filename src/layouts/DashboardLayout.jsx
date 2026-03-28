import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import Gram2CityLogo from "../pages/Shared/Gram2CityLogo/Gram2CityLogo";
import {
  FiHome,
  FiPackage,
  FiSearch,
  FiCreditCard,
  FiEdit,
  FiUserCheck,
  FiCheck,
  FiLogOut,
  FiSettings,
  FiChevronRight
} from "react-icons/fi";
import {
  MdOutlineGroups,
  MdOutlineLocalShipping,
  MdOutlinePending,
  MdDashboard
} from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import { FaMotorcycle } from "react-icons/fa";
import NotificationBell from "../pages/Shared/NotificationBell/NotificationBell";
import { FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const [activePath, setActivePath] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
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

  const menuGroups = [
    {
      title: "Menu",
      links: [
        { to: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
        { to: "/dashboard/myParcels", label: "My Parcels", icon: <FiPackage /> },
        { to: "/dashboard/trackParcel", label: "Track Parcels", icon: <MdOutlineLocalShipping /> },
      ]
    },
    {
      title: "Logistics",
      links: [
        { to: "/dashboard/paymentHistory", label: "Payment History", icon: <FiCreditCard /> },
        { to: "/dashboard/updateProfile", label: "Update Profile", icon: <FiEdit /> },
      ]
    },
    // Rider specific
    ...(!roleLoading && role === "rider" ? [{
      title: "Delivery Task",
      links: [
        { to: "/dashboard/pendingDeliveries", label: "Pending", icon: <MdOutlinePending /> },
        { to: "/dashboard/completedDeliveries", label: "Completed", icon: <FiCheck /> },
        { to: "/dashboard/myEarnings", label: "Earnings", icon: <FiCreditCard /> },
      ]
    }] : []),
    // Admin specific
    ...(!roleLoading && role === "admin" ? [{
      title: "Admin Control",
      links: [
        { to: "/dashboard/approvedRiders", label: "Approved Riders", icon: <MdOutlineGroups /> },
        { to: "/dashboard/pendingRiders", label: "Pending Riders", icon: <MdOutlinePending /> },
        { to: "/dashboard/makeAdmins", label: "Make Admins", icon: <FiUserCheck /> },
        { to: "/dashboard/assignRider", label: "Assign Rider", icon: <FaMotorcycle /> },
        { to: "/dashboard/allParcels", label: "All Parcels", icon: <FiPackage /> },
      ]
    }] : [])
  ];

  // Breadcrumbs generation
  const pathParts = location.pathname.split("/").filter(p => p && p !== "dashboard");
  const breadcrumbs = ["Dashboard", ...pathParts.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/([A-Z])/g, ' $1'))];

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen bg-[#F8FAFC]">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile Navbar */}
        <div className="navbar bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 lg:hidden px-4">
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
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png"} alt="User" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8 lg:px-10 lg:pt-8">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-10">
              <div className="flex flex-col gap-2">
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {breadcrumbs.map((crumb, i) => (
                    <React.Fragment key={i}>
                      <span className={i === breadcrumbs.length - 1 ? "text-primary transition-colors" : ""}>{crumb}</span>
                      {i < breadcrumbs.length - 1 && <FiChevronRight className="text-gray-300" />}
                    </React.Fragment>
                  ))}
                </nav>
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                  {breadcrumbs[breadcrumbs.length - 1]}
                </h1>
              </div>

              <div className="flex items-center gap-6 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <NotificationBell />
                <div className="h-8 w-px bg-gray-100"></div>
                <div className="flex items-center gap-3 pr-2">
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-800 leading-none">{user?.displayName}</p>
                    <p className="text-[10px] uppercase font-bold text-primary tracking-tighter mt-1">{role || "User"}</p>
                  </div>
                  <img src={user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png"} className="w-10 h-10 rounded-xl shadow-md border-2 border-white" alt="User" />
                </div>
              </div>
            </div>

            {/* Content Area with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {/* Action Bar (Only shown on My Parcels route) */}
                {activePath === "/dashboard/myParcels" && (
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <FiPackage className="text-xl" />
                      </div>
                      <h2 className="text-xl font-black text-gray-800">My Parcels</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      <div className="relative flex-1 md:w-72">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tracking ID or name..."
                          className="input w-full pl-12 h-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select
                        className="select select-bordered w-full md:w-auto h-12 bg-gray-50 border-none rounded-2xl text-sm font-bold"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">📊 ALL STATUS</option>
                        <option value="paid">✅ PAID</option>
                        <option value="unpaid">⏳ UNPAID</option>
                      </select>
                    </div>
                  </div>
                )}

                <Outlet context={{ parcelsData, searchTerm, filterStatus }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Sidebar Redesign */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay" aria-label="Close sidebar"></label>
        <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-full shadow-2xl lg:shadow-none">
          {/* Logo Section */}
          <div className="p-8 pt-10">
            <div className="p-4 rounded-3xl flex justify-left">
              <Gram2CityLogo width="w-32" />
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto px-6 space-y-8 mt-4 custom-scrollbar">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-60">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.links.map(({ to, label, icon }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        onClick={closeDrawer}
                        className={({ isActive }) => `
                          flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                          ${isActive 
                            ? "bg-primary text-white shadow-lg shadow-primary/25" 
                            : "text-gray-500 hover:bg-gray-50 hover:text-primary"}
                        `}
                      >
                        <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                          <span className="text-sm font-bold tracking-tight">{label}</span>
                        </div>
                        <FiChevronRight className={`text-xs opacity-0 transition-all ${activePath === to ? 'hidden' : 'group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'}`} />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Profile Card */}
          <div className="p-6 mt-auto">
            <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png"} alt="User" className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-black text-gray-800 truncate">{user?.displayName}</p>
                  <p className="text-[10px] text-gray-400 truncate tracking-tighter">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn-sm btn-ghost bg-white hover:bg-white text-gray-500 hover:text-primary border-none shadow-sm rounded-xl h-10">
                  <FiSettings className="text-base" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="btn btn-sm bg-red-50 hover:bg-red-100 border-none text-red-500 shadow-sm rounded-xl h-10"
                >
                  <FiLogOut className="text-base" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
