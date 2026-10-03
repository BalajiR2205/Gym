export const ADMIN_COOKIE_NAME = "gym_admin_session";
export const MEMBER_COOKIE_NAME = "gym_member_session";

// Session durations
export const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const MEMBER_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// OTP configuration
export const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

// Rate limits
export const RATE_LIMIT_ADMIN_LOGIN = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

export const RATE_LIMIT_OTP_SEND = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

export const RATE_LIMIT_OTP_VERIFY = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

export const GENERIC_OTP_SENT_MESSAGE =
  "If the account is eligible, an OTP has been sent to the registered email.";
