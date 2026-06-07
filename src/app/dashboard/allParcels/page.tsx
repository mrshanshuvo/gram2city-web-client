"use client";

import Guard from "../../../routes/AdminRoute";
import Component from "../../../views/Dashboard/AllParcels/AllParcels";

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
