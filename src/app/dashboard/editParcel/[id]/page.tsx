"use client";

import Guard from '../../../../routes/PrivateRoute';
import Component from '../../../../views/AddParcel/EditParcel';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
