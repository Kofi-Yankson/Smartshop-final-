"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AdminNavbar from "@/components/Navbar/AdminNavbar"; // Adjust if needed

const customMarker = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function AdminEditCustomerProfile() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string;

  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
    location: "",
    latitude: 5.7744,
    longitude: -0.2133,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tempLocation, setTempLocation] = useState({ latitude: 5.7744, longitude: -0.2133 });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customer/${customerId}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setCustomer({
            id: data.id,
            name: data.name,
            email: data.email,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
          });
          setTempLocation({ latitude: data.latitude, longitude: data.longitude });
        }
      } catch (err) {
        setError("Failed to fetch customer.");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchCustomer();
  }, [customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedCustomer = {
        ...customer,
        latitude: tempLocation.latitude,
        longitude: tempLocation.longitude,
      };

      const res = await fetch(`/api/customer/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCustomer),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        router.push("/admin/customers");
      }
    } catch (err) {
      setError("Failed to update customer.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <>
      <AdminNavbar />
      <main className="max-w-xl mx-auto p-6 mt-8 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Customer Profile</h1>
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={customer.location}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Latitude & Longitude Inputs */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={tempLocation.latitude}
                onChange={(e) =>
                  setTempLocation({ ...tempLocation, latitude: parseFloat(e.target.value) })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={tempLocation.longitude}
                onChange={(e) =>
                  setTempLocation({ ...tempLocation, longitude: parseFloat(e.target.value) })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          {/* Map */}
          <div className="h-[300px] rounded overflow-hidden mt-4 border">
            <MapContainer center={[tempLocation.latitude, tempLocation.longitude]} zoom={13} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[tempLocation.latitude, tempLocation.longitude]} icon={customMarker} />
            </MapContainer>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold mt-6"
          >
            Update Customer
          </button>
        </form>
      </main>
    </>
  );
}
