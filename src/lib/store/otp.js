import moment from "moment";

const OTP_EXPIRY_KEY = "swahili_auth_otp_expiry";

export const otpStore = {
  // =====================================================
  // CREATE OTP EXPIRY
  // =====================================================

  setExpiry: (minutes = 3) => {
    if (typeof window === "undefined") return;

    const expiry = moment().add(minutes, "minutes").toISOString();

    localStorage.setItem(OTP_EXPIRY_KEY, expiry);
  },

  // =====================================================
  // GET OTP EXPIRY
  // =====================================================

  getExpiry: () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(OTP_EXPIRY_KEY);
  },

  // =====================================================
  // CHECK IF OTP EXPIRED
  // =====================================================

  isExpired: () => {
    if (typeof window === "undefined") return true;

    const expiry = localStorage.getItem(OTP_EXPIRY_KEY);

    if (!expiry) return true;

    return moment().isSameOrAfter(moment(expiry));
  },

  // =====================================================
  // CLEAR OTP EXPIRY
  // =====================================================

  clearExpiry: () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(OTP_EXPIRY_KEY);
  },
};
