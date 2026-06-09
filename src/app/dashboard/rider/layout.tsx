import React from "react";
import Guard from "../../../routes/RiderRoute";

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  return <Guard>{children}</Guard>;
}
