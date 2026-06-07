"use client";

import Guard from "../../routes/PrivateRoute";
import Component from "../../views/AddParcel/AddParcel";
import RootLayout from "../../layouts/RootLayout";

export default function Page() {
  return (
    <Guard>
      <RootLayout>
        <Component />
      </RootLayout>
    </Guard>
  );
}
