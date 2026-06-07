"use client";

import Guard from '../../../routes/PrivateRoute';
import Component from '../../../views/Dashboard/UpdateProfile/UpdateProfile';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
