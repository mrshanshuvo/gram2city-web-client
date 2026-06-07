import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/Shared/PageLoader";
import dynamic from "next/dynamic";

// Dynamically import the client tracking component to keep the page shell pure server-side
const TrackParcel = dynamic(() => import("@/components/TrackParcel/TrackParcel"), {
  ssr: true, // We want the shell to render during SSR
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/public/tracking/${id}`);
    if (!response.ok) {
      return {
        title: `Track Shipment ${id} | Gram2City`,
        description: `Track your shipment live with Gram2City Logistics.`,
      };
    }
    const result = await response.json();
    const history = result?.history;

    if (!history || history.length === 0) {
      return {
        title: `Shipment ${id} | Gram2City`,
        description: `No tracking information is available yet for shipment ${id}.`,
      };
    }

    const latest = history[0];
    return {
      title: `Shipment ${id} Status: ${latest.status.toUpperCase()} | Gram2City`,
      description: `Latest update: ${latest.details} at ${latest.location || "Hub"}.`,
    };
  } catch {
    return {
      title: `Track Shipment ${id} | Gram2City`,
      description: `Track your shipment live with Gram2City Logistics.`,
    };
  }
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <TrackParcel />
    </Suspense>
  );
}
