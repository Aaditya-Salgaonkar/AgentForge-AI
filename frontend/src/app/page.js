"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import GeminiChat from "@/components/GeminiChat";

// Dynamically import the MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading map...</div>,
});

export default function Home() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");

  const handleLocationFound = (coords, name) => {
    setLocation(coords);
    setLocationName(name);
  };

  return (
    <main className="container">
      <h1>Map Explorer Bot</h1>
      <p className="subtitle">Ask about any location in natural language</p>

      <div className="map-container">
        {locationName && <h2 className="location-title">{locationName}</h2>}
        <MapComponent location={location} />
      </div>

      <GeminiChat onLocationFound={(coords) => handleLocationFound(coords)} />
    </main>
  );
}
