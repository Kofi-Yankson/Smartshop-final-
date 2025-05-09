"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function ActualLeafletMap() {
  return (
    <MapContainer center={[5.6817, -0.1767]} zoom={19} style={{ height: "40px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[5.6817, -0.1767]}>
        <Popup>Academic City University College</Popup>
      </Marker>
    </MapContainer>
  );
}
