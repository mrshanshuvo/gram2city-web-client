"use client";

import { Suspense } from "react";
import Component from "@/components/TrackParcel/TrackParcel";
import PageLoader from "@/components/Shared/PageLoader";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}
