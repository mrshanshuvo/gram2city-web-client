"use client";

import Guard from '../../../routes/AdminRoute';
import Component from '../../../views/Dashboard/MakeAdmin/MakeAdmins';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
