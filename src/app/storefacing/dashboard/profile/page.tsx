"use client";

import { useEffect, useState } from "react";
import StoreNavbar from "@/components/Navbar/StoreNavbar";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Dynamically import react-leaflet components (Only on client-side)
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });

interface Store {
  id: string;
  name: string;
  location: string;
  category: string;
  latitude: number;
  longitude: number;
}

// Custom Marker Icon
const customMarker = typeof window !== "undefined" ? new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
}) : null;

export default function StoreProfilePage() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      console.error("No storeId found in local storage");
      setLoading(false);
      return;
    }

    fetch(`/api/stores/${storeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching store:", data.error);
        } else {
          setStore(data);
        }
      })
      .catch((err) => console.error("Failed to fetch store:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading...</p>;
  if (!store) return <p className="text-center mt-6 text-red-600">Store not found.</p>;

  return (
    <>
      <StoreNavbar />
      <main className="max-w-4xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Store Profile</h1>

        <div className="bg-white p-6 rounded-xl shadow-md mt-6 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700"><span className="font-semibold">Name:</span> {store.name}</p>
              <p className="text-gray-700"><span className="font-semibold">Location:</span> {store.location}</p>
              <p className="text-gray-700"><span className="font-semibold">Category:</span> {store.category}</p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {store.latitude && store.longitude && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Store Location</h2>
            <div className="w-full h-[400px] rounded-lg overflow-hidden border shadow-md">
              <MapContainer center={[store.latitude, store.longitude]} zoom={13} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {customMarker && <Marker position={[store.latitude, store.longitude]} icon={customMarker} />}
              </MapContainer>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/storefacing/dashboard/profile/edit")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Edit Store
          </button>
        </div>
      </main>
    </>
  );
}
