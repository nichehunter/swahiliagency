"use client";
import { useEffect, useRef, useState } from "react";
import {
  loadEventLocation,
  patchEventLocation,
} from "@/services/agent/eventService";
import { Button, Input, message } from "antd";
import { useNotify } from "@/components/common/NotificationProvider";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useLoading } from "@/components/common/LoadingProvider";
import { LocationSkeleton } from "@/components/common/sekeleton/LocationSkeleton";
import {
  EditOutlined,
  EnvironmentOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { toSmartTitleCase } from "@/lib/utils/char";

const locationIcon = L.divIcon({
  className: "sw-details-location-marker",
  html: `
    <div class="sw-details-location-marker-wrapper">

      <!-- Pulse / wave -->
      <div class="sw-details-location-pulse"></div>

      <!-- Marker -->
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

export const LocationTab = ({ dataId }) => {
  const [loadingData, setLoadingData] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [index, setIndex] = useState(0);
  const notify = useNotify();
  const confirm = useConfirm();
  const loading = useLoading();

  useEffect(() => {
    if (!dataId) return;

    const fetchData = async () => {
      setLoadingData(true);

      try {
        const response = await loadEventLocation(dataId);

        setData(response);
        setOriginalData(response);
      } catch (error) {
        const responseData = error?.response?.data;
        let errorMessage = "Something went wrong. Please try again.";

        if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (responseData?.detail) {
          errorMessage = responseData.detail;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === "object") {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];
          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }
        notify.error("Failed to Load Event", errorMessage);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [dataId, index]);

  const buildChangedPayload = () => {
    if (!data || !originalData) return {};

    const fields = ["address", "latitude", "longitude"];

    const payload = {};

    fields.forEach((field) => {
      const currentValue = data[field];
      const originalValue = originalData[field];

      if (currentValue !== originalValue) {
        payload[field] = currentValue;
      }
    });

    return payload;
  };

  const handleSaveLocation = async () => {
    const payload = buildChangedPayload();

    // Nothing changed
    if (Object.keys(payload).length === 0) {
      notify.info("No Changes", "No changes to save.");
      setEditingLocation(false);
      return;
    }

    // Validate location
    const latitude = data?.latitude;
    const longitude = data?.longitude;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      notify.error(
        "Invalid Location",
        "Please provide valid latitude and longitude.",
      );
      return;
    }

    if (latitude < -90 || latitude > 90) {
      notify.error("Invalid Latitude", "Latitude must be between -90 and 90.");
      return;
    }

    if (longitude < -180 || longitude > 180) {
      notify.error(
        "Invalid Longitude",
        "Longitude must be between -180 and 180.",
      );
      return;
    }

    if (
      latitude < -11.75 ||
      latitude > -0.99 ||
      longitude < 29.33 ||
      longitude > 40.45
    ) {
      notify.error(
        "Location Outside Tanzania",
        "The selected location is outside Tanzania. Please select a point within Tanzania.",
      );
      return;
    }

    confirm({
      title: "Update Event?",
      content:
        "Are you sure you want to update this event with the information provided?",
      type: "success",
      okText: "Yes, Update",
      cancelText: "No, Cancel",

      onOk: async () => {
        try {
          await loading.run(async () => {
            await patchEventLocation(dataId, payload);
          }, "Updating event location...");

          setIndex((prev) => prev + 1);
          setOriginalData(data);

          setEditingLocation(false);

          notify.success(
            "Event Location Updated Successfully",
            "The event location has been updated successfully.",
          );
        } catch (error) {
          // your existing error handling...
        }
      },
    });
  };
  return (
    <>
      {loadingData ? (
        <LocationSkeleton />
      ) : (
        <div className="sw-details-content">
          <section className="sw-details-card">
            <div className="sw-details-card-header">
              <div>
                <h2>Location</h2>
                <p>Address and geographical information</p>
              </div>

              {!editingLocation ? (
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  className="sw-details-card-action"
                  onClick={() => setEditingLocation(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="sw-details-edit-actions">
                  <Button
                    type="text"
                    className="sw-details-cancel-action"
                    onClick={() => {
                      setEditingLocation(false);
                      setIndex((prev) => prev + 1);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    className="sw-details-save-action"
                    onClick={handleSaveLocation}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="sw-details-location-page">
              {data ? (
                <div className="sw-details-map">
                  {editingLocation && (
                    <div className="sw-details-map-hint">
                      <EnvironmentOutlined />
                      Drag the marker to update the location
                    </div>
                  )}
                  <MapContainer
                    center={[Number(data?.latitude), Number(data?.longitude)]}
                    zoom={15}
                    scrollWheelZoom={false}
                    dragging={editingLocation}
                    doubleClickZoom={false}
                    touchZoom={editingLocation}
                    zoomControl={false}
                    attributionControl={false}
                    className="sw-details-map-container"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <DraggableLocationMarker
                      latitude={Number(data?.latitude)}
                      longitude={Number(data?.longitude)}
                      editing={editingLocation}
                      onChange={({ latitude, longitude }) => {
                        setData((prev) => ({
                          ...prev,
                          latitude,
                          longitude,
                        }));
                      }}
                    />

                    <MapLocationUpdater
                      latitude={Number(data?.latitude)}
                      longitude={Number(data?.longitude)}
                    />

                    <MapResizeHandler />

                    <CustomZoomControl />
                  </MapContainer>
                </div>
              ) : (
                <div className="sw-details-map-placeholder">
                  <EnvironmentOutlined />
                  <span>Map location</span>
                </div>
              )}

              <div className="sw-details-location-details">
                <div>
                  <span>Address</span>

                  {editingLocation ? (
                    <Input
                      value={data?.address}
                      onChange={(e) =>
                        setData({
                          ...data,
                          address: e.target.value,
                        })
                      }
                      className="sw-form-control-edit sw-form-control"
                    />
                  ) : (
                    <strong>{toSmartTitleCase(data?.address)}</strong>
                  )}
                </div>

                <div>
                  <span>Latitude</span>

                  {editingLocation ? (
                    <Input
                      value={data?.latitude ?? ""}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }));
                      }}
                      className="sw-form-control-edit sw-form-control"
                    />
                  ) : (
                    <strong>{data?.latitude}</strong>
                  )}
                </div>

                <div>
                  <span>Longitude</span>

                  {editingLocation ? (
                    <Input
                      value={data?.longitude ?? ""}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }));
                      }}
                      className="sw-form-control-edit sw-form-control"
                    />
                  ) : (
                    <strong>{data?.longitude}</strong>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

function MapResizeHandler() {
  const map = require("react-leaflet").useMap();

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

function DraggableLocationMarker({ latitude, longitude, editing, onChange }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;

      if (!marker) return;

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

const CustomZoomControl = () => {
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
};
