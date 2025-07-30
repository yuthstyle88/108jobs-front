# Hardcoded Text That Needs Translation

This document lists hardcoded text found in components that should be moved to translation files and accessed using the `t` function or `getNamespace`.

## Components Internationalized During Current Session

### StartSelling/Profile
- Moved hardcoded Thai testimonials to translation files
- Added keys with SELLER_OVERVIEW namespace prefix
- Updated component to use getNamespace

### ClientTestimonials
- Moved hardcoded Thai testimonial and section title to translation files
- Added keys with HOME namespace prefix
- Updated component to use getNamespace

## Components That Still Need Internationalization

### Authentication Components

#### LoginForm
- `"เกิดข้อผิดพลาดในการดึงข้อมูลเว็บไซต์"` (Error fetching website data) - Line 122
- `label={authen?.labelOrSignInWith ?? "หรือเข้าสู่ระบบด้วย"}` (or sign in with) - Line 215
  - This is using a fallback, but should ensure the translation key exists

#### ForgotPasswordForm
- `"เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน"` (Error resetting password) - Line 70

#### RegisterForm
- `{"You want to be a/an:"}` (English hardcoded text) - Line 443
- `หรือสมัครด้วยบัญชีโซเชียล` (or sign up with social account) - Line 538

#### ChangeEmailModal
- `"การยืนยันอีเมลไม่สำเร็จ"` (Email verification failed) - Line 129

#### ChangePasswordModal
- `"มีข้อผิดพลาดในการเปลี่ยนรหัสผ่านของคุณ"` (Error changing your password) - Line 109

#### ConfirmModal
- `"มีข้อผิดพลาดในการเปลี่ยนรหัสผ่านของคุณ"` (Error changing your password) - Line 92

#### ConfirmTermsFreelancerModal
- `"ยืนยันการลงทะเบียนเป็นฟรีแลนซ์"` (Confirm freelancer registration) - Line 55

### Home Page Components

#### ServiceGrid
- `"บริการของเรา"` (Our services) - Line 57
- `"ครอบคลุมทุกความต้องการด้านธุรกิจ มากกว่า 90 บริการ"` (Covering all business needs, more than 90 services) - Line 60
- `"บริการเรา"` (Our services) - Line 103

#### Home/IntroductionSection
- `"ที่ปรึกษาทางการเงิน"` (Financial advisor) - Line 326
- `"ปรึกษานักโภชนาการ"` (Nutrition consultant) - Line 351

#### Home/RecommendAndReview
- `"Fastjob ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ"` (Fastjob makes work convenient and much easier. We can choose freelancers according to our style) - Lines 152-153

#### StatsAndClients
- `"ลูกค้ากลุ่มองค์กรที่ใช้บริการ"` (Corporate clients using the service) - Line 19
- `"ฟรีแลนซ์ที่ให้บริการ"` (Freelancers providing services) - Line 29

### Job-Related Components

#### CategoryDetail
- `"เป็นที่ปรึกษาการตลาด"` (Be a marketing consultant) - Line 41

#### JobDetail
- `"เป็นที่ปรึกษาการตลาด"` (Be a marketing consultant) - Line 40

#### JobDetail/Package
- `"ระยะเวลาในการทำงาน {pkg.executionTime} วัน"` (Work duration {pkg.executionTime} days) - Line 36

### ContractForm

This component has no translation mechanism at all and uses hardcoded Thai text throughout:

- `งบประมาณที่ตั้งไว้*` (Budget*) - Line 314
- `placeholder="ระบุงบประมาณ(บาท)"` (Specify budget (THB)) - Line 321
- `อีเมล*` (Email*) - Line 328
- `placeholder="ระบุอีเมล"` (Specify email) - Line 336
- `เบอร์โทรศัพท์มือถือ*` (Mobile phone number*) - Line 344
- `placeholder="ระบุเบอร์โทรศัพท์มือถือ"` (Specify mobile phone number) - Line 351
- `Line ID` - Line 357
- `placeholder="ระบุไลน์ไอดี / หรือ ไม่ระบุ"` (Specify Line ID / or don't specify) - Line 364
- `ช่วงเวลาที่สะดวก` (Convenient time) - Line 372
- `placeholder="ที่ต้องเลือกทั้งหมด"` (All that must be selected) - Line 379
- `ยินยอมรับ ข้อกำหนดและเงื่อนไขการใช้งานและ นโยบายความเป็นส่วนตัว` (Accept terms and conditions and privacy policy) - Line 398
- `ส่งข้อมูล` (Submit) - Line 406

### Other Components

#### AvatarUploadModal
- `alert("เกิดข้อผิดพลาดในการอัปโหลดภาพ กรุณาลองใหม่อีกครั้ง");` (Error uploading image, please try again) - Line 82

## Recommended Approach for Future Internationalization

1. For each component:
   - Determine the appropriate namespace from LanguageFile enum
   - Add translation keys to all language files (en.ts, th.ts, vi.ts)
   - Import getNamespace and LanguageFile in the component
   - Replace hardcoded text with references to translations

2. For error messages:
   - Consider using the ERROR namespace for consistency
   - Use the same error keys across components when possible

3. For components with many text elements (like ContractForm):
   - Create a dedicated namespace if one doesn't exist
   - Add all text elements as translation keys
   - Refactor the component to use getNamespace throughout