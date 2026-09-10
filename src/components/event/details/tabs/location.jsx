"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import {
  loadEventLocation,
  patchEventLocation,
} from "@/services/agent/eventService";

import { Button, Input } from "antd";

import { useNotify } from "@/components/common/NotificationProvider";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useLoading } from "@/components/common/LoadingProvider";

import { LocationSkeleton } from "@/components/common/sekeleton/LocationSkeleton";

import {
  EditOutlined,
  EnvironmentOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import { toSmartTitleCase } from "@/lib/utils/char";


const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => <LocationSkeleton />,
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
        } else if (
          responseData &&
          typeof responseData === "object"
        ) {
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
  }, [dataId, index, notify]);

  const buildChangedPayload = () => {
    if (!data || !originalData) {
      return {};
    }

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

    const latitude = Number(data?.latitude);
    const longitude = Number(data?.longitude);

    // Validate coordinates
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      notify.error(
        "Invalid Location",
        "Please provide valid latitude and longitude.",
      );
      return;
    }

    if (latitude < -90 || latitude > 90) {
      notify.error(
        "Invalid Latitude",
        "Latitude must be between -90 and 90.",
      );
      return;
    }

    if (longitude < -180 || longitude > 180) {
      notify.error(
        "Invalid Longitude",
        "Longitude must be between -180 and 180.",
      );
      return;
    }

    // Tanzania bounding validation
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
        "Are you sure you want to update this event with the information provided.",
      type: "success",
      okText: "Yes, Update",
      cancelText: "No, Cancel",

      onOk: async () => {
        try {
          await loading.run(async () => {
            await patchEventLocation(dataId, payload);
          }, "Updating event location...");

          setIndex((prev) => prev + 1);

          setOriginalData({
            ...data,
            latitude,
            longitude,
          });

          setEditingLocation(false);

          notify.success(
            "Event Location Updated Successfully",
            "The event location has been updated successfully.",
          );
        } catch (error) {
          const responseData = error?.response?.data;

          let errorMessage =
            "Something went wrong while updating the event location.";

          if (typeof responseData === "string") {
            errorMessage = responseData;
          } else if (responseData?.error) {
            errorMessage = responseData.error;
          } else if (responseData?.detail) {
            errorMessage = responseData.detail;
          } else if (responseData?.message) {
            errorMessage = responseData.message;
          } else if (
            responseData &&
            typeof responseData === "object"
          ) {
            const firstKey = Object.keys(responseData)[0];
            const firstError = responseData[firstKey];

            if (Array.isArray(firstError)) {
              errorMessage = `${firstError[0]}`;
            }
          }

          notify.error(
            "Failed to Update Location",
            errorMessage,
          );
        }
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingLocation(false);
    setIndex((prev) => prev + 1);
  };

  return (
    <>
      {loadingData ? (
        <LocationSkeleton />
      ) : (
        <div className="sw-details-content">
          <section className="sw-details-card">
            {/* HEADER */}
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
                    onClick={handleCancelEdit}
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

            {/* LOCATION CONTENT */}
            <div className="sw-details-location-page">
              {data ? (
                <div className="sw-details-map">
                  {editingLocation && (
                    <div className="sw-details-map-hint">
                      <EnvironmentOutlined />
                      <span>
                        Drag the marker to update the location
                      </span>
                    </div>
                  )}

                  <LocationMap
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
                </div>
              ) : (
                <div className="sw-details-map-placeholder">
                  <EnvironmentOutlined />
                  <span>Map location</span>
                </div>
              )}

              {/* LOCATION DETAILS */}
              <div className="sw-details-location-details">
                {/* ADDRESS */}
                <div>
                  <span>Address</span>

                  {editingLocation ? (
                    <Input
                      value={data?.address ?? ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="sw-form-control-edit sw-form-control"
                    />
                  ) : (
                    <strong>
                      {toSmartTitleCase(data?.address)}
                    </strong>
                  )}
                </div>

                {/* LATITUDE */}
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

                {/* LONGITUDE */}
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
