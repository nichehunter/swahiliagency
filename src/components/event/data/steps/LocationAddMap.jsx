"use client";

import { useEffect, useRef, useState } from "react";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { EnvironmentOutlined } from "@ant-design/icons";

/* ==========================================
   DEFAULT LOCATION
   ASKARI MONUMENT - DAR ES SALAAM
========================================== */

export const DEFAULT_LOCATION = {
  latitude: -6.81663,
  longitude: 39.28948,
};

/* ==========================================
   CUSTOM LOCATION ICON
========================================== */

const locationIcon = L.divIcon({
  className: "sw-details-location-marker",

  html: `
    <div class="sw-details-location-marker-wrapper">

      <div class="sw-details-location-pulse"></div>

      <div class="sw-details-location-marker-inner">
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21C12 21 19 15.5 19 9.5C19 5.91 15.87 3 12 3C8.13 3 5 5.91 5 9.5C5 15.5 12 21 12 21Z"
            fill="#ff7a00"
            stroke="white"
            stroke-width="1.5"
          />

          <circle
            cx="12"
            cy="9.5"
            r="2.5"
            fill="white"
          />
        </svg>
      </div>

    </div>
  `,

  iconSize: [50, 68],
  iconAnchor: [25, 50],
});

/* ==========================================
   MAP
========================================== */

export default function LocationAddMap({
  latitude,
  longitude,
  editing = true,
  onChange,
}) {
  const hasLatitudeValue =
    latitude !== null &&
    latitude !== undefined &&
    String(latitude).trim() !== "";

  const hasLongitudeValue =
    longitude !== null &&
    longitude !== undefined &&
    String(longitude).trim() !== "";

  const parsedLatitude = hasLatitudeValue ? Number(latitude) : NaN;

  const parsedLongitude = hasLongitudeValue ? Number(longitude) : NaN;

  const hasValidCoordinates =
    hasLatitudeValue &&
    hasLongitudeValue &&
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude) &&
    parsedLatitude >= -90 &&
    parsedLatitude <= 90 &&
    parsedLongitude >= -180 &&
    parsedLongitude <= 180;

  const [initialLocation, setInitialLocation] = useState(null);

  /* ==========================================
     GET USER LOCATION FIRST
  ========================================== */

  useEffect(() => {
    // If coordinates already exist, don't ask for location.
    if (hasValidCoordinates) {
      setTimeout(() => {
        setInitialLocation({
          latitude: parsedLatitude,
          longitude: parsedLongitude,
        });
      }, 0);

      return;
    }

    if (!navigator.geolocation) {
      setTimeout(() => {
        setInitialLocation(DEFAULT_LOCATION);
      }, 0);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setInitialLocation(userLocation);
      },

      () => {
        // Location failed/denied/timed out
        setInitialLocation(DEFAULT_LOCATION);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  /* ==========================================
     WAIT FOR INITIAL LOCATION
  ========================================== */

  if (!initialLocation) {
    return (
      <div className="sw-details-map-loading">
        <span>Locating...</span>
      </div>
    );
  }

  const mapLatitude = hasValidCoordinates
    ? parsedLatitude
    : initialLocation.latitude;

  const mapLongitude = hasValidCoordinates
    ? parsedLongitude
    : initialLocation.longitude;

  return (
    <MapContainer
      center={[mapLatitude, mapLongitude]}
      zoom={12}
      scrollWheelZoom={false}
      dragging={editing}
      doubleClickZoom={false}
      touchZoom={editing}
      zoomControl={false}
      attributionControl={false}
      className="sw-details-map-container"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <CenterLocationPicker onChange={onChange} />

      <MapResizeHandler />

      <MapControls onLocationChange={onChange} />
    </MapContainer>
  );
}

/* ==========================================
   DRAGGABLE LOCATION MARKER
========================================== */

function LocationMarker({ latitude, longitude }) {
  return (
    <Marker
      position={[latitude, longitude]}
      icon={locationIcon}
      draggable={false}
    />
  );
}

/* ==========================================
   UPDATE MAP WHEN COORDINATES CHANGE
========================================== */

function MapLocationUpdater({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    map.setView([latitude, longitude], map.getZoom(), {
      animate: false,
    });
  }, [map, latitude, longitude]);

  return null;
}

function CenterLocationPicker({ onChange }) {
  const map = useMap();

  useEffect(() => {
    if (!onChange) {
      return;
    }

    const updateLocation = () => {
      const center = map.getCenter();

      onChange({
        latitude: Number(center.lat.toFixed(6)),
        longitude: Number(center.lng.toFixed(6)),
      });
    };

    map.on("moveend", updateLocation);

    return () => {
      map.off("moveend", updateLocation);
    };
  }, [map, onChange]);

  return (
    <div className="sw-details-map-center-marker">
      <div className="sw-details-location-marker-wrapper">
        <div className="sw-details-location-pulse" />

        <div className="sw-details-location-marker-inner">
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21C12 21 19 15.5 19 9.5C19 5.91 15.87 3 12 3C8.13 3 5 5.91 5 9.5C5 15.5 12 21 12 21Z"
              fill="#ff7a00"
              stroke="white"
              strokeWidth="1.5"
            />

            <circle cx="12" cy="9.5" r="2.5" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   MAP RESIZE HANDLER
========================================== */

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);

      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

/* ==========================================
   CUSTOM ZOOM CONTROL
========================================== */

function MapControls({ onLocationChange }) {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6));

        const longitude = Number(position.coords.longitude.toFixed(6));

        /*
         * Move map to user's location
         */
        map.setView([latitude, longitude], 13, {
          animate: true,
        });

        /*
         * Update form coordinates
         */
        if (onLocationChange) {
          onLocationChange({
            latitude,
            longitude,
          });
        }
      },

      (error) => {
        console.log("Unable to get current location:", error.message);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="sw-details-map-controls">
      {/* LOCATE ME */}

      <button
        type="button"
        onClick={handleLocateMe}
        aria-label="Locate my location"
        title="Locate my location"
      >
        <EnvironmentOutlined />
      </button>

      {/* ZOOM */}

      <button type="button" onClick={handleZoomIn} aria-label="Zoom in">
        +
      </button>

      <button type="button" onClick={handleZoomOut} aria-label="Zoom out">
        −
      </button>
    </div>
  );
}

function MapClickLocation({ onChange }) {
  const map = useMap();

  useEffect(() => {
    if (!onChange) {
      return;
    }

    const handleMapClick = (event) => {
      const { lat, lng } = event.latlng;

      onChange({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
      });
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, onChange]);

  return null;
}
