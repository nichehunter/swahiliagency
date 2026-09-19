"use client";
import { createEvent } from "@/services/agent/eventService";

import { useState } from "react";
import { Modal, message } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import AppButton from "@/components/common/AppButton";

import { Button, DatePicker, Input, Select, Steps, Switch, Upload } from "antd";

import { Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import {
  BasicInformation,
  Classification,
  DateLocation,
  MediaOptions,
} from "./steps";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useLoading } from "@/components/common/LoadingProvider";
import { useNotify } from "@/components/common/NotificationProvider";
import { useAuthStore } from "@/stores/authStore";

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("This field is required")
    .max(50, "Title must not exceed 50 characters"),

  short_description: Yup.string()
    .trim()
    .required("This field is required")
    .max(100, "Short description must not exceed 100 characters"),

  description: Yup.string().trim().required("This field is required"),

  address: Yup.string()
    .trim()
    .required("This field is required")
    .matches(
      /^[^,\s][^,]*\s*,\s*[^,\s][^,]*$/,
      "Enter location as Place, City",
    ),

  category_id: Yup.number()
    .required("This field is required")
    .moreThan(0, "This field is required"),

  sub_category_id: Yup.number()
    .required("This field is required")
    .moreThan(0, "This field is required"),

  venue_type_id: Yup.number()
    .required("This field is required")
    .moreThan(0, "This field is required"),

  start_date: Yup.mixed()
    .required("Start date and time are required")
    .test("start-not-expired", "Start date cannot be in the past", (value) => {
      if (!value) return true;

      return !dayjs(value).startOf("day").isBefore(dayjs().startOf("day"));
    }),

  end_date: Yup.mixed()
    .required("End date and time are required")
    .test(
      "end-after-start",
      "End date must be after start date",
      function (value) {
        const { start_date } = this.parent;

        if (!start_date || !value) return true;

        return dayjs(value).isAfter(dayjs(start_date));
      },
    ),

  latitude: Yup.number()
    .typeError("Latitude must be a number")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .required("This field is required"),

  longitude: Yup.number()
    .typeError("Longitude must be a number")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .required("This field is required"),

  image_base64: Yup.string().required("This field is required"),

  image_size: Yup.number()
    .required("This field is required")
    .test("file-size", "Image must not be more than 1 MB", (value) => {
      if (!value) return false;

      return value <= 1024 * 1024;
    }),
});

const stepSchemas = [
  // STEP 1
  Yup.object({
    title: Yup.string()
      .trim()
      .required("This field is required")
      .max(50, "Title must not exceed 50 characters"),

    short_description: Yup.string()
      .trim()
      .required("This field is required")
      .max(100, "Short description must not exceed 100 characters"),

    description: Yup.string().trim().required("This field is required"),
  }),

  // STEP 2
  Yup.object({
    category_id: Yup.number()
      .required("This field is required")
      .moreThan(0, "This field is required"),

    sub_category_id: Yup.number()
      .required("This field is required")
      .moreThan(0, "This field is required"),

    venue_type_id: Yup.number()
      .required("This field is required")
      .moreThan(0, "This field is required"),
  }),

  // STEP 3
  Yup.object({
    start_date: Yup.mixed()
      .required("Start date and time are required")
      .test(
        "start-not-expired",
        "Start date cannot be in the past",
        (value) => {
          if (!value) return true;

          return !dayjs(value).startOf("day").isBefore(dayjs().startOf("day"));
        },
      ),

    end_date: Yup.mixed()
      .required("End date and time are required")
      .test(
        "end-after-start",
        "End date must be after start date",
        function (value) {
          const { start_date } = this.parent;

          if (!start_date || !value) return true;

          return dayjs(value).isAfter(dayjs(start_date));
        },
      ),

    address: Yup.string()
      .trim()
      .required("This field is required")
      .matches(
        /^[^,\s][^,]*\s*,\s*[^,\s][^,]*$/,
        "Enter location as Place, City",
      ),

    latitude: Yup.number()
      .typeError("Latitude must be a number")
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .required("This field is required"),

    longitude: Yup.number()
      .typeError("Longitude must be a number")
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .required("This field is required"),
  }),

  // STEP 4
  // STEP 4
  Yup.object({
    image_base64: Yup.string().required("This field is required"),

    image_size: Yup.number()
      .required("This field is required")
      .test("file-size", "Image must not be more than 1 MB", (value) => {
        if (!value) return false;

        return value <= 1024 * 1024;
      }),
  }),
];
const initialValues = {
  title: "",
  description: "",
  short_description: "",

  address: "",

  latitude: null,
  longitude: null,

  image_base64: "",
  image_name: "",

  category_id: 0,
  category_name: "",

  sub_category_id: 0,
  sub_category_name: "",

  start_date: null,
  end_date: null,

  venue_type_id: 0,
  venue_type_name: "",

  is_featured: false,
};
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

const getEventStatus = (startDate) => {
  if (!startDate) {
    return {
      id: null,
      name: null,
    };
  }

  const start = dayjs(startDate);
  const now = dayjs();

  if (start.isAfter(now)) {
    return {
      id: 15,
      name: "Pending",
    };
  }

  return {
    id: 16,
    name: "Ongoing",
  };
};

const stages = [
  {
    title: "Basic Information",
    content: "General details",
    icon: <FileTextOutlined />,
  },
  {
    title: "Classification",
    content: "Category & status",
    icon: <CalendarOutlined />,
  },
  {
    title: "Date & Location",
    content: "Venue & schedule",
    icon: <EnvironmentOutlined />,
  },
  {
    title: "Media & Options",
    content: "Image & visibility",
    icon: <PictureOutlined />,
  },
];

