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

  // Prevent flicker/flash: render a loading spinner until store hydration finishes
  if (!hasHydrated) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" description="Loading session..." />
      </div>
    );
  }

  // If not authenticated, prevent rendering dashboard children while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
