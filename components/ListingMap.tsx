"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix the default icon issue in Leaflet + Next.js
import L from "leaflet";
// Correctly override default icon config for Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export function ListingMap() {
  const position: [number, number] = [5.0207, 7.9273];

  return (
    <div className="mt-4 h-[400px] w-full rounded-md overflow-hidden">
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Reenite Location <br /> 162 Oron Road, Uyo
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
