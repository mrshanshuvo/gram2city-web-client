import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, User, LogOut, Home, Package, Map, Bike, Phone } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import Gram2CityLogo from "../Gram2CityLogo/Gram2CityLogo";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const closeUserMenu = () => setUserMenuOpen(false);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeClass = "bg-[#1E5AA8] text-white shadow-sm";
  const inactiveClass = "text-[#2E7D32] hover:text-[#1E5AA8] hover:bg-[#F4C20D]/10";

  // Get user photo URL from providerUserInfo
  const getUserPhotoUrl = () => {
    const googleProvider = user?.providerData?.find(
      p => p.providerId === "google.com"
    );
    return googleProvider?.photoURL || user?.photoURL || null;
  };

  const getUserDisplayName = () => {
    const googleProvider = user?.providerData?.find(
      p => p.providerId === "google.com"
    );
    return (
      googleProvider?.displayName ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "User"
    );
  };

  const getUserEmail = () => {
    const googleProvider = user?.providerData?.find(
      p => p.providerId === "google.com"
    );
    return googleProvider?.email || user?.email || "";
  };

  const userPhotoUrl = getUserPhotoUrl();
  const userDisplayName = getUserDisplayName();
  const userEmail = getUserEmail();

  // Reusable NavItem component with proper icon and text alignment
  const NavItem = ({ to, children, icon: Icon, end = false }) => (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? activeClass : inactiveClass
          }`
        }
        onClick={closeMobileMenu}
      >
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        {children}
      </NavLink>
    </li>
  );

  const handleLogOut = () => {
    closeMobileMenu();
    closeUserMenu();
    if (logOut) {
      logOut();
    }
    navigate("/login");
  };

  return (
    <nav className="bg-white mb-8 border-b border-[#F4C20D]/30 sticky top-0 z-50 transition-all duration-300 rounded-3xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[#2E7D32] hover:text-[#1E5AA8] hover:bg-[#F4C20D]/10 transition-colors duration-200"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <Gram2CityLogo />
          </div>

          {/* Desktop Navigation with icons */}
          <ul className="hidden lg:flex items-center space-x-1 list-none m-0 p-0">
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
          <div className="flex items-center space-x-3">
            <NavLink
              to="/contact"
              className="hidden sm:inline-flex items-center px-4 py-2.5 text-sm font-medium text-[#2E7D32] hover:text-[#1E5AA8] transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </NavLink>

            {user ? (
              // User Avatar Dropdown - Clean and minimal (no chevron)
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center p-1 rounded-full hover:bg-[#F4C20D]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4C20D] focus:ring-offset-2"
                >
                  {/* User Avatar - Just the image, no chevron */}
                  {userPhotoUrl ? (
                    <img
                      src={userPhotoUrl}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#F4C20D]"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#2E7D32] to-[#1E5AA8] flex items-center justify-center text-white text-sm font-medium">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu - Shows info only when clicked */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#F4C20D]/30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Section - Only visible in dropdown */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        {userPhotoUrl ? (
                          <img
                            src={userPhotoUrl}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#F4C20D]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2E7D32] to-[#1E5AA8] flex items-center justify-center text-white font-medium">
                            {userDisplayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#2E7D32] truncate">
                            {userDisplayName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <NavLink
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#2E7D32] hover:text-[#1E5AA8] hover:bg-[#F4C20D]/10 transition-colors duration-200"
                        onClick={() => {
                          closeUserMenu();
                          closeMobileMenu();
                        }}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </NavLink>

                      <NavLink
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-[#2E7D32] hover:text-[#1E5AA8] hover:bg-[#F4C20D]/10 transition-colors duration-200"
                        onClick={() => {
                          closeUserMenu();
                          closeMobileMenu();
                        }}
                      >
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                      </NavLink>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100"></div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2E7D32] to-[#1E5AA8] rounded-lg hover:from-[#1E5AA8] hover:to-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#F4C20D] focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation with icons */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F4C20D]/30 bg-white">
          <ul className="px-4 py-4 space-y-2 list-none m-0 p-0">
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
            <NavItem to="/profile" icon={User}>
              My Profile
            </NavItem>
          </ul>

          <NavLink
            to="/contact"
            className="flex items-center px-4 py-3 text-base font-medium text-[#2E7D32] hover:text-[#1E5AA8] hover:bg-[#F4C20D]/10 rounded-lg transition-all duration-200"
            onClick={closeMobileMenu}
          >
            <Phone className="h-5 w-5 mr-3" />
            Contact
          </NavLink>

          <div className="pt-4 pb-2">
            {user ? (
              <button
                onClick={handleLogOut}
                className="flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[#2E7D32] to-[#1E5AA8] rounded-lg hover:from-[#1E5AA8] hover:to-[#2E7D32] transition-all duration-200 shadow-sm"
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;