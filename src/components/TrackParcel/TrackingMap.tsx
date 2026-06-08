"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Marker for Rider
const riderIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/713/713438.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

import { TrackingMapProps } from "@/types";

// Component to auto-center map when location updates
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const TrackingMap: React.FC<TrackingMapProps> = ({ riderLocation }) => {
  return (
    <MapContainer
      center={
        riderLocation
          ? [riderLocation.lat, riderLocation.lng]
          : [23.8103, 90.4125]
      }
      zoom={13}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {riderLocation && (
        <>
          <Marker
            position={[riderLocation.lat, riderLocation.lng]}
            icon={riderIcon}
          >
            <Popup>
              <div className="text-center font-outfit">
                <p className="font-black text-gray-800 uppercase tracking-tighter">
                  Rider is here
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Real-time GPS Stream
                </p>
              </div>
            </Popup>
          </Marker>
          <RecenterMap
            lat={riderLocation.lat}
            lng={riderLocation.lng}
          />
        </>
      )}
    </MapContainer>
  );
};

export default TrackingMap;
