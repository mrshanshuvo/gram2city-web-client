"use client";

import Guard from '../../../routes/AdminRoute';
import Component from '../../../views/Dashboard/ManageMerchants/ManageMerchants';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
