"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { ServiceCenter } from "../../features/riders/types";

// Leaflet markers fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error - Leaflet icon prototype fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface FlyToDistrictProps {
  coords: [number, number];
}

// Component to fly to a district when searched
const FlyToDistrict: React.FC<FlyToDistrictProps> = ({ coords }) => {
  const map = useMap();
  React.useEffect(() => {
    if (coords) {
      map.flyTo(coords, 10, {
        duration: 1.5,
      });
    }
  }, [coords, map]);
  return null;
};

interface CoverageMapProps {
  serviceCenters: ServiceCenter[];
  targetCoords: [number, number] | null;
}

// Custom Icons for different statuses
const activeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const limitedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const comingSoonIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getStatusIcon = (status: string) => {
  if (status === "active") return activeIcon;
  if (status === "limited") return limitedIcon;
  return comingSoonIcon;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
          Active Hub
        </span>
      );
    case "limited":
      return (
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
          Express Only
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
          Launching Soon
        </span>
      );
  }
};

const CoverageMap: React.FC<CoverageMapProps> = ({
  serviceCenters,
  targetCoords,
}) => {
  const bangladeshCenter: [number, number] = [23.685, 90.3563];

  return (
    <div className="h-[750px] w-full rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 bg-white p-6">
      <MapContainer
        center={bangladeshCenter}
        zoom={7}
        scrollWheelZoom={true}
        className="h-[580px] w-full z-10 rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {targetCoords && <FlyToDistrict coords={targetCoords} />}

        {serviceCenters.map((district) => (
          <Marker
            key={district.district}
            position={[district.latitude, district.longitude]}
            icon={getStatusIcon(district.status)}
          >
            <Popup className="custom-popup">
              <div className="min-w-[200px] p-2 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-slate-900 text-lg leading-none">
                    {district.city}
                  </h3>
                  {getStatusBadge(district.status)}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium italic">
                    {district.district} District{district.region ? `, ${district.region}` : ""}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-600 font-bold mb-1 uppercase tracking-tight">
                    Main Hub Zones:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {district.covered_area?.map((area, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-md text-slate-500"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {district.status === "active" && district.flowchart && (
                  <a
                    href={district.flowchart}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-[#2E7D32] transition-colors uppercase tracking-widest"
                  >
                    View Network Map
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CoverageMap;
