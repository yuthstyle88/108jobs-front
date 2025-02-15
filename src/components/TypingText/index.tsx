"use client";

import { TypeAnimation } from "react-type-animation";

const TypingText = () => {
  return (
    <TypeAnimation
      sequence={[
        "ออกแบบกราฟิก",
        1200,
        "สถาปัตย์และวิศวกรรม",
        1200,
        "เว็บไซต์และเทคโนโลยี",
        1200,
        "การตลาดและโฆษณา",
        1200,
        "เขียนและแปลภาษา",
        1200,
        "ภาพและเสียง",
        1200,
        "ธุรกิจและที่ปรึกษา",
        1200,
      ]}
      omitDeletionAnimation
      repeat={Infinity}
      className="text-[48px] font-medium text-center"
    />
  );
};

export default TypingText;
