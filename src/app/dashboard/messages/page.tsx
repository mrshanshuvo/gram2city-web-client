"use client";

import Guard from '../../../routes/AdminRoute';
import Component from '../../../views/Dashboard/AdminChat/AdminChat';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
