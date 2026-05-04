import React from "react";
import { FiMenu, FiChevronRight } from "react-icons/fi";
import NotificationBell from "../../pages/Shared/NotificationBell/NotificationBell";

interface TopbarProps {
  breadcrumbs: string[];
  user: any;
  role: string | null;
}

const Topbar: React.FC<TopbarProps> = ({ breadcrumbs, user, role }) => {
  return (
    <>
      {/* Mobile Navbar */}
      <div className="navbar bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 lg:hidden px-4">
        <div className="flex-none">
          <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle drawer-button">
            <FiMenu className="h-6 w-6" />
          </label>
        </div>
        <div className="flex-1 px-2">
          <span className="text-lg font-black tracking-tighter text-gray-800">Gram2City</span>
        </div>
        <div className="flex-none flex items-center gap-4">
          <NotificationBell />
          <div className="avatar">
            <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png"} alt="User" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Topbar */}
      <header className="hidden lg:flex h-20 items-center justify-between px-10 bg-white/50 backdrop-blur-sm sticky top-0 z-30 border-b border-gray-50/50">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <span className={i === breadcrumbs.length - 1 ? "text-primary transition-colors" : ""}>{crumb}</span>
                  {i < breadcrumbs.length - 1 && <FiChevronRight className="text-gray-300" />}
                </React.Fragment>
              ))}
            </nav>
            <h1 className="text-lg font-black text-gray-800 tracking-tight mt-0.5">
              {breadcrumbs[breadcrumbs.length - 1]}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-gray-50">
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
      </header>
    </>
  );
};

export default Topbar;
