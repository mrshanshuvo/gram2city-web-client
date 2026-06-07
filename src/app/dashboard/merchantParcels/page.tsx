"use client";

import Guard from '../../../routes/MerchantRoute';
import Component from '../../../views/Dashboard/MerchantParcels/MerchantParcels';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
