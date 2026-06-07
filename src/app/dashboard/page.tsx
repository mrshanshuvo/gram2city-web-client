"use client";

import Guard from "../../routes/PrivateRoute";
import Component from "../../views/Dashboard/DashboardHome/DashboardHome";

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
