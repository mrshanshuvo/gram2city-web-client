"use client";

import Guard from '../../../routes/AdminRoute';
import Component from '../../../views/Dashboard/FinancialSettings/FinancialSettings';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
