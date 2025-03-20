"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { TypeAnimation } from "react-type-animation";

const TypingText = () => {
  const { languageData:globalLanguageData } = useLanguageStore();

  return (
    <TypeAnimation
      key={JSON.stringify(globalLanguageData)}
      sequence={[
        globalLanguageData?.global?.label_nav_bar_item_2 || "",
        1200,
        globalLanguageData?.global?.label_nav_bar_item_3 || "",
        1200,
        globalLanguageData?.global?.label_nav_bar_item_4 || "",
        1200,
        globalLanguageData?.global?.label_nav_bar_item_5 || "",
        1200,
        globalLanguageData?.global?.label_nav_bar_item_6 || "",
        1200,
        globalLanguageData?.global?.label_nav_bar_item_7 || "",
        1200,
        globalLanguageData?.global?.label_nav_bar_item_8 || "",
        1200,
      ]}
      omitDeletionAnimation
      repeat={Infinity}
      className="text-[48px] font-medium text-center"
    />
  );
};

export default TypingText;
