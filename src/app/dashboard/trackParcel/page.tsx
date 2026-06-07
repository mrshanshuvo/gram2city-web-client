"use client";

import dynamic from "next/dynamic";
import Guard from '../../../routes/PrivateRoute';

const Component = dynamic(() => import('../../../views/Dashboard/TrackParcel/TrackParcel'), {
  ssr: false,
});

export default function Page() {
  return (
    <Guard>
      <Component />
    </Guard>
  );
}
