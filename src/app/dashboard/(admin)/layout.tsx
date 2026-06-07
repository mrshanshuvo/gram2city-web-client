import React from "react";
import Guard from "../../../routes/AdminRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Guard>{children}</Guard>;
}
