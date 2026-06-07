"use client";

import dynamic from "next/dynamic";
import RootLayout from '../../../layouts/RootLayout';

const Component = dynamic(() => import("@/views/Dashboard/TrackParcel/TrackParcel"), {
  ssr: false,
});

export default function Page() {
  return (
    <RootLayout>
      <Component />
    </RootLayout>
  );
}
