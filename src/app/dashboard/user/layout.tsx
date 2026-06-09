import React from "react";
import Guard from "../../../routes/PrivateRoute";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <Guard>{children}</Guard>;
}
