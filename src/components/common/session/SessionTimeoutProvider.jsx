"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOtpStore } from "@/stores/otpStore";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 1 minute

const PUBLIC_ROUTES = ["/"];

export default function SessionTimeoutProvider({ children }) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const clearOTP = useOtpStore((state) => state.clearOtp);

  const timeoutRef = useRef(null);
  const activityThrottleRef = useRef(false);

  const isAuthenticated = !!user;

  const logoutUser = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    clearOTP();

    if (typeof logout === "function") {
      logout();
    }

    router.replace("/");
  };

  const resetTimer = () => {
    if (!isAuthenticated) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      logoutUser();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      return;
    }

    const handleActivity = () => {
      if (activityThrottleRef.current) return;

      activityThrottleRef.current = true;

      resetTimer();

      setTimeout(() => {
        activityThrottleRef.current = false;
      }, 1000);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, {
        passive: true,
      });
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isAuthenticated]);

  return children;
}
