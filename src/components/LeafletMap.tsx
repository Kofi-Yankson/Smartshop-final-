"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the map component
const DynamicMap = dynamic(() => import("./ActualLeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function LeafletMap() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      require("leaflet");
    } catch (error) {
      console.error("Map failed to load:", error);
      setHasError(true);
    }
  }, []);

  if (hasError) {
    return (
      <div>
        <p>Interactive map failed to load. Showing static map instead.</p>
        {/* Static map as a fallback */}
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=5.6817,-0.1767&zoom=17&size=600x300&maptype=roadmap
          &markers=color:red%7Clabel:A%7C5.6817,-0.1767
          &key=YOUR_GOOGLE_MAPS_API_KEY`}
          alt="Static map of Academic City University College"
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </div>
    );
  }

  return <DynamicMap />;
}
