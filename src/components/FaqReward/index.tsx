"use client";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import Loading from "../Loading";

const FaqReward = () => {
  const {
    data: footerLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.REWARD);

  const [openIndexes, setOpenIndexes] = useState(new Set<number>());

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) => {
      const newIndexes = new Set(prev);
      if (newIndexes.has(index)) {
        newIndexes.delete(index);
      } else {
        newIndexes.add(index);
      }
      return newIndexes;
    });
  };
  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;
  const faqs = [
    {
      question: footerLanguageData?.faq_join_rewards,
      answer: footerLanguageData?.faq_join_rewards_answer,
    },
    {
      question: footerLanguageData?.faq_more_points,
      answer: footerLanguageData?.faq_more_points_answer,
    },
    {
      question: footerLanguageData?.faq_benefits,
      answer: footerLanguageData?.faq_benefits_answer,
    },
    {
      question: footerLanguageData?.faq_expiration,
      answer: footerLanguageData?.faq_expiration_answer,
    },
  ];
  return (
    <div className="bg-white">
      <section
        className="w-3/5 bg-white mx-auto py-10 md:py-20 grid md:grid-cols-1 gap-5 items-center unicode-bidi-[isolate] max-w-full md:max-w-[980px] border-t border-gray-100"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div className="w-full mx-auto max-w-[980px] border-0 border-solid border-[#dadce8] box-border tab-[4] text-[100%]">
          <div>
            <h2 className="text-[2.25rem] font-bold mb-4 text-gray-900 text-center">
              {footerLanguageData?.section_faq}
            </h2>
          </div>
          <div className="border-b border-gray-200 last:border-b-0 py-4" />
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0 py-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-sm font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndexes.has(index) ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronUp className="text-[#CED0DB]" />
                </motion.div>
              </div>
              {openIndexes.has(index) && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-600 mt-2"
                >
                  {faq.answer}
                </motion.p>
              )}
            </div>
          ))}
          <div className="border-b border-gray-200 last:border-b-0 py-4" />
        </div>
      </section>
      <section className="bg-[#F6F7F8]  py-24 grid grid-container-desktop gap-y-12 pt-[4rem]">
        <div className="col-start-2 col-end-3 text-black">
          <h2 className="text-[20px] font-bold">
            {footerLanguageData?.section_terms_conditions}
          </h2>
          <p className="text-[16px]">
            1. {footerLanguageData?.terms_1}
            <br />
            2. {footerLanguageData?.terms_2}
            <br />
            3. {footerLanguageData?.terms_3}
          </p>
        </div>
      </section>
      <footer className="w-full bg-primary text-white">
        <div className="p-4 text-sm text-center">
          <p>© สงวนลิขสิทธิ์ บริษัทฟาสต์เวิร์ค เทคโนโลยีส์ จำกัด</p>
        </div>
      </footer>
    </div>
  );
};

export default FaqReward;
