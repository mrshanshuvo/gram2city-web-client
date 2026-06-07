"use client";

import Guard from '../../../routes/RiderRoute';
import Component from '../../../views/Dashboard/MyEarnings/MyEarnings';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
