import {LANGUAGES} from "@/constants/language";
import {useLanguage} from "@/contexts/LanguageContext";
import Image from "next/image";

const LanguageSwitcher = () => {
  const {setLang} = useLanguage();

  return (
    <>
      {Object.values(LANGUAGES).map((lang) => (
        <button key={lang.code} onClick={() => setLang(lang.code)}>
          <Image
            title={lang.label}
            src={lang.flag}
            alt={lang.label}
            width={24}
            height={16}
          />
        </button>
      ))}
    </>
  );
};

export default LanguageSwitcher;
