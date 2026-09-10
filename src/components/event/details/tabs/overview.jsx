"use client";
import {
  EnvironmentOutlined,
  StarFilled,
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  TagOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Tag, message } from "antd";
import { useState, useEffect } from "react";
import {
  loadEventFullDetails,
  patchEvent,
} from "@/services/agent/eventService";
import { useNotify } from "@/components/common/NotificationProvider";
import { OverviewSkeleton } from "@/components/common/sekeleton/OverviewSkeleton";
import { toSentenceCase, toSmartTitleCase } from "@/lib/utils/char";
import moment from "moment";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useLoading } from "@/components/common/LoadingProvider";
import {
  loadDictionary,
  loadDictionaryParent,
} from "@/services/auth/dictionaryService";
const { TextArea } = Input;

const categoryOptions = [
  { label: "Music", value: 1 },
  { label: "Cultural", value: 2 },
  { label: "Sports", value: 3 },
  { label: "Festival", value: 4 },
];

const subCategoryOptions = [
  { label: "Live Music", value: 1 },
  { label: "Traditional", value: 2 },
  { label: "Outdoor", value: 3 },
];

const venueTypeOptions = [
  { label: "Indoor", value: 1 },
  { label: "Outdoor", value: 2 },
  { label: "Mixed", value: 3 },
];

const statusOptions = [
  { value: 1, label: "Draft" },
  { value: 2, label: "Published" },
  { value: 3, label: "Postponed" },
  { value: 4, label: "Blocked" },
];

