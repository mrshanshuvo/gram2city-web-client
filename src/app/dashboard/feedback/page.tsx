"use client";

import Guard from '../../../routes/PrivateRoute';
import Component from '../../../views/Dashboard/Feedback/Feedback';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
