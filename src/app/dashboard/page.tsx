"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/authStore";

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, role: storedRole, isLoading } = useAuthStore();
  const role = storedRole || user?.role;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const targetRole = role || "user";
    router.replace(`/dashboard/${targetRole}`);
  }, [user, role, isLoading, router]);

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <progress className="progress progress-primary w-56"></progress>
    </div>
  );
}
