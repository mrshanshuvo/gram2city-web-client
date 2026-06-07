"use client";

import Guard from '../../../routes/AdminRoute';
import Component from '../../../views/Dashboard/LandingPageManager/LandingPageManager';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
