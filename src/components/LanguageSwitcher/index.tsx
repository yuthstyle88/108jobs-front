import id from "@/assets/icons/id.svg";
import th from "@/assets/icons/th.svg";
import vn from "@/assets/icons/vn.svg";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

const LanguageSwitcher = () => {
  const { setLang } = useLanguage();

  const languages = [
    { code: "vi", image: vn },
    { code: "th", image: th },
    { code: "en", image: id },
  ];

  return (
    <>
      {languages.map((l) => (
        <button key={l.code} onClick={() => setLang(l.code)}>
          <Image title={l.code} src={l.image} alt={l.code} width={24} height={16} />
        </button>
      ))}
    </>
  );
};

export default LanguageSwitcher;
