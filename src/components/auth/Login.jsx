"use client";

import moment from "moment";
import { login } from "@/services/auth/loginService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOtpStore } from "@/stores/otpStore";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Alert, Input, Spin } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const LoginContent = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const setOtpExpiry = useOtpStore((state) => state.setOtpExpiry);
  const setUser = useOtpStore((state) => state.setUser);
  const user = useAuthStore((state) => state);
  const startChangePassword = useAuthStore(
    (state) => state.startChangePassword,
  );
  const startOTPVerification = useAuthStore(
    (state) => state.startOTPVerification,
  );

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!loginError) return;

    const timer = setTimeout(() => {
      setLoginError("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [loginError]);

  const formik = useFormik({
    initialValues: { email: "", password: "", platform_code: "swahili002" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const response = await login(values);

        const user = {
          id: response.user_id,
          username: response.username,
          user_type: response.user_type,
          platform_code: response.platform_code,
        };

        if (response?.is_first_login === true) {
          startChangePassword(user);
          router.push("/auth/password");
        } else {
          setOtpExpiry(moment().add(3, "minutes").toISOString());

          setUser({
            userId: response.user_id,
            username: response.username,
            platformCode: response.platform_code,
          });
          startOTPVerification(user);
          router.push("/auth/otp");
        }
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

        setLoginError(errorMessage);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Don't flash login UI if already logged in or hydrating
  if (!hasHydrated || isAuthenticated) {
    return null;
  }

  return (
    <main className="sw-agent-login-wrapper">
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="sw-agent-login-center">
        {/* ===================================================
            MAIN LOGIN CARD
            =================================================== */}

        <div className="sw-agent-login-card">
          {/* =================================================
              LEFT BRANDING PANEL
              ================================================= */}

          <section className="sw-agent-login-left">
            <div className="sw-agent-login-left-content">
              {/* ---------------------------------------------
                  LOGO
                  --------------------------------------------- */}

              <div className="sw-agent-logo">
                <div className="sw-agent-logo-mark">
                  <span>S</span>
                </div>

                <div className="sw-agent-logo-text">
                  <strong>SwahiliExpi</strong>
                  <span>Agent Platform</span>
                </div>
              </div>

              {/* ---------------------------------------------
                  HERO CONTENT
                  --------------------------------------------- */}

              <div className="sw-agent-login-hero">
                <span className="sw-agent-login-badge">
                  <span className="sw-agent-login-badge-dot" />
                  AGENT PLATFORM
                </span>

                <h1>
                  Empower your work.
                  <br />
                  <span>Grow with confidence.</span>
                </h1>

                <p>
                  Manage your customers, activities, and daily operations from
                  one simple and powerful agent platform.
                </p>

                {/* -----------------------------------------
                    FEATURES
                    ----------------------------------------- */}

                <div className="sw-agent-login-features">
                  {/* Feature 1 */}
                  <div className="sw-agent-feature">
                    <div className="sw-agent-feature-icon">
                      <SafetyOutlined />
                    </div>

                    <div className="sw-agent-feature-content">
                      <strong>Secure & Reliable</strong>

                      <span>Your account and information are protected.</span>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="sw-agent-feature">
                    <div className="sw-agent-feature-icon">
                      <CheckCircleOutlined />
                    </div>

                    <div className="sw-agent-feature-content">
                      <strong>Everything in One Place</strong>

                      <span>Manage your agent activities with ease.</span>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="sw-agent-feature">
                    <div className="sw-agent-feature-icon">
                      <ArrowRightOutlined />
                    </div>

                    <div className="sw-agent-feature-content">
                      <strong>Work Smarter</strong>

                      <span>Simple tools designed for modern agents.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------
                  LEFT FOOTER
                  --------------------------------------------- */}

              <div className="sw-agent-left-footer">
                <p>© {new Date().getFullYear()} SwahiliExpi</p>

                <span>Empowering agents through smarter technology.</span>
              </div>
            </div>
          </section>

          {/* =================================================
              RIGHT LOGIN PANEL
              ================================================= */}

          <section className="sw-agent-login-right">
            <div className="sw-agent-login-form-content">
              {/* ---------------------------------------------
                  HEADER
                  --------------------------------------------- */}

              <div className="sw-agent-login-header">
                <span className="sw-agent-login-header-label">
                  WELCOME BACK
                </span>

                <h2>Sign in to your account</h2>

                <p>Enter your credentials to access your agent dashboard.</p>
              </div>

              {/* ---------------------------------------------
                  FORM
                  --------------------------------------------- */}

              <form
                className="sw-agent-login-form"
                onSubmit={formik.handleSubmit}
              >
                {/* -------------------------------------------
                    ERROR
                    ------------------------------------------- */}

                {loginError && (
                  <Alert
                    title="Unable to sign in"
                    description={loginError}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setLoginError("")}
                    className="login-error-alert"
                  />
                )}

                {/* -------------------------------------------
                    USERNAME
                    ------------------------------------------- */}

                <div className="sw-agent-form-group">
                  <label htmlFor="username" className="sw-agent-label">
                    Username
                  </label>

                  <Input
                    id="email"
                    name="email"
                    size="large"
                    className="sw-auth-input"
                    prefix={<UserOutlined />}
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={loading}
                    status={
                      formik.touched.email && formik.errors.email ? "error" : ""
                    }
                  />

                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger fs-6 mt-1">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                {/* -------------------------------------------
                    PASSWORD
                    ------------------------------------------- */}

                <div className="sw-agent-form-group">
                  <label htmlFor="password" className="sw-agent-label">
                    Password
                  </label>

                  <Input.Password
                    id="password"
                    name="password"
                    size="large"
                    className="sw-auth-input"
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={loading}
                    status={
                      formik.touched.password && formik.errors.password
                        ? "error"
                        : ""
                    }
                  />

                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger fs-6 mt-1">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* -------------------------------------------
                    OPTIONS
                    ------------------------------------------- */}

                <div className="sw-agent-login-options">
                  <label className="sw-agent-remember">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={formik.values.remember}
                      onChange={formik.handleChange}
                      disabled={loading}
                    />

                    <span className="custom-checkbox" />

                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    disabled={loading}
                    className="sw-agent-forgot"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* -------------------------------------------
                    LOGIN BUTTON
                    ------------------------------------------- */}

                <button
                  type="submit"
                  className="sw-agent-login-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="sw-agent-spinner" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRightOutlined />
                    </>
                  )}
                </button>
              </form>

              {/* ---------------------------------------------
                  SECURITY NOTICE
                  --------------------------------------------- */}

              <div className="sw-agent-security">
                <div className="sw-agent-security-icon">
                  <SafetyOutlined />
                </div>

                <div className="sw-agent-security-text">
                  <strong>Secure access</strong>

                  <span>Your connection is protected and encrypted.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
