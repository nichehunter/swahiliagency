"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightOutlined,
  HomeOutlined,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Input, message } from "antd";

export const ResetPasswordContent = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.newPassword) {
      message.error("Please enter your new password.");
      return;
    }

    if (form.newPassword.length < 8) {
      message.error("Password must be at least 8 characters.");
      return;
    }

    if (!form.confirmPassword) {
      message.error("Please confirm your new password.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      message.error("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      /*
       * API CALL HERE
       *
       * Example:
       *
       * await resetPassword({
       *   new_password: form.newPassword,
       * });
       */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      message.success("Password reset successfully.");

      router.replace("/");
    } catch (error) {
      console.error("Reset password error:", error);

      message.error("Unable to reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sw-agent-reset-wrapper">
      <div className="sw-agent-reset-card">
        {/* LEFT PANEL */}
        <section className="sw-agent-reset-left">
          <div className="sw-agent-reset-left-content">
            {/* LOGO */}
            <div className="sw-agent-reset-logo">
              <div className="sw-agent-reset-logo-mark">
                <span>S</span>
              </div>

              <div className="sw-agent-reset-logo-text">
                <strong>swahiliexpi</strong>
                <span>Agent Platform</span>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="sw-agent-reset-left-main">
              <span className="sw-agent-reset-badge">
                <span />
                PASSWORD RECOVERY
              </span>

              <h1>
                Reset your password.
                <br />
                <span>Stay secure.</span>
              </h1>

              <p>
                Enter a strong password to protect your account and keep your
                agent information secure.
              </p>

              <div className="sw-agent-reset-security">
                <div className="sw-agent-reset-security-icon">
                  <SafetyOutlined />
                </div>

                <div>
                  <strong>Secure account protection</strong>

                  <span>
                    Your new password will replace your previous password
                    immediately.
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="sw-agent-reset-left-footer">
              <p>© {new Date().getFullYear()} Swahiliexpi</p>

              <span>Empowering agents through smarter technology.</span>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="sw-agent-reset-right">
          <div className="sw-agent-reset-form-content">
            {/* ICON */}
            <div className="sw-agent-reset-right-icon">
              <LockOutlined />
            </div>

            {/* HEADER */}
            <div className="sw-agent-reset-header">
              <span>ACCOUNT RECOVERY</span>

              <h2>Reset your password</h2>

              <p>
                Enter the email address associated with your account and we will
                send you a password reset link.
              </p>
            </div>

            {/* FORM */}
            <form className="sw-agent-reset-form" onSubmit={handleSubmit}>
              {/* NEW PASSWORD */}
              <div className="sw-agent-reset-form-group">
                <label htmlFor="email">Email</label>

                <Input
                  id="email"
                  name="email"
                  size="large"
                  className="sw-auth-input"
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                  value={""}
                  onChange={null}
                  //   onBlur={formik.handleBlur}
                  disabled={loading}
                  //   status={
                  //     formik.touched.email && formik.errors.email ? "error" : ""
                  //   }
                />
              </div>
              {/* SUBMIT */}
              <button
                type="submit"
                className="sw-agent-reset-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="sw-agent-reset-spinner" />
                    Resetting password...
                  </>
                ) : (
                  <>
                    Reset password
                    <ArrowRightOutlined />
                  </>
                )}
              </button>
            </form>

            {/* SECURITY NOTE */}
            <div className="sw-agent-reset-note">
              <SafetyOutlined />

              <div>
                <strong>Secure password recovery</strong>

                <span>
                  Your password is securely processed and never displayed in
                  plain text.
                </span>
              </div>
            </div>
            <div className="sw-agent-cp-footer mt-2">
              <Link href="/">
                <HomeOutlined />
                Return to sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
