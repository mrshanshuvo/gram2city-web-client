"use client";

import Guard from '../../../../routes/PrivateRoute';
import Component from '../../../../views/Dashboard/ParcelDetails/ParcelDetails';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
