"use client";

import { EnvironmentOutlined } from "@ant-design/icons";
import { Input, DatePicker } from "antd";
import dayjs from "dayjs";

export const DateLocation = ({
  values,
  errors,
  setFieldValue,
  getError,
  handleChange,
  handleBlur,
}) => {
  return (
    <div className="sw-form-step">
      <div className="sw-form-step-header">
        <div className="sw-form-step-header-icon">
          <EnvironmentOutlined />
        </div>

        <div>
          <h3>Date & Location</h3>

          <p>Define when the event starts and where it will take place.</p>
        </div>
      </div>

      <div className="sw-form-fields">
        {/* START */}

        <div className="sw-form-field">
          <label>
            Start Date & Time
            <span>*</span>
          </label>

          <DatePicker
            showTime
            value={values.start_date ? dayjs(values.start_date) : null}
            format="DD MMM YYYY, HH:mm"
            placeholder="Select start date and time"
            className="sw-form-date"
            onChange={(value) => setFieldValue("start_date", value)}
          />

          {getError("start_date") && (
            <span className="sw-form-error">{errors.start_date}</span>
          )}
        </div>

        {/* END */}

        <div className="sw-form-field">
          <label>
            End Date & Time
            <span>*</span>
          </label>

          <DatePicker
            showTime
            value={values.end_date ? dayjs(values.end_date) : null}
            format="DD MMM YYYY, HH:mm"
            placeholder="Select end date and time"
            className="sw-form-date"
            onChange={(value) => setFieldValue("end_date", value)}
          />

          {getError("end_date") && (
            <span className="sw-form-error">{errors.end_date}</span>
          )}
        </div>

        {/* ADDRESS */}

        <div className="sw-form-field sw-form-field-full">
          <label>
            Venue Address
            <span>*</span>
          </label>

          <Input
            name="address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            prefix={<EnvironmentOutlined />}
            placeholder="e.g. Forodhani Gardens, Stone Town, Zanzibar"
            className={
              getError("address")
                ? "sw-form-control sw-form-control-error"
                : "sw-form-control"
            }
          />

          {getError("address") && (
            <span className="sw-form-error">{errors.address}</span>
          )}
        </div>

        {/* LATITUDE */}

        <div className="sw-form-field">
          <label>
            Latitude
            <span>*</span>
          </label>

          <Input
            name="latitude"
            value={values.latitude}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="-6.1659"
            className={
              getError("latitude")
                ? "sw-form-control sw-form-control-error"
                : "sw-form-control"
            }
          />

          {getError("latitude") && (
            <span className="sw-form-error">{errors.latitude}</span>
          )}
        </div>

        {/* LONGITUDE */}

        <div className="sw-form-field">
          <label>
            Longitude
            <span>*</span>
          </label>

          <Input
            name="longitude"
            value={values.longitude}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="39.2026"
            className={
              getError("longitude")
                ? "sw-form-control sw-form-control-error"
                : "sw-form-control"
            }
          />

          {getError("longitude") && (
            <span className="sw-form-error">{errors.longitude}</span>
          )}
        </div>
      </div>
    </div>
  );
};
