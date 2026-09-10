"use client";

import { useNotify } from "@/components/common/NotificationProvider";
import { toSmartTitleCase } from "@/lib/utils/char";
import {
  loadDictionary,
  loadDictionaryParent,
} from "@/services/auth/dictionaryService";
import { CalendarOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { useState, useEffect } from "react";

export const Classification = ({
  values,
  errors,
  setTouched,
  setFieldValue,
  touched,
  getError,
}) => {
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [subCategory, setSubCategory] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [venue, setVenue] = useState([]);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const notify = useNotify();

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

  return (
    <div className="sw-form-step">
      <div className="sw-form-step-header">
        <div className="sw-form-step-header-icon">
          <CalendarOutlined />
        </div>

        <div>
          <h3>Classification</h3>

          <p>Organize the event using the available categories and statuses.</p>
        </div>
      </div>

      {/* CATEGORY */}

      <div className="row">
        <div className="col-12">
          <div className="sw-form-field">
            <label>
              Category
              <span>*</span>
            </label>

            <Select
              value={values.category_id || undefined}
              placeholder="Select category"
              loading={loadingCategories}
              showSearch
              options={category?.map((item) => ({
                value: item.id,
                label: toSmartTitleCase(item.dictionary_item_name),
              }))}
              className={`sw-form-select ${
                getError("category_id") ? "sw-form-control-error" : ""
              }`}
              classNames={{
                popup: {
                  root: "sw-form-select-dropdown",
                },
              }}
              onChange={(value, option) => {
                setCategoryId(value);
                setFieldValue("category_id", value);
                setFieldValue("category_name", option?.label || "");
              }}
              onBlur={() =>
                setTouched({
                  ...touched,
                  category_id: true,
                })
              }
            />

            {getError("category_id") && (
              <span className="sw-form-error">{errors.category_id}</span>
            )}
          </div>
        </div>
      </div>

      {/* SUB CATEGORY */}

      <div className="row mt-3">
        <div className="col-12">
          <div className="sw-form-field">
            <label>
              Sub Category
              <span>*</span>
            </label>

            <Select
              value={values.sub_category_id || undefined}
              showSearch
              placeholder="Select sub-category"
              options={subCategory?.map((item) => ({
                value: item.id,
                label: toSmartTitleCase(item.dictionary_item_name),
              }))}
              loading={loadingSubCategories}
              className={`sw-form-select ${
                getError("sub_category_id") ? "sw-form-control-error" : ""
              }`}
              classNames={{
                popup: {
                  root: "sw-form-select-dropdown",
                },
              }}
              onChange={(value, option) => {
                setFieldValue("sub_category_id", value);
                setFieldValue("sub_category_name", option?.label || "");
              }}
              onBlur={() =>
                setTouched({
                  ...touched,
                  sub_category_id: true,
                })
              }
            />

            {getError("sub_category_id") && (
              <span className="sw-form-error">{errors.sub_category_id}</span>
            )}
          </div>
        </div>
      </div>

      {/* VENUE TYPE */}

      <div className="row mt-3">
        <div className="col-12">
          <div className="sw-form-field">
            <label>
              Venue Type
              <span>*</span>
            </label>

            <Select
              value={values.venue_type_id || undefined}
              placeholder="Select venue type"
              showSearch
              loading={loadingVenue}
              options={venue?.map((item) => ({
                value: item.id,
                label: toSmartTitleCase(item.dictionary_item_name),
              }))}
              className={`sw-form-select ${
                getError("venue_type_id") ? "sw-form-control-error" : ""
              }`}
              classNames={{
                popup: {
                  root: "sw-form-select-dropdown",
                },
              }}
              onChange={(value, option) => {
                setFieldValue("venue_type_id", value);
                setFieldValue("venue_type_name", option?.label || "");
              }}
              onBlur={() =>
                setTouched({
                  ...touched,
                  venue_type_id: true,
                })
              }
            />

            {getError("venue_type_id") && (
              <span className="sw-form-error">{errors.venue_type_id}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
