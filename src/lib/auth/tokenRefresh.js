import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { getTokenRemainingTime } from "./token";

const REFRESH_BEFORE = 2 * 60 * 1000; // 2 minutes

let refreshTimer = null;

export const refreshAccessToken = async () => {
  const refreshToken = useAuthStore.getState().token?.refresh;

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh`,
      {
        refresh: refreshToken,
      },
    );

    const newAccessToken = response.data?.access;

    if (!newAccessToken) {
      throw new Error("No access token returned");
    }

    const currentToken = useAuthStore.getState().token;

    useAuthStore.setState({
      token: {
        ...currentToken,

        access: newAccessToken,

        /*
         * If backend rotates refresh tokens,
         * save the new refresh token too.
         */
        refresh: response.data?.refresh || currentToken.refresh,
      },
    });

    scheduleTokenRefresh(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);

    useAuthStore.getState().logout();

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    return null;
  }
};

export const scheduleTokenRefresh = (accessToken) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const remainingTime = getTokenRemainingTime(accessToken);

  /*
   * Refresh 2 minutes before expiry.
   */
  const refreshIn = remainingTime - REFRESH_BEFORE;

  /*
   * If token has less than 2 minutes left,
   * refresh immediately.
   */
  const delay = Math.max(refreshIn, 5000);

  refreshTimer = setTimeout(() => {
    refreshAccessToken();
  }, delay);
};

export const stopTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};
