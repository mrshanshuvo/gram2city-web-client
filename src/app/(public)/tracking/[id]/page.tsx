import React, { Suspense } from "react";
import TrackParcelClient from "./TrackParcelClient";
import PageLoader from "@/components/Shared/PageLoader";
import { fetchPublicTracking } from "@/features/parcels/api";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const tracking = await fetchPublicTracking(id);
    const latestUpdate = tracking?.[0];
    const status = latestUpdate?.status?.replace("_", " ") || "Pending";
    const location = latestUpdate?.location || "Central Hub";
    return {
      title: `Track Shipment ${id} | Gram2City`,
      description: `Shipment Status: ${status} at ${location}. Real-time parcel tracking and delivery journey.`,
    };
  } catch (err) {
    return {
      title: `Track Shipment ${id} | Gram2City`,
      description: `Real-time parcel tracking and delivery journey.`,
    };
  }
}

async function TrackParcelServerContent({ id }: { id: string }) {
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

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<PageLoader />}>
      <TrackParcelServerContent id={id} />
    </Suspense>
  );
}
