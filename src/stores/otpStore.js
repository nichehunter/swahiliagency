"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  otp: "",
  otpExpiry: null,
  userId: null,
  username: null,
  platformCode: null,
  countdown: 0,
};

export const useOtpStore = create(
  persist(
    (set) => ({
      ...initialState,

      setOtp: (otp) => set({ otp }),

      setOtpExpiry: (otpExpiry) => set({ otpExpiry }),

      setUser: ({ userId, username, platformCode }) =>
        set({
          userId,
          username,
          platformCode,
        }),

      setCountdown: (countdown) => set({ countdown }),

      clearOtp: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "swahili-auth-otp",
    },
  ),
);
