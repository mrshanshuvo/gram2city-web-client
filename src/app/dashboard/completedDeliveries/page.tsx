"use client";

import Guard from "../../../routes/RiderRoute";
import Component from "../../../views/Dashboard/CompletedDeliveries/CompletedDeliveries";

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
