import React from "react";
import Guard from "../../../routes/MerchantRoute";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return <Guard>{children}</Guard>;
}
