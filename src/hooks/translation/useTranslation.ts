import {useTranslation as useI18NextTranslation} from "react-i18next";
import {useEffect} from "react";
import {useLanguage} from "@/contexts/LanguageContext";
import { getAppName } from "@/utils/appConfig";

export const useTranslation = () => {
  const {t, i18n} = useI18NextTranslation(); // ใช้ Hook ของ i18next
  const {lang} = useLanguage(); // ดึงภาษาจาก Context ของแอปพลิเคชัน
  console.log("i18n object:", i18n);

  // ตัวช่วยแทนที่แบรนด์ในข้อความที่เป็นคอนเทนต์เท่านั้น
  const replaceBrand = (text: any): any => {
    if (text == null) return text as any;
    if (typeof text !== "string") return text as any;
    // แทนที่เฉพาะคำว่า fastwork/Fastwork ที่เป็นคำเดี่ยว ไม่ใช่โดเมนหรืออีเมล หรือ class-name
    return text.replace(/fastwork/gi, (match, offset) => {
      const prev = text[offset - 1] ?? "";
      const next = text[offset + match.length] ?? "";
      // ไม่แทนที่ถ้าอยู่ในอีเมลหรือโดเมน เช่น support@fastwork.co, fastwork.co
      if (prev === "@" || next === ".") return match;
      // ไม่แทนที่ถ้าเป็นส่วนของ class-name เช่น text-fastwork-blue หรือ fastwork-blue
      const before = text.slice(Math.max(0, offset - 12), offset);
      const after = text.slice(offset + match.length, offset + match.length + 12);
      if (/-fastwork/i.test(before + match) || /fastwork-/i.test(match + after)) return match;
      return getAppName();
    });
  };

  // ซิงค์ภาษาใน i18next กับ Context
  useEffect(() => {
    if (i18n && typeof i18n.changeLanguage === "function" && i18n.language !== lang) {
      i18n.changeLanguage(lang); // เปลี่ยนภาษาของ i18next ให้ตรงกับ Context
    }
  }, [lang, i18n]);

  // ห่อฟังก์ชัน t ให้แทนที่แบรนด์อัตโนมัติในผลลัพธ์
  const tWrapped: typeof t = ((key: any, options?: any) => {
    const out = (t as any)(key, options);
    if (typeof out === "string") return replaceBrand(out);
    if (Array.isArray(out)) return out.map(replaceBrand) as any;
    return out;
  }) as any;

  return {t: tWrapped, i18n}; // คืนค่า `t` และอินสแตนซ์ของ i18next
};