export const OverviewTab = ({ dataId }) => {
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [subCategory, setSubCategory] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [venue, setVenue] = useState([]);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [status, setStatus] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editingOverview, setEditingOverview] = useState(false);
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [index, setIndex] = useState(0);
  const notify = useNotify();
  const confirm = useConfirm();
  const loading = useLoading();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const resp = await loadDictionary(4);
        setCategory(resp?.results);
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
        notify.error("failed to load categories", errorMessage);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!categoryId) return;
      setLoadingSubCategories(true);
      try {
        const resp = await loadDictionaryParent(12, categoryId);
        setSubCategory(resp?.results);
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
        notify.error("failed to load sub-categories", errorMessage);
      } finally {
        setLoadingSubCategories(false);
      }
    };
    fetchSubCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchVenue = async () => {
      setLoadingVenue(true);
      try {
        const resp = await loadDictionary(7);
        setVenue(resp?.results);
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
        notify.error("failed to load venues", errorMessage);
      } finally {
        setLoadingVenue(false);
      }
    };
    fetchVenue();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoadingStatus(true);
      try {
        const resp = await loadDictionary(5);
        setStatus(resp?.results);
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
        notify.error("failed to load status", errorMessage);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    if (!dataId) return;

    const fetchData = async () => {
      setLoadingData(true);

      try {
        const response = await loadEventFullDetails(dataId);

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

    const fields = [
      "title",
      "short_description",
      "description",
      "category_id",
      "category_name",
      "sub_category_id",
      "sub_category_name",
      "venue_type_id",
      "venue_type_name",
      "status_id",
      "status_name",
    ];

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

  const handleSaveOverview = async () => {
    const payload = buildChangedPayload();

    // Nothing changed
    if (Object.keys(payload).length === 0) {
      notify.info("No Changes", "No changes to save.");
      setEditingOverview(false);
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
            await patchEvent(dataId, payload);
          }, "Updating event...");

          setIndex((prev) => prev + 1);
          setOriginalData(data);

          setEditingOverview(false);

          notify.success(
            "Event Updated Successfully",
            "The event has been updated successfully.",
          );
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
          notify.error("Failed to Update Event", errorMessage);
        }
      },
    });
  };

  return (
    <>
      {loadingData || !data ? (
        <OverviewSkeleton />
      ) : (
        <div className="sw-details-content">
          <div className="sw-details-columns">
            {/* MAIN */}
            <div className="sw-details-main-column">
              {/* BASIC INFORMATION */}
              <section className="sw-details-card">
                <div className="sw-details-card-header">
                  <div>
                    <h2>Basic Information</h2>
                    <p>General information about this listing</p>
                  </div>

                  {!editingOverview ? (
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      className="sw-details-card-action"
                      onClick={() => setEditingOverview(true)}
                    >
                      Edit
                    </Button>
                  ) : (
                    <div className="sw-details-edit-actions">
                      <Button
                        type="text"
                        className="sw-details-cancel-action"
                        onClick={() => setEditingOverview(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        className="sw-details-save-action"
                        onClick={handleSaveOverview}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                <div className="sw-details-card-body">
                  {editingOverview ? (
                    <div className="sw-details-form-grid">
                      {/* TITLE */}
                      <div className="sw-details-form-field sw-details-form-field-full">
                        <label>Title</label>

                        <Input
                          value={data?.title}
                          onChange={(e) =>
                            setData({
                              ...data,
                              title: e.target.value,
                            })
                          }
                          className="sw-form-control-edit sw-form-control"
                        />
                      </div>

                      {/* SHORT DESCRIPTION */}
                      <div className="sw-details-form-field sw-details-form-field-full">
                        <label>Short Description</label>

                        <TextArea
                          rows={3}
                          value={data?.short_description}
                          onChange={(e) =>
                            setData({
                              ...data,
                              short_description: e.target.value,
                            })
                          }
                          className="sw-form-control-textarea-edit"
                          maxLength={100}
                        />
                      </div>

                      {/* DESCRIPTION */}
                      <div className="sw-details-form-field sw-details-form-field-full">
                        <label>Description</label>

                        <TextArea
                          rows={7}
                          value={data?.description}
                          onChange={(e) =>
                            setData({
                              ...data,
                              description: e.target.value,
                            })
                          }
                          className="sw-form-control-textarea-edit"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="sw-details-section-title">
                        {toSmartTitleCase(data?.title)}
                      </h3>

                      <p className="sw-details-description">
                        {toSentenceCase(data?.short_description)}
                      </p>

                      <p className="sw-details-description">
                        {toSentenceCase(data?.description)}
                      </p>
                    </>
                  )}
                </div>
              </section>

              {/* ADDITIONAL INFORMATION */}
              {!editingOverview && (
                <section className="sw-details-card">
                  <div className="sw-details-card-header">
                    <div>
                      <h2>Additional Information</h2>
                      <p>More information about this listing</p>
                    </div>
                  </div>

                  <div className="sw-details-card-body">
                    {editingOverview ? null : (
                      <div className="sw-details-information-grid">
                        <div className="sw-details-information-item">
                          <span>Created By</span>
                          <strong>
                            <UserOutlined />
                            {toSmartTitleCase(data?.creator)}
                          </strong>
                        </div>

                        <div className="sw-details-information-item">
                          <span>Created Date</span>

                          <strong>
                            {moment(data?.created).format("DD MMM YYYY")}
                          </strong>
                        </div>

                        <div className="sw-details-information-item">
                          <span>Last Updated</span>

                          <strong>
                            {moment(data?.updated).format("DD MMM YYYY")}
                          </strong>
                        </div>

                        <div className="sw-details-information-item">
                          <span>Views</span>

                          <strong>1,284</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
            {/* SIDE */}
            <aside className="sw-details-side-column">
              {editingOverview ? (
                <div className="sw-details-form-grid">
                  <div className="sw-details-form-field">
                    <label>Category</label>
                    <Select
                      value={data?.category_id || undefined}
                      loading={loadingCategories}
                      showSearch
                      options={category?.map((item) => ({
                        value: item.id,
                        label: toSmartTitleCase(item.dictionary_item_name),
                      }))}
                      placeholder="Select category"
                      className="sw-form-select sw-form-select-edit"
                      onChange={(value, option) => {
                        setCategoryId(value);
                        setData({
                          ...data,
                          category_id: value,
                          category_name: option?.label || "",
                        });
                      }}
                    />
                  </div>

                  <div className="sw-details-form-field">
                    <label>Sub-category</label>
                    <Select
                      value={data?.sub_category_id || undefined}
                      showSearch
                      loading={loadingSubCategories}
                      options={subCategory?.map((item) => ({
                        value: item.id,
                        label: toSmartTitleCase(item.dictionary_item_name),
                      }))}
                      placeholder="Select sub-category"
                      className="sw-form-select sw-form-select-edit"
                      onChange={(value, option) => {
                        setData({
                          ...data,
                          sub_category_id: value,
                          sub_category_name: option?.label || "",
                        });
                      }}
                    />
                  </div>
                  <div className="sw-details-form-field">
                    <label>Venue Type</label>
                    <Select
                      value={data?.venue_type_id || undefined}
                      showSearch
                      loading={loadingVenue}
                      options={venue?.map((item) => ({
                        value: item.id,
                        label: toSmartTitleCase(item.dictionary_item_name),
                      }))}
                      placeholder="Select venue type"
                      className="sw-form-select sw-form-select-edit"
                      onChange={(value, option) => {
                        setData({
                          ...data,
                          venue_type_id: value,
                          venue_type_name: option?.label || "",
                        });
                      }}
                    />
                  </div>
                  {/* STATUS */}
                  <div className="sw-details-form-field">
                    <label>Status</label>
                    <Select
                      value={data?.status_id || undefined}
                      options={status?.map((item) => ({
                        value: item.id,
                        label: toSmartTitleCase(item.dictionary_item_name),
                      }))}
                      loading={loadingStatus}
                      showSearch
                      placeholder="Select status"
                      className="sw-form-select sw-form-select-edit"
                      onChange={(value, option) => {
                        setData({
                          ...data,
                          status_id: value,
                          status_name: option?.label || "",
                        });
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <section className="sw-details-card">
                    <div className="sw-details-card-header">
                      <div>
                        <h2>Quick Information</h2>
                        <p>Key details</p>
                      </div>
                    </div>

                    <div className="sw-details-info-list">
                      <div className="sw-details-info-row">
                        <div className="sw-details-info-label">
                          <TagOutlined />
                          Category
                        </div>

                        <span className="sw-details-info-value">
                          {toSmartTitleCase(data?.category_name)}
                        </span>
                      </div>

                      <div className="sw-details-info-row">
                        <div className="sw-details-info-label">
                          <TagOutlined />
                          Sub-category
                        </div>

                        <span className="sw-details-info-value">
                          {toSmartTitleCase(data?.sub_category_name)}
                        </span>
                      </div>

                      <div className="sw-details-info-row">
                        <div className="sw-details-info-label">
                          <EnvironmentOutlined />
                          Venue
                        </div>

                        <span className="sw-details-info-value">
                          {toSmartTitleCase(data?.venue_type_name)}
                        </span>
                      </div>

                      <div className="sw-details-info-row">
                        <div className="sw-details-info-label">
                          <SyncOutlined />
                          Status
                        </div>

                        <Tag
                          color={
                            {
                              draft: "default",
                              published: "success",
                              postponed: "warning",
                              blocked: "error",
                            }[data?.status_name?.toLowerCase()] || "default"
                          }
                          className="sw-details-status-tag"
                        >
                          {toSmartTitleCase(data?.status_name)}
                        </Tag>
                      </div>

                      <div className="sw-details-info-row">
                        <div className="sw-details-info-label">
                          <StarFilled />
                          Rating
                        </div>

                        <span className="sw-details-rating">
                          <StarFilled />
                          <strong>4.8</strong>
                          <small>(124 reviews)</small>
                        </span>
                      </div>
                    </div>
                  </section>
                  <section className="sw-details-card">
                    <div className="sw-details-card-header">
                      <div>
                        <h2>Location</h2>
                        <p>Current location</p>
                      </div>
                    </div>

                    <div className="sw-details-location-preview">
                      <div className="sw-details-location-icon">
                        <EnvironmentOutlined />
                      </div>

                      <div>
                        <strong>
                          {toSmartTitleCase(data?.address)}, Tanzania
                        </strong>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </aside>
          </div>
        </div>
      )}
    </>
  );
};
