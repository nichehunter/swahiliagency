"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Spin } from "antd";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    // Only evaluate authentication AFTER localStorage rehydration finishes
    if (hasHydrated && !isAuthenticated) {
      router.replace("/");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // If not authenticated, prevent rendering dashboard children while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
