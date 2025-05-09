"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import CustomerNavbar from "@/components/Navbar/CustomerNavbar";

// Custom Marker Icon
const customMarker = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function EditCustomerProfile() {
  const router = useRouter();
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    location: "",
    latitude: 5.7744,
    longitude: -0.2133,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tempLocation, setTempLocation] = useState({ latitude: 5.7744, longitude: -0.2133 });
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (!storedCustomer) {
      setError("Customer data not found. Please log in again.");
      router.push("/customerfacing/login");
      return;
    }

    const customerData = JSON.parse(storedCustomer);
    setCustomer({
      id: customerData.id,
      name: customerData.name,
      location: customerData.location,
      latitude: customerData.latitude || 5.7744,
      longitude: customerData.longitude || -0.2133,
    });
    setTempLocation({
      latitude: customerData.latitude || 5.7744,
      longitude: customerData.longitude || -0.2133,
    });

    setLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.id) {
      setError("Customer ID is missing. Unable to update.");
      return;
    }

    try {
      const updatedCustomer = {
        ...customer,
        latitude: tempLocation.latitude,
        longitude: tempLocation.longitude,
      };

      const res = await fetch(`/api/customer/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCustomer),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem("customer", JSON.stringify(data));
        router.push("/customerfacing/dashboard/profile");
      }
    } catch (err) {
      setError("Failed to update customer details.");
    }
  };

  const confirmLocationChange = () => {
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      latitude: tempLocation.latitude,
      longitude: tempLocation.longitude,
    }));
    setLocationConfirmed(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <CustomerNavbar />
      <main className="max-w-lg mx-auto p-6 mt-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Profile</h1>
        <form onSubmit={handleUpdate} className="space-y-6">
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

          {/* Map Section */}
          <div className="w-full h-[400px] my-6">
            <MapContainer center={[customer.latitude, customer.longitude]} zoom={13} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker tempLocation={tempLocation} setTempLocation={setTempLocation} />
              <Geocoder setTempLocation={setTempLocation} />
            </MapContainer>
          </div>

          {/* Confirm Location Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={confirmLocationChange}
              className={`mt-2 text-white px-4 py-2 rounded w-full transition-colors ${
                locationConfirmed ? " bg-blue-600" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {locationConfirmed ? "Location Confirmed " : "Confirm Location Change"}
            </button>
          </div>

          {/* Latitude & Longitude Inputs */}
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={tempLocation.latitude}
              onChange={(e) => setTempLocation({ ...tempLocation, latitude: parseFloat(e.target.value) })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={tempLocation.longitude}
              onChange={(e) => setTempLocation({ ...tempLocation, longitude: parseFloat(e.target.value) })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Update Customer Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Update Profile
          </button>
        </form>
      </main>
    </>
  );
}

// Component for handling marker placement
function LocationMarker({ tempLocation, setTempLocation }: any) {
  const map = useMap();

  useEffect(() => {
    const marker = L.marker([tempLocation.latitude, tempLocation.longitude], {
      draggable: true,
      icon: customMarker,
    }).addTo(map);

    marker.on("dragend", (event) => {
      const { lat, lng } = event.target.getLatLng();
      setTempLocation({ latitude: lat, longitude: lng });
    });

    return () => marker.remove();
  }, [tempLocation, map, setTempLocation]);

  return null;
}

// Component for search feature
function Geocoder({ setTempLocation }: any) {
  const map = useMap();

  useEffect(() => {
    const control = L.Control.geocoder({ defaultMarkGeocode: false }).addTo(map);
    control.on("markgeocode", (e: any) => {
      const { lat, lng } = e.geocode.center;
      setTempLocation({ latitude: lat, longitude: lng });
      map.setView([lat, lng], 13);
    });

    return () => map.removeControl(control);
  }, [map, setTempLocation]);

  return null;
}
