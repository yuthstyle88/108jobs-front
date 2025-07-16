"use client";

import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { TypeAnimation } from "react-type-animation";

const TypingText = () => {
    const global = useTranslateFile(LanguageFile.GLOBAL);

  return (
    <TypeAnimation
      key={JSON.stringify(global)}
      sequence={[
        global?.labelNavBarItem2 || "",
        1200,
        global?.labelNavBarItem3 || "",
        1200,
        global?.labelNavBarItem4 || "",
        1200,
        global?.labelNavBarItem5 || "",
        1200,
        global?.labelNavBarItem6 || "",
        1200,
        global?.labelNavBarItem7 || "",
        1200,
        global?.labelNavBarItem8 || "",
        1200,
      ]}
      omitDeletionAnimation
      repeat={Infinity}
      className="text-[48px] font-medium text-center"
    />
  );
};

export default TypingText;
