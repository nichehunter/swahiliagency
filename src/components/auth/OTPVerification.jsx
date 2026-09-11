"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SafetyOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Spin, Alert } from "antd";
import moment from "moment";
import { useAuthStore } from "@/stores/authStore";
import { useNavigationLoading } from "@/components/common/loading/NavigationLoadingProvider";
import { verifyOTP } from "@/services/auth/loginService";
import { useOtpStore } from "@/stores/otpStore";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 120; // 2 minutes

export const OTPContent = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  const expiry = useOtpStore((state) => state.otpExpiry);
  const clearOTP = useOtpStore((state) => state.clearOtp);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const { startNavigation } = useNavigationLoading();
  const [verifyError, setVerifyError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const inputRefs = useRef([]);
  // FIX 1: Properly initialize hasExpired ref
  const hasExpired = useRef(false);

  const firstInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!expiry) {
      setTimeout(() => {
        setCountdown(0);
      });
      return;
    }

    hasExpired.current = false;

    const updateCountdown = () => {
      const remaining = moment(expiry).diff(moment(), "seconds");

      if (remaining <= 0) {
        setCountdown(0);

        if (!hasExpired.current) {
          hasExpired.current = true;

          clearOTP();
          router.replace("/");
        }

        return;
      }

      setCountdown(remaining);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [expiry, clearOTP, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") return responseData;
    if (responseData?.error) return responseData.error;
    if (responseData?.detail) return responseData.detail;
    if (responseData?.message) return responseData.message;

    if (typeof responseData === "object" && responseData) {
      const firstKey = Object.keys(responseData)[0];
      if (firstKey) {
        const firstError = responseData[firstKey];
        if (Array.isArray(firstError)) return firstError[0];
        if (typeof firstError === "string") return firstError;
      }
    }

    return "Unable to verify the code. Please try again.";
  };

  const handleVerifyOTP = async (otpValue) => {
    if (isLoading || otpValue.length !== OTP_LENGTH) return;

    if (!expiry) {
      setVerifyError(
        "Verification session not found. Please return to sign in and try again.",
      );
      return;
    }

    // Check expiry before calling backend
    const remaining = moment(expiry).diff(moment(), "seconds");

    if (remaining <= 0) {
      setCountdown(0);

      setVerifyError(
        "This verification code has expired. Please return to sign in and request a new code.",
      );

      return;
    }

    setVerifyError("");
    setIsLoading(true);

    try {
      const response = await verifyOTP({
        user_id: user?.id,
        platform_code: "swahili002",
        otp: otpValue,
      });

      if (response?.is_verified === true) {
        clearOTP();

        setAuth({
          user: response.user,
          permissions: response.permissions,
          token: response.tokens,
          platform: response.platform,
          company: response.business || null,
        });

        startNavigation("Preparing your dashboard...");

        router.replace("/dashboard");
        return;
      }

      // WRONG OTP
      setVerifyError(
        response?.message || "Invalid verification code. Please try again.",
      );

      setOtp(["", "", "", "", "", ""]);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } catch (error) {
      // WRONG OTP / BACKEND VALIDATION ERROR
      setVerifyError(getErrorMessage(error));

      setOtp(["", "", "", "", "", ""]);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (isLoading || countdown === 0) return;
    if (verifyError) setVerifyError("");

    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5) {
      const otpValue = newOtp.join("");
      if (otpValue.length === 6) {
        handleVerifyOTP(otpValue);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (isLoading) return;

    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    if (isLoading || countdown === 0) return;

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 6)
      .toUpperCase();

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];
    pastedData.split("").forEach((character, index) => {
      newOtp[index] = character;
    });

    setOtp(newOtp);

    if (pastedData.length === 6) {
      handleVerifyOTP(pastedData);
      return;
    }

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleBackToLogin = () => {
    clearOTP();
    setOtp(["", "", "", "", "", ""]);
    setVerifyError("");
    router.replace("/");
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = String(countdown % 60).padStart(2, "0");

  return (
    <main className="sw-agent-otp-wrapper">
      <div className="sw-agent-otp-card">
        {/* LEFT PANEL */}
        <section className="sw-agent-otp-left">
          <div className="sw-agent-otp-left-content">
            <div className="sw-agent-otp-logo">
              <div className="sw-agent-otp-logo-mark">
                <span>S</span>
              </div>

              <div className="sw-agent-otp-logo-text">
                <strong>SwahiliExpi</strong>
                <span>Agent Platform</span>
              </div>
            </div>

            <div className="sw-agent-otp-left-main">
              <span className="sw-agent-otp-badge">
                <span />
                SECURE VERIFICATION
              </span>

              <h1>
                One more step.
                <br />
                <span>{`You're almost in.`}</span>
              </h1>

              <p>
                {`We've sent a one-time verification code to
                your registered contact. Enter the code to
                securely continue to your agent dashboard.`}
              </p>

              <div className="sw-agent-otp-security">
                <LockOutlined />

                <div>
                  <strong>Protected verification</strong>
                  <span>
                    Your verification code is temporary and can only be used
                    once.
                  </span>
                </div>
              </div>
            </div>

            <div className="sw-agent-otp-left-footer">
              <p>© {new Date().getFullYear()} Swahiliexpi</p>

              <span>Empowering agents through smarter technology.</span>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="sw-agent-otp-right">
          <div className="sw-agent-otp-form-content">
            <div className="sw-agent-otp-right-icon">
              <SafetyOutlined />
            </div>
            <div className="sw-agent-otp-header">
              <span>VERIFY YOUR IDENTITY</span>

              <h2>Enter verification code</h2>

              <p>
                Enter the 6-character code sent to you. You can type or paste
                the complete code.
              </p>
            </div>

            {/* OTP INPUTS */}
            <div
              className={`sw-agent-otp-inputs ${
                isLoading ? "sw-agent-otp-inputs-verifying" : ""
              }`}
              onPaste={handlePaste}
            >
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="text"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={value}
                  disabled={isLoading || countdown <= 0}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  className="sw-agent-otp-input"
                  aria-label={`OTP character ${index + 1}`}
                />
              ))}
            </div>

            {/* STATUS */}
            <div className="sw-agent-otp-status">
              {!isLoading && countdown > 0 && (
                <>
                  <div className="sw-agent-otp-timer">
                    <span className="sw-agent-otp-timer-dot" />
                    Code expires in{" "}
                    <strong>
                      {minutes}:{seconds}
                    </strong>
                  </div>

                  {verifyError ? (
                    <Alert
                      title="Unable to verify code"
                      description={verifyError}
                      type="error"
                      showIcon
                      closable
                      onClose={() => setVerifyError("")}
                      className="login-error-alert"
                    />
                  ) : (
                    <p>
                      Verification will continue automatically after all 6
                      characters are entered.
                    </p>
                  )}
                </>
              )}

              {isLoading && (
                <div className="sw-agent-otp-verifying">
                  <span className="sw-agent-otp-spinner" />
                  Verifying your code...
                </div>
              )}

              {countdown <= 0 && expiry && (
                <div className="sw-agent-otp-expired">
                  This verification code has expired. Redirecting...
                </div>
              )}
            </div>

            <button
              type="button"
              className="verify-back"
              onClick={handleBackToLogin}
              disabled={isLoading}
            >
              <ArrowLeftOutlined />
              <span>Back to Sign In</span>
            </button>

            {/* SECURITY NOTE */}
            <div className="sw-agent-otp-note">
              <SafetyOutlined />

              <div>
                <strong>Keep your code private</strong>

                <span>
                  Never share your verification code with anyone, including
                  support staff.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
