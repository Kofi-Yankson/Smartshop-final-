"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import StoreNavbar from "@/components/Navbar/StoreNavbar";

// Custom Marker Icon
const customMarker = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function EditStorePage() {
  const router = useRouter();
  const [store, setStore] = useState({
    name: "",
    location: "",
    category: "",
    latitude: 5.6885,
    longitude: -0.2096,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tempLocation, setTempLocation] = useState({ latitude: 5.6885, longitude: -0.2096 });

  useEffect(() => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      setError("Store ID not found. Please log in again.");
      return;
    }

    fetch(`/api/stores/${storeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setStore({
            name: data.name,
            location: data.location,
            category: data.category,
            latitude: data.latitude || 5.6885,
            longitude: data.longitude || -0.2096,
          });
          setTempLocation({
            latitude: data.latitude || 5.6885,
            longitude: data.longitude || -0.2096,
          });
        }
      })
      .catch(() => setError("Failed to fetch store details."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storeId = localStorage.getItem("storeId");
    if (!storeId) return;
  
    try {
      // Send `tempLocation` directly instead of waiting for state update
      const updatedStore = {
        ...store,
        latitude: tempLocation.latitude,
        longitude: tempLocation.longitude,
      };
  
      console.log("Sending updated store data:", updatedStore); // Debugging log
  
      const res = await fetch(`/api/stores/${storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStore),
      });
  
      const data = await res.json();
      console.log("API Response:", data); // Debugging log
  
      if (data.error) {
        setError(data.error);
      } else {
        router.push("/storefacing/dashboard/profile");
      }
    } catch (err) {
      setError("Failed to update store details.");
    }
  };
  
  const [locationConfirmed, setLocationConfirmed] = useState(false); // Track confirmation

  const confirmLocationChange = () => {
    setStore((prevStore) => ({
      ...prevStore,
      latitude: tempLocation.latitude,
      longitude: tempLocation.longitude,
    }));
    setLocationConfirmed(true); // Mark location as confirmed
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <StoreNavbar />
      <main className="max-w-lg mx-auto p-6 mt-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Store</h1>
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing */}
  <div>
    <label className="block text-sm font-medium">Name</label>
    <input
      type="text"
      name="name"
      value={store.name}
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
      value={store.location}
      onChange={handleChange}
      className="w-full border px-3 py-2 rounded"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Category</label>
    <input
      type="text"
      name="category"
      value={store.category}
      onChange={handleChange}
      className="w-full border px-3 py-2 rounded"
      required
    />
    
  </div>

  {/* Map Section */}
  <div className="w-full h-[400px] my-6"> 
    <MapContainer center={[store.latitude, store.longitude]} zoom={13} className="h-full w-full">
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

  {/* Update Store Button */}
  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
    Update Store
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
      icon: customMarker
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
