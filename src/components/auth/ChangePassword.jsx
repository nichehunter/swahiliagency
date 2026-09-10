"use client";

import moment from "moment";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOtpStore } from "@/stores/otpStore";
import { firstlogin } from "@/services/auth/loginService";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  current_password: Yup.string().required("Current password is required"),

  new_password: Yup.string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters")
    .notOneOf(
      [Yup.ref("current_password")],
      "New password must be different from your current password",
    ),

  confirm_password: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("new_password")], "Passwords do not match"),
});
import Link from "next/link";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  HomeOutlined,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Form, message } from "antd";

export const ChangePasswordContent = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setOtpExpiry = useOtpStore((state) => state.setOtpExpiry);
  const setUser = useOtpStore((state) => state.setUser);
  const startOTPVerification = useAuthStore(
    (state) => state.startOTPVerification,
  );

  const handleBackToLogin = () => {
    logout();
    router.replace("/");
  };

  useEffect(() => {
    if (!loginError) return;

    const timer = setTimeout(() => {
      setLoginError("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [loginError]);

  const formik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const data = {
          user_id: user?.id,
          current_password: values.current_password,
          new_password: values.new_password,
          confirm_password: values.confirm_password,
          platform_code: "swahili002",
        };

        // 1. Call API and log the exact response structure
        const response = await firstlogin(data);

        // 2. Build userData using existing store user as primary fallback
        const userData = {
          id: response?.user_id ?? response?.id ?? user?.id,
          username: response?.username ?? user?.username ?? "",
          user_type: response?.user_type ?? user?.user_type ?? "",
          platform_code:
            response?.platform_code ?? user?.platform_code ?? "swahili002",
        };

        setOtpExpiry(moment().add(3, "minutes").toISOString());

        setUser({
          userId: response.user_id,
          username: response.username,
          platformCode: response.platform_code,
        });

        // 4. Update state and navigate
        startOTPVerification(userData);
        setTimeout(() => {
          router.push("/auth/otp");
        }, 0);
      } catch (error) {
        console.error(
          "firstlogin error response:",
          error?.response?.data || error,
        );

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
        } else if (typeof responseData === "object" && responseData !== null) {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];
          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }

        setLoginError(errorMessage);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });
  return (
    <main className="sw-agent-change-password-wrapper">
      {/* Background decorations */}
      <div className="sw-agent-cp-glow sw-agent-cp-glow-one" />
      <div className="sw-agent-cp-glow sw-agent-cp-glow-two" />

      <div className="sw-agent-change-password-card">
        {/* =========================================
            LEFT PANEL
        ========================================== */}
        <section className="sw-agent-cp-left">
          <div className="sw-agent-cp-left-content">
            {/* Brand */}
            <div className="sw-agent-cp-brand">
              <div className="sw-agent-cp-logo">
                <span>S</span>
              </div>

              <div className="sw-agent-cp-brand-text">
                <strong>SwahiliExpi</strong>
                <span>Agent Platform</span>
              </div>
            </div>

            {/* Main message */}
            <div className="sw-agent-cp-hero">
              <span className="sw-agent-cp-badge">
                <span className="sw-agent-cp-badge-dot" />
                SECURITY CHECK
              </span>

              <h1>
                Secure your
                <br />
                <span>account.</span>
              </h1>

              <p>
                {`You're using a temporary or default password. For your security, you need to create a new password before continuing.`}
              </p>

              {/* Security features */}
              <div className="sw-agent-cp-features">
                <div className="sw-agent-cp-feature">
                  <div className="sw-agent-cp-feature-icon">
                    <SafetyOutlined />
                  </div>

                  <div>
                    <strong>Protect your account</strong>
                    <span>
                      Keep your agent account secure with a private password.
                    </span>
                  </div>
                </div>

                <div className="sw-agent-cp-feature">
                  <div className="sw-agent-cp-feature-icon">
                    <CheckCircleOutlined />
                  </div>

                  <div>
                    <strong>One-time setup</strong>
                    <span>
                      Once changed, you can continue directly to your dashboard.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sw-agent-cp-left-footer">
              <span>© {new Date().getFullYear()} SwahiliExpi</span>
              <span>Empowering agents through smarter technology.</span>
            </div>
          </div>
        </section>

        {/* =========================================
            RIGHT PANEL
        ========================================== */}
        <section className="sw-agent-cp-right">
          <div className="sw-agent-cp-form-container">
            {/* Header */}
            <div className="sw-agent-cp-header">
              <div className="sw-agent-cp-header-icon">
                <LockOutlined />
              </div>

              <span className="sw-agent-cp-label">REQUIRED ACTION</span>

              <h2>Change your password</h2>

              <p>Create a new password to continue to your agent dashboard.</p>
            </div>

            {/* Form */}
            <form className="sw-agent-cp-form" onSubmit={formik.handleSubmit}>
              {/* Current password */}
              <div className="sw-agent-cp-form-group">
                <label htmlFor="currentPassword">Current password</label>

                <Input.Password
                  id="current_password"
                  name="current_password"
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Enter your current password"
                  value={formik.values.current_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  status={
                    formik.touched.current_password &&
                    formik.errors.current_password
                      ? "error"
                      : ""
                  }
                />

                {formik.touched.current_password &&
                  formik.errors.current_password && (
                    <div className="text-danger fs-6 mt-1">
                      {formik.errors.current_password}
                    </div>
                  )}
              </div>

              {/* New password */}
              <div className="sw-agent-cp-form-group">
                <label htmlFor="newPassword">New password</label>

                <Input.Password
                  id="new_password"
                  name="new_password"
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Enter your new password"
                  value={formik.values.new_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  status={
                    formik.touched.new_password && formik.errors.new_password
                      ? "error"
                      : ""
                  }
                />

                {formik.touched.new_password && formik.errors.new_password && (
                  <div className="text-danger fs-6 mt-1">
                    {formik.errors.new_password}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="sw-agent-cp-form-group">
                <label htmlFor="confirmPassword">Confirm new password</label>

                <Input.Password
                  id="confirm_password"
                  name="confirm_password"
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Enter your confirm password"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  status={
                    formik.touched.confirm_password &&
                    formik.errors.confirm_password
                      ? "error"
                      : ""
                  }
                />

                {formik.touched.confirm_password &&
                  formik.errors.confirm_password && (
                    <div className="text-danger fs-6 mt-1">
                      {formik.errors.confirm_password}
                    </div>
                  )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="sw-agent-cp-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="sw-agent-cp-spinner" />
                    Updating password...
                  </>
                ) : (
                  <>
                    Change password
                    <ArrowRightOutlined />
                  </>
                )}
              </button>
            </form>

            {/* Security notice */}
            <div className="sw-agent-cp-security">
              <SafetyOutlined />

              <div>
                <strong>Your account is protected</strong>
                <span>
                  Your new password will be securely stored and used for future
                  sign-ins.
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sw-agent-cp-footer">
            <span onClick={handleBackToLogin}>
              <HomeOutlined />
              Return to sign in
            </span>
          </div>
        </section>
      </div>
    </main>
  );
};
