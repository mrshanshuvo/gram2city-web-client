"use client";

import Guard from '../../../routes/AdminRoute';
import Component from '../../../views/Dashboard/PendingRiders/PendingRiders';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
