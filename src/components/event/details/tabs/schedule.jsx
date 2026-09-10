"use client";
import { useEffect, useState } from "react";
import { Button, DatePicker, Input, message } from "antd";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useLoading } from "@/components/common/LoadingProvider";
import {
  EditOutlined,
  SaveOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { ScheduleSkeleton } from "@/components/common/sekeleton/ScheduleSkeleton";
import { useNotify } from "@/components/common/NotificationProvider";
import {
  loadEventSchedule,
  patchEventSchedule,
} from "@/services/agent/eventService";
import moment from "moment";
import dayjs from "dayjs";

export const ScheduleTab = ({ dataId }) => {
  const [loadingData, setLoadingData] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(false);
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
        const response = await loadEventSchedule(dataId);

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

    const fields = ["start_date", "end_date"];

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

  const handleSaveSchedule = async () => {
    const payload = buildChangedPayload();

    // Nothing changed
    if (Object.keys(payload).length === 0) {
      notify.info("No Changes", "No changes to save.");
      setEditingSchedule(false);
      return;
    }

    // Validate schedule
    const startDate = moment(data?.start_date);
    const endDate = moment(data?.end_date);

    if (!startDate.isValid() || !endDate.isValid()) {
      notify.error(
        "Invalid Schedule",
        "Please provide valid start and end dates.",
      );
      return;
    }

    if (startDate.isAfter(endDate)) {
      notify.error(
        "Invalid Schedule",
        "Start date and time cannot be after the end date and time.",
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
            await patchEventSchedule(dataId, payload);
          }, "Updating event schedule...");

          setIndex((prev) => prev + 1);
          setOriginalData(data);

          setEditingSchedule(false);

          notify.success(
            "Event Schedule Updated Successfully",
            "The event schedule has been updated successfully.",
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
        <ScheduleSkeleton />
      ) : (
        <div className="sw-details-content">
          <section className="sw-details-card">
            <div className="sw-details-card-header">
              <div>
                <h2>Schedule</h2>
                <p>Date and time information</p>
              </div>

              {!editingSchedule ? (
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  className="sw-details-card-action"
                  onClick={() => setEditingSchedule(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="sw-details-edit-actions">
                  <Button
                    type="text"
                    className="sw-details-cancel-action"
                    onClick={() => setEditingSchedule(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    className="sw-details-save-action"
                    onClick={handleSaveSchedule}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="sw-details-card-body">
              {editingSchedule ? (
                <div className="sw-details-form-grid">
                  <div className="sw-details-form-field">
                    <label>Start Date</label>

                    <DatePicker
                      showTime
                      value={data?.start_date ? dayjs(data.start_date) : null}
                      format="DD MMM YYYY, HH:mm"
                      placeholder="Select start date and time"
                      className="sw-form-date"
                      onChange={(value) =>
                        setData({
                          ...data,
                          start_date: value ? value.toISOString() : null,
                        })
                      }
                    />
                  </div>

                  <div className="sw-details-form-field">
                    <label>End Date</label>

                    <DatePicker
                      showTime
                      value={data?.end_date ? dayjs(data.end_date) : null}
                      format="DD MMM YYYY, HH:mm"
                      placeholder="Select end date and time"
                      className="sw-form-date"
                      onChange={(value) =>
                        setData({
                          ...data,
                          end_date: value ? value.toISOString() : null,
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="sw-details-schedule">
                  <div className="sw-details-schedule-item">
                    <div className="sw-details-schedule-icon">
                      <CalendarOutlined />
                    </div>

                    <div>
                      <span>Start Date</span>
                      <strong>{moment(data?.start_date).format("LL")}</strong>
                      <small>{moment(data?.start_date).format("dddd")}</small>
                    </div>
                  </div>

                  <div className="sw-details-schedule-divider" />

                  <div className="sw-details-schedule-item">
                    <div className="sw-details-schedule-icon">
                      <ClockCircleOutlined />
                    </div>

                    <div>
                      <span>Start Time</span>
                      <strong>
                        {moment(data?.start_date).format("HH:mm")}
                      </strong>
                      <small>East Africa Time</small>
                    </div>
                  </div>

                  <div className="sw-details-schedule-divider" />

                  <div className="sw-details-schedule-item">
                    <div className="sw-details-schedule-icon">
                      <CalendarOutlined />
                    </div>

                    <div>
                      <span>End Date</span>
                      <strong>{moment(data?.end_date).format("LL")}</strong>
                      <small>{moment(data?.end_date).format("dddd")}</small>
                    </div>
                  </div>

                  <div className="sw-details-schedule-divider" />

                  <div className="sw-details-schedule-item">
                    <div className="sw-details-schedule-icon">
                      <ClockCircleOutlined />
                    </div>

                    <div>
                      <span>End Time</span>
                      <strong>{moment(data?.end_date).format("HH:mm")}</strong>
                      <small>East Africa Time</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};
