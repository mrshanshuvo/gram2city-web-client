"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";

import Navbar from "../views/Shared/Navbar/Navbar";
import Footer from "../views/Shared/Footer/Footer";
import ChatWidget from "../components/Shared/ChatWidget";
import NavigationProgressBar from "../components/Shared/NavigationProgressBar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleOnline = () =>
      toast.success("Back online!", {
        description: "You are reconnected to the logistics network.",
      });
    const handleOffline = () =>
      toast.error("Offline mode", {
        description: "Please check your internet connection.",
      });

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationProgressBar />
      <Navbar />
      <main className="flex-grow pt-[var(--navbar-height)]">
        {children}
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default RootLayout;
