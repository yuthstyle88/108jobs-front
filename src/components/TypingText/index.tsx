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
        global?.label_nav_bar_item_2 || "",
        1200,
        global?.label_nav_bar_item_3 || "",
        1200,
        global?.label_nav_bar_item_4 || "",
        1200,
        global?.label_nav_bar_item_5 || "",
        1200,
        global?.label_nav_bar_item_6 || "",
        1200,
        global?.label_nav_bar_item_7 || "",
        1200,
        global?.label_nav_bar_item_8 || "",
        1200,
      ]}
      omitDeletionAnimation
      repeat={Infinity}
      className="text-[48px] font-medium text-center"
    />
  );
};

export default TypingText;
