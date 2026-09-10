"use client";

import {
  EnvironmentOutlined,
  PictureOutlined,
  UploadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  Switch,
  message,
} from "antd";
import dayjs from "dayjs";

const categoryOptions = [
  { label: "Music", value: 1 },
  { label: "Cultural", value: 2 },
  { label: "Sports", value: 3 },
  { label: "Festival", value: 4 },
];

export const MediaOptions = ({
  values,
  errors,
  setFieldValue,
  getError,
  getBase64,
}) => {
  return (
    <div className="sw-form-step">
      <div className="sw-form-step-header">
        <div className="sw-form-step-header-icon">
          <PictureOutlined />
        </div>

        <div>
          <h3>Media & Options</h3>

          <p>Add an image and choose how the event should be presented.</p>
        </div>
      </div>

      <div className="sw-form-media-layout">
        {/* IMAGE */}

        <div
          className={`sw-form-upload-card ${
            getError("image_base64") ? "sw-form-upload-card-error" : ""
          }`}
        >
          <div className="sw-form-upload-icon">
            <PictureOutlined />
          </div>

          <div className="sw-form-upload-content">
            <h4>
              Cover Image
              <span className="sw-form-required">*</span>
            </h4>

            <p>Upload a representative image for this listing.</p>

            <Upload
              accept="image/jpeg,image/png,image/webp"
              maxCount={1}
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
              beforeUpload={async (file) => {
                const maxSize = 1024 * 1024;

                if (file.size > maxSize) {
                  message.error("Image must not be more than 1 MB.");
                  return Upload.LIST_IGNORE;
                }

                try {
                  const base64 = await getBase64(file);

                  setFieldValue("image_base64", base64);
                  setFieldValue("image_name", file.name);
                  setFieldValue("image_size", file.size);
                } catch {
                  message.error("Failed to process image.");
                }

                return false;
              }}
              onRemove={() => {
                setFieldValue("image_base64", "");
                setFieldValue("image_name", "");
                setFieldValue("image_size", 0);
              }}
            >
              <Button
                icon={<UploadOutlined />}
                className="sw-form-upload-button"
              >
                Choose Image
              </Button>
            </Upload>

            {getError("image_base64") && (
              <span className="sw-form-error">{errors.image_base64}</span>
            )}

            {getError("image_size") && !getError("image_base64") && (
              <span className="sw-form-error">{errors.image_size}</span>
            )}

            <span className="sw-form-help">
              JPG, PNG or WebP. Maximum file size: 1 MB.
            </span>
          </div>
        </div>

        {/* FEATURED */}

        <div className="sw-form-option-card">
          <div className="sw-form-option-icon">★</div>

          <div className="sw-form-option-content">
            <div>
              <h4>Featured Listing</h4>

              <p>Highlight this listing in featured areas of the platform.</p>
            </div>

            <Switch
              checked={values.is_featured}
              onChange={(checked) => setFieldValue("is_featured", checked)}
            />
          </div>
        </div>

        {/* SUMMARY */}

        <div className="sw-form-summary-card">
          <div className="sw-form-summary-header">
            <CheckCircleOutlined />

            <div>
              <h4>Ready to create</h4>

              <p>
                {` Review the information
                              you've entered before
                              creating the listing.`}
              </p>
            </div>
          </div>

          <div className="sw-form-summary-grid">
            <div>
              <span>Title</span>
              <strong>{values.title || "Not provided"}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>
                {categoryOptions.find(
                  (item) => item.value === values.category_id,
                )?.label || "Not selected"}
              </strong>
            </div>

            <div>
              <span>Start</span>
              <strong>
                {values.start_date
                  ? dayjs(values.start_date).format("DD MMM YYYY, HH:mm")
                  : "Not selected"}
              </strong>
            </div>

            <div>
              <span>Venue</span>
              <strong>{values.address || "Not provided"}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
