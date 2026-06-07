"use client";

import authBg from "../assets/auth_bg.png";
import Image from "next/image";
import Gram2CityLogo from "../views/Shared/Gram2CityLogo/Gram2CityLogo";
import { motion } from "framer-motion";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-outfit">
      {/* Left Panel: Cinematic Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={authBg}
            alt="Authentication background"
            fill
            sizes="50vw"
            className="w-full h-full object-cover"
            priority
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        </motion.div>

        {/* Branding on Image */}
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 px-0 bg-accent rounded-full" />
              <span className="text-[#F4C20D] font-black uppercase tracking-[0.3em] text-xs">
                Premium Logistics
              </span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight mb-4">
              Moving Lives, <br />
              <span className="text-[#F4C20D]">Connecting Dreams.</span>
            </h2>
            <p className="text-slate-300 text-lg font-medium max-w-md">
              Join the nation's fastest-growing logistics network and experience
              seamless delivery from village to city.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-white">
        {/* Mobile Logo */}
        <header className="px-8 py-8 flex justify-between items-center lg:px-12">
          <Gram2CityLogo />
          <div className="lg:hidden">
            <div className="w-10 h-1 bg-primary rounded-full" />
          </div>
        </header>

        <main className="grow flex items-center justify-center px-6 pb-12 sm:px-12">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </main>

        {/* Simple Footer */}
        <footer className="px-12 py-8 text-center lg:text-left">
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-extrabold tracking-tight">
              <span className="text-[#2E7D32]">Gram</span>
              <span className="text-[#F4C20D]">2</span>
              <span className="text-[#1E5AA8]">City</span>
            </span>{" "}
            Logistics. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