export const EventAdd = ({ open, onClose, setIndex }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const confirm = useConfirm();
  const loading = useLoading();
  const notify = useNotify();
  const user = useAuthStore((state) => state.user);
  const company = useAuthStore((state) => state.company);

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const validateCurrentStep = async ({ values, setTouched }) => {
    try {
      await stepSchemas[currentStep].validate(values, {
        abortEarly: false,
      });

      return {
        valid: true,
        errors: {},
      };
    } catch (error) {
      const stepErrors = {};

      error.inner?.forEach((item) => {
        if (item.path) {
          stepErrors[item.path] = item.message;
        }
      });

      console.log("ONLY CURRENT STEP ERRORS:", stepErrors);

      setTouched(
        Object.keys(stepErrors).reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {}),
        true,
      );

      return {
        valid: false,
        errors: stepErrors,
      };
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    confirm({
      title: "Create Event?",
      content:
        "Are you sure you want to create this event with the information provided?",
      type: "success",
      okText: "Yes, Create",
      cancelText: "No, Cancel",

      onOk: async () => {
        try {
          await loading.run(async () => {
            const eventStatus = getEventStatus(values.start_date);
            const data = {
              owner_id: company.id,
              owner_name: company.name,

              title: values.title.trim(),

              description: values.description.trim(),

              short_description: values.short_description.trim(),

              address: values.address.trim(),

              status_id: 20,
              status_name: "draft",

              creator_id: user.id,
              creator_name: user.first_name,

              latitude: Number(values.latitude),

              longitude: Number(values.longitude),

              image_base64: values.image_base64,

              image_name: values.image_name,

              media_type_id: 1,
              media_type_name: "image",

              category_id: values.category_id,
              category_name: values.category_name,

              sub_category_id: values.sub_category_id,
              sub_category_name: values.sub_category_name,

              start_date: values.start_date
                ? dayjs(values.start_date).toISOString()
                : null,

              end_date: values.end_date
                ? dayjs(values.end_date).toISOString()
                : null,

              event_status_id: eventStatus.id,
              event_status_name: eventStatus.name,

              venue_type_id: values.venue_type_id,
              venue_type_name: values.venue_type_name,

              is_featured: values.is_featured,
            };

            await createEvent(data);
          }, "Creating event...");

          onClose();
          setIndex((prev) => prev + 1);
          setSubmitting(false);
          resetForm();
          setCurrentStep(0);

          notify.success(
            "Event Created Successfully",
            "The event has been created successfully.",
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
          notify.error("Failed to Create Event", errorMessage);
        }
      },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={920}
      centered
      destroyOnHidden
      className="sw-form-modal"
      closeIcon={false}
      mask={{
        closable: !loading,
      }}
      keyboard={!loading}
      title={
        <div className="sw-form-modal-title">
          <div className="sw-form-modal-title-icon">
            <CalendarOutlined />
          </div>

          <div className="sw-form-modal-title-content">
            <h2>Create Event</h2>

            <p>Add a new event to the SwahiliExpi platform.</p>
          </div>
        </div>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
          setTouched,
          isSubmitting,
        }) => {
          /* =================================================
             ERROR
          ================================================= */

          const getError = (field) =>
            touched[field] && errors[field] ? errors[field] : null;

          const handleNext = async () => {
            const result = await validateCurrentStep({
              values,
              touched,
              setTouched,
            });

            if (!result.valid) {
              message.error(
                "Please complete all required fields before continuing.",
              );
              return;
            }

            setCurrentStep((prev) => Math.min(prev + 1, stages.length - 1));
          };

          const handlePrevious = () => {
            setCurrentStep((prev) => Math.max(prev - 1, 0));
          };

          return (
            <form className="sw-form" onSubmit={handleSubmit} noValidate>
              <div className="sw-form-stepper">
                <Steps current={currentStep} items={stages} responsive />
              </div>

              <div className="sw-form-content">
                {currentStep === 0 && (
                  <BasicInformation
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setTouched={setTouched}
                    getError={getError}
                    getBase64={getBase64}
                  />
                )}

                {currentStep === 1 && (
                  <Classification
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setTouched={setTouched}
                    getError={getError}
                    getBase64={getBase64}
                  />
                )}

                {currentStep === 2 && (
                  <DateLocation
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setTouched={setTouched}
                    getError={getError}
                    getBase64={getBase64}
                  />
                )}

                {currentStep === 3 && (
                  <MediaOptions
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setTouched={setTouched}
                    getError={getError}
                    getBase64={getBase64}
                  />
                )}
              </div>

              <div className="sw-form-footer">
                <div className="sw-form-footer-progress">
                  <span>
                    Step {currentStep + 1} of {stages.length}
                  </span>

                  <div className="sw-form-progress">
                    <span
                      style={{
                        width: `${((currentStep + 1) / stages.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="sw-form-actions">
                  <AppButton
                    type="danger"
                    htmlType="button"
                    loading={isSubmitting}
                    onClick={handleClose}
                    disabled={isSubmitting}
                    icon={<CloseOutlined />}
                  >
                    Cancel
                  </AppButton>

                  {currentStep > 0 && (
                    <Button
                      type="button"
                      className="sw-form-previous-button"
                      icon={<ArrowLeftOutlined />}
                      onClick={handlePrevious}
                      disabled={isSubmitting}
                    >
                      Previous
                    </Button>
                  )}

                  {currentStep < stages.length - 1 ? (
                    <Button
                      type="button"
                      className="sw-form-next-button"
                      icon={<ArrowRightOutlined />}
                      iconPlacement="end"
                      onClick={handleNext}
                      disabled={isSubmitting}
                    >
                      Continue
                    </Button>
                  ) : (
                    <AppButton
                      type="save"
                      htmlType="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      icon={<CheckOutlined />}
                    >
                      Save
                    </AppButton>
                  )}
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};
