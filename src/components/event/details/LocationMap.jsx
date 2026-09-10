"use client";

import { useEffect, useRef } from "react";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

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

export default function LocationMap({
  latitude,
  longitude,
  editing,
  onChange,
}) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      dragging={editing}
      doubleClickZoom={false}
      touchZoom={editing}
      zoomControl={false}
      attributionControl={false}
      className="sw-details-map-container"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <DraggableLocationMarker
        latitude={latitude}
        longitude={longitude}
        editing={editing}
        onChange={onChange}
      />

      <MapLocationUpdater latitude={latitude} longitude={longitude} />

      <MapResizeHandler />

      <CustomZoomControl />
    </MapContainer>
  );
}

/* ==========================================
   DRAGGABLE LOCATION MARKER
========================================== */

function DraggableLocationMarker({ latitude, longitude, editing, onChange }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;

      if (!marker) {
        return;
      }

      const position = marker.getLatLng();

      onChange({
        latitude: Number(position.lat.toFixed(6)),
        longitude: Number(position.lng.toFixed(6)),
      });
    },
  };

  return (
    <Marker
      ref={markerRef}
      position={[latitude, longitude]}
      icon={locationIcon}
      draggable={editing}
      eventHandlers={eventHandlers}
    />
  );
}

/* ==========================================
   KEEP MAP CENTERED WITH CURRENT COORDINATES
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

function CustomZoomControl() {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="sw-details-map-zoom-control">
      <button type="button" onClick={handleZoomIn} aria-label="Zoom in">
        +
      </button>

      <button type="button" onClick={handleZoomOut} aria-label="Zoom out">
        −
      </button>
    </div>
  );
}
