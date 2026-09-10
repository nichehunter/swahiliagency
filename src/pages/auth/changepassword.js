"use client";

import "@/styles/auth/changepassword.css";
import { ChangePasswordContent } from "@/components/auth/ChangePassword";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function ChangePassword() {
  const router = useRouter();

  const loginStage = useAuthStore((state) => state.loginStage);

  useEffect(() => {
    if (loginStage !== "change_password") {
      router.replace("/");
    }
  }, [loginStage, router]);

  if (loginStage !== "change_password") {
    return null;
  }
  return (
    <>
      <ChangePasswordContent />
    </>
  );
}
