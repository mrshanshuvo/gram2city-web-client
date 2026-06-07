import React, { Suspense } from "react";
import TrackParcelClient from "./TrackParcelClient";
import PageLoader from "@/components/Shared/PageLoader";
import { fetchPublicTracking } from "@/features/parcels/api";

export const metadata = {
  title: "Track Shipment | Gram2City",
  description:
    "Real-time logistics intelligence. Track your parcel delivery status from Gram to City.",
};

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

async function TrackParcelServerContent({ id }: { id?: string }) {
  let initialData = [];
  try {
    if (id) {
      initialData = await fetchPublicTracking(id);
    }
  } catch (err) {
    console.error("Error prefetching tracking details:", err);
  }

  return <TrackParcelClient id={id} initialData={initialData} />;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id;

  return (
    <Suspense fallback={<PageLoader />}>
      <TrackParcelServerContent id={id} />
    </Suspense>
  );
}
