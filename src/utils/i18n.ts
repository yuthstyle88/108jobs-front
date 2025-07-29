import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// การโหลด resources (สมมุติว่าคุณมีไฟล์ JSON ในภาษาต่าง ๆ)
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
    },
  },
  th: {
    translation: {
      welcome: 'สวัสดี',
    },
  },
};

// กำหนดค่า i18n
i18n.use(initReactI18next).init({
  resources, // resource translations
  lng: 'en', // ภาษาเริ่มต้น
  fallbackLng: 'en', // fallback language
  interpolation: {
    escapeValue: false, // ไม่ต้อง escape ค่าถ้าใช้ React
  },
});

export default i18n;