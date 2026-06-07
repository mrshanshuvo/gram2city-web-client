"use client";

import Guard from '../../../routes/RiderRoute';
import Component from '../../../views/Dashboard/PendingDeliveries/PendingDeliveries';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
