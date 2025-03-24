export const ERROR_REGISTER = {
  email_already_exists: "email_already_exists",
  database_error: "database_error",
  rate_limit_error: "rate_limit_error",
};
export const ERROR_VERIFY_EMAIL = {
  verification_code_expired: "verification_code_expired",
  invalid_verification_code: "invalid_verification_code",
};

export const ERROR_VERIFY_PASSWORD = {
  invalid_password: "invalid_password",
  invalid_credentials: "invalid_credentials",
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
  CHANGE_PASSWORD_FAILED: "มีข้อผิดพลาดในการเปลี่ยนรหัสผ่านของคุณ"
};
