"use client";

import Guard from '../../../routes/AdminRoute';
import Component from '../../../views/Dashboard/ApprovedRiders/ApprovedRiders';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
