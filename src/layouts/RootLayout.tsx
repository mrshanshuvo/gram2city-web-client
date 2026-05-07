import React, { useEffect } from "react";
import { toast } from "sonner";
import { Outlet } from "react-router";
import Navbar from "../pages/Shared/Navbar/Navbar";
import Footer from "../pages/Shared/Footer/Footer";
import ChatWidget from "../components/Shared/ChatWidget";
import NavigationProgressBar from "../components/Shared/NavigationProgressBar";

const RootLayout: React.FC = () => {
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
        <Outlet />
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default RootLayout;
