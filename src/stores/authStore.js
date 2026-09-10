"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  user: null,
  platform: null,
  permissions: [],

  token: {
    access: null,
    refresh: null,
  },

  company: null,

  // login | verify_otp | change_password | authenticated
  loginStage: "login",

  isAuthenticated: false,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,

      // =====================================================
      // HYDRATION
      // =====================================================

      hasHydrated: false,

      setHasHydrated: (hasHydrated) =>
        set({
          hasHydrated,
        }),

      // =====================================================
      // SET AUTHENTICATION DATA
      // =====================================================

      setAuth: ({
        user = null,
        permissions = [],
        token = {},
        platform = null,
        company = null,
      }) =>
        set({
          user,

          permissions,

          token: {
            access: token?.access || null,
            refresh: token?.refresh || null,
          },

          platform,

          company,

          loginStage: "authenticated",

          isAuthenticated: true,
        }),

      // =====================================================
      // SET USER
      // =====================================================

      setUser: (user) =>
        set({
          user,
        }),

      // =====================================================
      // SET PERMISSIONS
      // =====================================================

      setPermissions: (permissions = []) =>
        set({
          permissions,
        }),

      // =====================================================
      // SET PLATFORM
      // =====================================================

      setPlatform: (platform = null) =>
        set({
          platform,
        }),

      // =====================================================
      // SET TOKEN
      // =====================================================

      setToken: (token = {}) =>
        set({
          token: {
            access: token?.access || null,
            refresh: token?.refresh || null,
          },
        }),

      // =====================================================
      // SET COMPANY
      // =====================================================

      setCompany: (company = null) =>
        set({
          company,
        }),

      // =====================================================
      // SET LOGIN STAGE
      // =====================================================

      setLoginStage: (loginStage) =>
        set({
          loginStage,
        }),

      // =====================================================
      // START PASSWORD CHANGE
      // =====================================================

      startChangePassword: (user) =>
        set({
          user,

          loginStage: "change_password",

          isAuthenticated: false,
        }),

      // =====================================================
      // START OTP VERIFICATION
      // =====================================================

      startOTPVerification: (user) =>
        set({
          user,

          loginStage: "verify_otp",

          isAuthenticated: false,
        }),

      // =====================================================
      // COMPLETE AUTHENTICATION
      // =====================================================

      setAuthenticated: () =>
        set({
          loginStage: "authenticated",

          isAuthenticated: true,
        }),

      // =====================================================
      // LOGOUT
      // =====================================================

      logout: () =>
        set({
          ...initialState,
        }),
    }),

    {
      name: "swahili-auth-storage",

      partialize: (state) => ({
        user: state.user,
        permissions: state.permissions,
        company: state.company,

        loginStage: state.loginStage,

        isAuthenticated: state.isAuthenticated,

        token: state.token,
      }),

      // =====================================================
      // KNOW WHEN PERSISTED DATA HAS BEEN LOADED
      // =====================================================

      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error) {
            state?.setHasHydrated(true);
          }
        };
      },
    },
  ),
);
