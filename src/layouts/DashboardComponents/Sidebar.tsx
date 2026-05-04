import { NavLink } from "react-router";
import { 
  FiChevronRight, 
  FiSettings, 
  FiLogOut, 
  FiPackage, 
  FiUserCheck, 
  FiCheck, 
  FiCreditCard, 
  FiDollarSign 
} from "react-icons/fi";
import { 
  MdOutlineGroups, 
  MdOutlinePending, 
  MdDashboard, 
  MdOutlineLocalShipping 
} from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";
import React from "react";

interface SidebarProps {
  user: any;
  role: string | null;
  roleLoading: boolean;
  activePath: string;
  closeDrawer: () => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  role, 
  roleLoading,
  activePath, 
  closeDrawer, 
  handleLogout 
}) => {
  const navGroups = [
    {
      title: "Overview",
      links: [{ to: "/dashboard", label: "Dashboard", icon: <MdDashboard /> }],
    },
    ...(!roleLoading && role === "admin"
      ? [
          {
            title: "System Management",
            links: [
              { to: "/dashboard/allParcels", label: "Fleet Monitor", icon: <FiPackage /> },
              { to: "/dashboard/assignRider", label: "Dispatch Center", icon: <FaMotorcycle /> },
              { to: "/dashboard/financialSettings", label: "Financial Settings", icon: <FiDollarSign /> },
              { to: "/dashboard/approvedRiders", label: "Rider Management", icon: <MdOutlineGroups /> },
              { to: "/dashboard/pendingRiders", label: "Onboarding", icon: <MdOutlinePending /> },
              { to: "/dashboard/makeAdmins", label: "Staff Roles", icon: <FiUserCheck /> },
            ],
          },
        ]
      : []),
    ...(!roleLoading && role === "rider"
      ? [
          {
            title: "Delivery Ops",
            links: [
              { to: "/dashboard/pendingDeliveries", label: "Active Tasks", icon: <MdOutlinePending /> },
              { to: "/dashboard/completedDeliveries", label: "Logbook", icon: <FiCheck /> },
              { to: "/dashboard/myEarnings", label: "Wallet", icon: <FiCreditCard /> },
            ],
          },
        ]
      : []),
    ...(!roleLoading && role === "user"
      ? [
          {
            title: "My Shipments",
            links: [
              { to: "/dashboard/myParcels", label: "My Orders", icon: <FiPackage /> },
              { to: "/dashboard/trackParcel", label: "Live Tracking", icon: <MdOutlineLocalShipping /> },
              { to: "/dashboard/paymentHistory", label: "Invoices", icon: <FiCreditCard /> },
            ],
          },
        ]
      : []),
    {
      title: "Account",
      links: [
        { to: "/dashboard/updateProfile", label: "Security & Profile", icon: <FiSettings /> },
      ],
    },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-full shadow-2xl lg:shadow-none">
      {/* Logo Section */}
      <div className="p-8 pt-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-2xl font-black text-white">G</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800 leading-none tracking-tighter">Gram2City</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Admin Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.title}</h3>
            <ul className="space-y-1.5">
              {group.links.map(({ to, label, icon }: any) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={closeDrawer}
                    className={({ isActive }: { isActive: boolean }) => `
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

      {/* User Quick Actions */}
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
  );
};

export default Sidebar;
