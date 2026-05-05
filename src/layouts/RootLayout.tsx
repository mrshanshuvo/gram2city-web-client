import React from "react";
import { Outlet } from "react-router";
import Navbar from "../pages/Shared/Navbar/Navbar";
import Footer from "../pages/Shared/Footer/Footer";
import ChatWidget from "../components/Shared/ChatWidget";

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
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
