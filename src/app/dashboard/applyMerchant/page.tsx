"use client";

import Guard from "../../../routes/PrivateRoute";
import Component from "../../../views/Dashboard/MerchantApplication/MerchantApplication";

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
