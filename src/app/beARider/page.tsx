"use client";

import Guard from '../../routes/PrivateRoute';
import Component from '../../views/Dashboard/BeARider/BeARider';
import RootLayout from '../../layouts/RootLayout';

export default function Page() {
  return (
    <Guard>
      <RootLayout>
        <Component />
      </RootLayout>
    </Guard>
  );
}
