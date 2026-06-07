"use client";

import Guard from "../../../routes/PrivateRoute";
import Component from "@/views/AddParcel/AddParcel";

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
