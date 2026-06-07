"use client";

import Guard from "../../../routes/AdminRoute";
import Component from "../../../views/Dashboard/AdminFeedback/AdminFeedback";

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
