"use client";

import "@/styles/auth/otp.css";
import { OTPContent } from "@/components/auth/OTPVerification";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function OTPVerification() {
  const router = useRouter();

  const loginStage = useAuthStore((state) => state.loginStage);

  useEffect(() => {
    if (loginStage !== "verify_otp") {
      router.replace("/");
    }
  }, [loginStage, router]);

  if (loginStage !== "verify_otp") {
    return null;
  }
  return (
    <>
      <OTPContent />
    </>
  );
}
