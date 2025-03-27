"use client";

import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";

const MapComponent = ({ location }) => {
  const [showInfo, setShowInfo] = useState(false);

  const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const center = location || {
    lat: 0,
    lng: 0,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={location ? 15 : 2}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {location && (
          <>
            <Marker position={location} onClick={() => setShowInfo(true)} />
            {showInfo && (
              <InfoWindow
                position={location}
                onCloseClick={() => setShowInfo(false)}
              >
                <div style={{ padding: "8px" }}>
                  <h3 style={{ margin: 0 }}>Location Found</h3>
                  <p style={{ margin: "4px 0 0" }}>
                    Latitude: {location.lat.toFixed(4)}
                    <br />
                    Longitude: {location.lng.toFixed(4)}
                  </p>
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
