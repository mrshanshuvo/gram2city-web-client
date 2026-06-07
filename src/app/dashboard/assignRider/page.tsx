"use client";

import Guard from '../../../routes/AdminRoute';
import Component from '../../../views/Dashboard/AssignRider/AssignRider';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
