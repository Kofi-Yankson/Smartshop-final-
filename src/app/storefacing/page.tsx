"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StoreNavbar from "@/components/Navbar/StoreNavbar";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Marker Icon
const customMarker = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function StoreDashboard() {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      const storeId = localStorage.getItem("storeId");
      if (!storeId) {
        router.push("/storefacing/login"); // Redirect if not logged in
        return;
      }

      try {
        const res = await fetch(`/api/stores/${storeId}`);
        const data = await res.json();

        if (res.ok) {
          setStore(data);
        } else {
          console.error("Failed to fetch store details:", data.error);
          router.push("/storefacing/login");
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
        router.push("/storefacing/login");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!store) {
    return <p className="text-center text-red-500">Store not found</p>;
  }

  return (
    <>
      <StoreNavbar />
      <main className="p-6 min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">{store.name}</h1>
          <p className="text-lg mb-4 text-gray-700">
            <strong>Category:</strong> {store.category}
          </p>
          <p className="text-lg mb-6 text-gray-700">
            <strong>Location:</strong> {store.location}
          </p>

          {/* Leaflet Map */}
          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md border">
            <MapContainer
              center={[store.latitude, store.longitude]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[store.latitude, store.longitude]} icon={customMarker} />
            </MapContainer>
          </div>
        </div>
      </main>
    </>
  );
}
