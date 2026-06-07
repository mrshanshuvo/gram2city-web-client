import React from "react";
import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Shared/Footer/Footer";
import ChatWidget from "@/components/Shared/ChatWidget";
import NavigationProgressBar from "@/components/Shared/NavigationProgressBar";
import ConnectionTracker from "@/components/Shared/ConnectionTracker";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ConnectionTracker />
      <NavigationProgressBar />
      <Navbar />
      <main className="grow pt-[var(--navbar-height)]">{children}</main>
      <ChatWidget />
      <Footer />
    </div>
  );
}
