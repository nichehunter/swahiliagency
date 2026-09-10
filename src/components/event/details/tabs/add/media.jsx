"use client";

import { useState } from "react";
import {
  PictureOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Modal, Upload, Button, message, Image } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useLoading } from "@/components/common/LoadingProvider";
import { useNotify } from "@/components/common/NotificationProvider";
import { createEventMedia } from "@/services/agent/eventService";

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

const validationSchema = Yup.object({
  image_base64: Yup.string().trim().required("Please upload an image."),

  image_name: Yup.string().required("Please upload an image."),

  image_size: Yup.number()
    .required()
    .max(MAX_FILE_SIZE, "Image must not be more than 1 MB."),
});

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result;

      const base64 = String(result).split(",")[1];

      resolve(base64);
    };

    reader.onerror = (error) => reject(error);
  });

export const EventMediaAdd = ({ open, onClose, setIndex, dataId }) => {
  const [submitting, setSubmitting] = useState(false);
  const confirm = useConfirm();
  const loading = useLoading();
  const notify = useNotify();

  const formik = useFormik({
    initialValues: {
      image_base64: "",
      image_name: "",
      image_preview: "",
      image_size: 0,
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      confirm({
        title: "Upload Event Image?",
        content:
          "Are you sure you want to upload this event image with the information provided?",
        type: "success",
        okText: "Yes, Upload",
        cancelText: "No, Cancel",

        onOk: async () => {
          try {
            await loading.run(async () => {
              const payload = {
                image_base64: values.image_base64,
                image_name: values.image_name,
              };

              await createEventMedia(dataId, payload);
            }, "Uploading event image...");

            onClose();
            setIndex((prev) => prev + 1);
            setSubmitting(false);
            resetForm();

            notify.success(
              "Event Image Uploaded Successfully",
              "The event image has been uploaded successfully.",
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
            notify.error("Failed to Upload Event Image", errorMessage);
          } finally {
            setSubmitting(false);
          }
        },
      });
    },
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    resetForm,
  } = formik;

  const handleBeforeUpload = async (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      message.error("Only JPG, JPEG, or PNG images are allowed.");
      return Upload.LIST_IGNORE;
    }

    if (file.size > MAX_FILE_SIZE) {
      message.error("Image must not be more than 1 MB.");
      return Upload.LIST_IGNORE;
    }

    try {
      const base64 = await getBase64(file);

      const previewUrl = URL.createObjectURL(file);

      const imageName = file.name.replace(/\.[^/.]+$/, "");

      setFieldValue("image_base64", base64, false);
      setFieldValue("image_name", imageName, false);
      setFieldValue("image_preview", previewUrl, false);
      setFieldValue("image_size", file.size, false);

      setFieldTouched("image_base64", true, false);
      setFieldTouched("image_name", true, false);
      setFieldTouched("image_preview", true, false);
      setFieldTouched("image_size", true, false);

      return false;
    } catch (error) {
      console.error(error);

      message.error("Failed to process image.");

      return Upload.LIST_IGNORE;
    }
  };

  const handleRemove = () => {
    setFieldValue("image_base64", "");
    setFieldValue("image_name", "");
    setFieldValue("image_preview", "");
    setFieldValue("image_size", 0);

    setFieldTouched("image_base64", true, false);
  };

  const handleClose = () => {
    if (submitting) return;

    resetForm();
    onClose();
  };

  const uploadError =
    (touched.image_base64 && errors.image_base64) ||
    (touched.image_name && errors.image_name) ||
    (touched.image_size && errors.image_size);

  return (
    <Modal
      open={open}
      title={
        <div className="sw-form-modal-title">
          <div className="sw-form-step-header-icon">
            <PictureOutlined />
          </div>

          <div>
            <h3>Event Media</h3>
            <p>Upload a cover image for this event.</p>
          </div>
        </div>
      }
      centered
      width={650}
      destroyOnHidden
      mask={{
        closable: !submitting,
      }}
      closable={!submitting}
      onCancel={handleClose}
      footer={null}
      className="sw-form-media-modal"
    >
      <form onSubmit={handleSubmit}>
        <div className="sw-form-step">
          <div className="sw-form-media-layout">
            <div
              className={`sw-form-upload-card ${
                uploadError ? "sw-form-upload-card-error" : ""
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

                <p>Upload a representative image for this event.</p>

                {values.image_preview ? (
                  <div className="sw-form-image-preview">
                    <Image
                      src={values.image_preview}
                      alt={values.image_name || "Event image"}
                      preview
                    />

                    <div className="sw-form-image-preview-info">
                      <div className="sw-form-image-name">
                        {values.image_name}
                      </div>

                      <div className="sw-form-image-size">
                        {(values.image_size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>

                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={handleRemove}
                      disabled={submitting}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Upload
                    accept=".jpg,.jpeg,.png"
                    maxCount={1}
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={handleBeforeUpload}
                    disabled={submitting}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      className="sw-form-upload-button"
                    >
                      Choose Image
                    </Button>
                  </Upload>
                )}

                {/* ERROR */}
                {uploadError && (
                  <span className="sw-form-error">{uploadError}</span>
                )}

                <span className="sw-form-help">
                  JPG, JPEG, or PNG. Maximum file size: 1 MB.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="sw-form-modal-footer">
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            icon={<PictureOutlined />}
          >
            Upload Image
          </Button>
        </div>
      </form>
    </Modal>
  );
};
