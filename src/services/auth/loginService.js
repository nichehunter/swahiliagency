import authApi from "@/lib/axios/auth";

// =========================================================
// LOGIN
// =========================================================

export const login = async (data) => {
  const response = await authApi.post("/auth/login", data);

  return response.data;
};

// =========================================================
// FIRST LOGIN
// =========================================================

export const firstlogin = async (data) => {
  const response = await authApi.post("/auth/first-login", data);

  return response.data;
};

// =========================================================
// VERIFY OTP
// =========================================================

export const verifyOTP = async (data) => {
  const response = await authApi.post("/auth/otp", data);

  return response.data;
};
