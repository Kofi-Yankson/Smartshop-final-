"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultNavbar from "@/components/Navbar/DefaultNavbar";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import AdminNavbar from "@/components/Navbar/AdminNavbar";

const customMarker = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function CustomerRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [tempLocation, setTempLocation] = useState({ latitude: 5.7744, longitude: -0.2133 });
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmLocationChange = () => setLocationConfirmed(true);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          location,
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Redirecting to login...");
        router.push("/admin/dadboard/customers");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <AdminNavbar />
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Create Customer Account</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-5">
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
            <input type="text" placeholder="Location Name" value={location} onChange={(e) => setLocation(e.target.value)} className="input" required />

            {/* Leaflet Map */}
            <div className="w-full h-[300px] my-4">
              <MapContainer center={[tempLocation.latitude, tempLocation.longitude]} zoom={13} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker tempLocation={tempLocation} setTempLocation={setTempLocation} />
                <Geocoder setTempLocation={setTempLocation} />
              </MapContainer>
            </div>

            <button
              type="button"
              onClick={confirmLocationChange}
              className={`w-full py-2 rounded text-white ${locationConfirmed ? "bg-blue-600" : "bg-green-600 hover:bg-green-700"}`}
            >
              {locationConfirmed ? "Location Confirmed" : "Confirm Location"}
            </button>

            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-green-600" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

// Map components
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
