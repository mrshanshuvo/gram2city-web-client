"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ConnectionTracker() {
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

  return null;
}
