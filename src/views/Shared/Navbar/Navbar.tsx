"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Package,
  Map,
  Bike,
  Phone,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../features/auth/authStore";
import Gram2CityLogo from "../Gram2CityLogo/Gram2CityLogo";

import { NavItemProps } from "../../../types";

const Navbar: React.FC = () => {
  const { user, logout: logOut } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const closeUserMenu = () => setUserMenuOpen(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user info with fallbacks
  const userPhotoUrl = user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png";
  const userDisplayName =
    user?.displayName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  const handleLogOut = () => {
    closeMobileMenu();
    closeUserMenu();
    if (logOut) {
      logOut();
    }
    router.push("/login");
  };

  const NavItem: React.FC<NavItemProps> = ({
    to,
    children,
    icon: Icon,
    end = false,
  }) => {
    const isActive = end ? pathname === to : pathname?.startsWith(to);
    return (
      <li className="relative">
        <Link
          href={to}
          className={`group relative flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl ${
            isActive ? "text-[#1E5AA8]" : "text-slate-600 hover:text-[#1E5AA8]"
          }`}
          onClick={closeMobileMenu}
        >
          {Icon && (
            <Icon
              className={`h-4.5 w-4.5 mr-2 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#1E5AA8]" : "text-slate-400 group-hover:text-[#1E5AA8]"}`}
            />
          )}
          <span className="relative z-10">{children}</span>
          {isActive && (
            <motion.div
              layoutId="navbar-active"
              className="absolute inset-0 bg-[#1E5AA8]/5 border border-[#1E5AA8]/10 rounded-xl -z-0"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span
            className={`absolute bottom-1 left-1/2 w-0 h-0.5 bg-[#1E5AA8] transition-all duration-300 -translate-x-1/2 rounded-full group-hover:w-1/2 ${isActive ? "opacity-0" : ""}`}
          />
        </Link>
      </li>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${
        isScrolled ? "py-1" : "py-2"
      }`}
    >
      <nav
        className={`max-w-350 mx-auto transition-all duration-500 rounded-2xl border ${
          isScrolled
            ? "glass shadow-lg"
            : "bg-white/30 backdrop-blur-md border-white/20 shadow-sm"
        }`}
      >
        <div className="px-4 py-1 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#1E5AA8] hover:bg-[#1E5AA8]/10 transition-all duration-300"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Gram2CityLogo className="scale-95 origin-left sm:scale-100 transition-transform duration-300" />
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center space-x-1">
              <NavItem to="/" end icon={Home}>
                Home
              </NavItem>
              <NavItem to="/addParcel" icon={Package}>
                Add Parcel
              </NavItem>
              <NavItem to="/coverage" icon={Map}>
                Coverage
              </NavItem>
              {user && (
                <NavItem to="/dashboard" icon={Home}>
                  Dashboard
                </NavItem>
              )}
              <NavItem to="/beARider" icon={Bike}>
                Be a Rider
              </NavItem>
            </ul>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/faqs"
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-[#1E5AA8] transition-colors duration-300"
              >
                <Search size={18} />
                <span>Track</span>
              </Link>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center focus:outline-none"
                  >
                    <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#2E7D32] via-[#F4C20D] to-[#1E5AA8]">
                      {userPhotoUrl ? (
                        <img
                          src={userPhotoUrl}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2E7D32] text-sm font-bold">
                          {userDisplayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right"
                      >
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                          <div className="flex items-center space-x-3">
                            {userPhotoUrl ? (
                              <img
                                src={userPhotoUrl}
                                alt=""
                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#1E5AA8] flex items-center justify-center text-white font-bold text-lg">
                                {userDisplayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">
                                {userDisplayName}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {userEmail}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#1E5AA8] hover:bg-[#1E5AA8]/5 rounded-xl transition-all duration-200"
                            onClick={closeUserMenu}
                          >
                            <Home size={18} />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/dashboard/updateProfile"
                            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#1E5AA8] hover:bg-[#1E5AA8]/5 rounded-xl transition-all duration-200"
                            onClick={closeUserMenu}
                          >
                            <User size={18} />
                            <span>My Profile</span>
                          </Link>
                        </div>

                        <div className="p-2 border-t border-slate-50">
                          <button
                            onClick={handleLogOut}
                            className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                          >
                            <LogOut size={18} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#2E7D32] rounded-xl"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-100 overflow-hidden shadow-2xl"
          >
            <div className="p-4 space-y-2">
              <NavItem to="/" end icon={Home}>
                Home
              </NavItem>
              <NavItem to="/addParcel" icon={Package}>
                Add Parcel
              </NavItem>
              <NavItem to="/coverage" icon={Map}>
                Coverage
              </NavItem>
              {user && (
                <NavItem to="/dashboard" icon={Home}>
                  Dashboard
                </NavItem>
              )}
              <NavItem to="/beARider" icon={Bike}>
                Be a Rider
              </NavItem>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/contact"
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-[#1E5AA8]"
                  onClick={closeMobileMenu}
                >
                  <Phone size={18} />
                  <span>Contact Support</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
