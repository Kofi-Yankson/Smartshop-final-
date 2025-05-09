"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerNavbar from "@/components/Navbar/CustomerNavbar";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components (Only on client-side)
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });

interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  latitude: number;
  longitude: number;
}

// Custom Marker Icon
const customMarker = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (!storedCustomer) {
      router.push("/customerfacing/login");
      return;
    }

    const customerData = JSON.parse(storedCustomer);
    setCustomer(customerData);
    setLoading(false);
  }, [router]);

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading...</p>;
  if (!customer) return <p className="text-center mt-6 text-red-600">Customer not found.</p>;

  return (
    <>
      <CustomerNavbar />
      <main className="max-w-4xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Customer Profile</h1>

        <div className="bg-white p-6 rounded-xl shadow-md mt-6 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {customer.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {customer.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Location:</span> {customer.location}
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {customer.latitude && customer.longitude && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Your Location</h2>
            <div className="w-full h-[400px] rounded-lg overflow-hidden border shadow-md">
              <MapContainer center={[customer.latitude, customer.longitude]} zoom={13} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[customer.latitude, customer.longitude]} icon={customMarker} />
              </MapContainer>
            </div>
          </div>
        )}

        {/* Edit Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/customerfacing/dashboard/profile/edit")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Edit Profile
          </button>
        </div>
      </main>
    </>
  );
}
