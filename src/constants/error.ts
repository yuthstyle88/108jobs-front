export const ERROR_REGISTER = {
  emailAlreadyExists: "EMAIL_ALREADY_EXISTS",
  databaseError: "DATABASE_ERROR",
  rateLimitError: "RATE_LIMIT_ERROR",
};

export const ERROR_VERIFY_EMAIL = {
  verificationCodeExpired: "VERIFICATION_CODE_EXPIRED",
  invalidVerificationCode: "INVALID_VERIFICATION_CODE",
};

export const ERROR_VERIFY_PASSWORD = {
  invalidPassword: "INVALID_PASSWORD",
  invalidCredentials: "INVALID_CREDENTIALS",
};

export const ERROR_CONSTANTS = {
  EMAIL_EXIST: "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น",
  EMAIL_VERIFIED: "อีเมล์ได้รับการยืนยันแล้ว",
  EMAIL_REQUIRED: "จำเป็นต้องระบุอีเมล",
  USERNAME_EXIST: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว กรุณาใช้ชื่อผู้ใช้อื่น",
  INVALID_CODE: "รหัสไม่ถูกต้อง หรือ รหัสหมดอายุ",
  SERVER_ERROR: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
  RESEND_FAILED: "การส่งอีเมลซ้ำล้มเหลว",
  LIMIT_SEND_EMAIL: "กรุณารอสักครู่แล้วลองอีกครั้ง",
  EMAIL_NOT_EXIST: "ข้อมูลไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง",
  INVALID_PASSWORD: "รหัสผ่านไม่ถูกต้อง",
  INVALID_OLD_PASSWORD: "รหัสผ่านเดิมไม่ถูกต้อง",
  CHANGE_PASSWORD_FAILED: "มีข้อผิดพลาดในการเปลี่ยนรหัสผ่านของคุณ",
  CAPTCHA_WRONG: "Captcha ไม่ถูกต้อง",
  USERNAME_INVALID: "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาใช้ชื่ออื่น",
};
