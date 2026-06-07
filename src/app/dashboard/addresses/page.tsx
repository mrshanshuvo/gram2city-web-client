"use client";

import Guard from '../../../routes/PrivateRoute';
import Component from '../../../views/Dashboard/AddressBook/AddressBook';

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
