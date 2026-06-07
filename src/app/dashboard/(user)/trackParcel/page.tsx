"use client";

import dynamic from "next/dynamic";

const Component = dynamic(() => import('@/views/Dashboard/TrackParcel/TrackParcel'), {
  ssr: false,
});

export default function Page() {
  return <Component />;
}
