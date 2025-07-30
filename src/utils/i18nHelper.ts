import { I18NextService } from "@/services/I18NextService";
import { LanguageFile } from "@/constants/language";

/**
 * Helper function to get translations using I18NextService with namespace support
 * @param namespace The translation namespace from LanguageFile enum
 * @param key The translation key
 * @param options Optional parameters for the translation
 * @returns The translated string
 */
export const t = (namespace: LanguageFile, key: string, options?: any): string => {
  const result = I18NextService.i18n.t(`${namespace}.${key}`, options);

  // ป้องกันข้อผิดพลาด ด้วยการแปลงค่าผลลัพธ์ให้เป็น string
  return typeof result === 'string' ? result : String(result);
};
/**
 * Helper function to get a namespace object that can be used similar to the old useTranslateFile hook
 * This makes migration easier by allowing a similar syntax:
 * const authen = useTranslateFile(LanguageFile.AUTHEN) -> const authen = getNamespace(LanguageFile.AUTHEN)
 * 
 * @param namespace The translation namespace from LanguageFile enum
 * @returns A proxy object that returns translations for the given namespace
 */
export const getNamespace = (namespace: LanguageFile): any => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return I18NextService.i18n.t(`${namespace}.${prop}`);
      }
      return undefined;
    }
  });
};