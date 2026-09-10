"use client";

import { toSentenceCase, toSmartTitleCase } from "@/lib/utils/char";
import { FileTextOutlined } from "@ant-design/icons";
import { Input } from "antd";

const { TextArea } = Input;

export const BasicInformation = ({
  values,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
  getError,
}) => {
  return (
    <div className="sw-form-step">
      <div className="sw-form-step-header">
        <div className="sw-form-step-header-icon">
          <FileTextOutlined />
        </div>

        <div>
          <h3>Basic Information</h3>

          <p>Start by providing the main information about the event.</p>
        </div>
      </div>

      <div className="sw-form-fields">
        {/* TITLE */}
        <div className="sw-form-field sw-form-field-full">
          <label>
            Event Title
            <span>*</span>
          </label>

          <Input
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={(e) => {
              handleBlur(e);
              setFieldValue("title", toSmartTitleCase(values.title));
            }}
            placeholder="Event clear and memorable title"
            className={
              getError("title")
                ? "sw-form-control sw-form-control-error"
                : "sw-form-control"
            }
            maxLength={50}
          />

          <div className="sw-form-field-footer">
            {getError("title") ? (
              <span className="sw-form-error">{errors.title}</span>
            ) : (
              <span>Give your event a clear and memorable title.</span>
            )}

            <small>{values.title.length}/50</small>
          </div>
        </div>

        {/* SHORT DESCRIPTION */}
        <div className="sw-form-field sw-form-field-full">
          <label>
            Short Description
            <span>*</span>
          </label>

          <TextArea
            name="short_description"
            value={values.short_description}
            onChange={handleChange}
            onBlur={(e) => {
              handleBlur(e);
              setFieldValue(
                "short_description",
                toSentenceCase(values.short_description),
              );
            }}
            placeholder="Briefly describe what this event is about"
            className={
              getError("short_description")
                ? "sw-form-control sw-form-control-error sw-form-control-textarea"
                : "sw-form-control sw-form-control-textarea"
            }
            maxLength={100}
            rows={2}
          />

          <div className="sw-form-field-footer">
            {getError("short_description") ? (
              <span className="sw-form-error">{errors.short_description}</span>
            ) : (
              <span>A short summary shown in listings and previews.</span>
            )}

            <small>{values.short_description.length}/100</small>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="sw-form-field sw-form-field-full">
          <label>
            Description
            <span>*</span>
          </label>

          <TextArea
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={(e) => {
              handleBlur(e);
              setFieldValue("description", toSentenceCase(values.description));
            }}
            placeholder="Provide detailed information about the event"
            className={
              getError("description")
                ? "sw-form-control sw-form-control-error sw-form-control-textarea"
                : "sw-form-control sw-form-control-textarea"
            }
            rows={7}
          />

          {getError("description") && (
            <span className="sw-form-error">{errors.description}</span>
          )}
        </div>
      </div>
    </div>
  );
};
