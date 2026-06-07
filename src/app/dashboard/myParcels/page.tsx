"use client";

import Guard from '../../../routes/PrivateRoute';
import Component from '../../../views/Dashboard/MyParcels/MyParcels';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
