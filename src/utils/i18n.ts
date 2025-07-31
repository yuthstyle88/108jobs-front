import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en as translation } from "@/translations/en";
import { en as jobCard } from "@/translations/en";
import { en as global } from "@/translations/en";
// การโหลด resources (สมมุติว่าคุณมีไฟล์ JSON ในภาษาต่าง ๆ)
const resources = {
  en: {
    translation,
    jobCard, // ✅ Separate namespace
    global, // ✅ new namespace added
  },
};

// กำหนดค่า i18n
i18n.use(initReactI18next).init({
  debug: false,
  resources, // resource translations
  lng: 'en', // ภาษาเริ่มต้น
  fallbackLng: 'en', // fallback language
  ns: ["translation", "jobCard", "global"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false, // ไม่ต้อง escape ค่าถ้าใช้ React
  },
});

export default i18n;