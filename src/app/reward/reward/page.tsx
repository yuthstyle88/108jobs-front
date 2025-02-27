"use client";
import { BannerImage, RewardImage } from "@/constants/images";
import Image from "next/image";
import { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";
import CouponCard from "@/components/CouponCard/CouponCard";

interface CouponData {
  id: number;
  value: number;
  isHotDeal?: boolean;
  points: number;
}

const coupons: CouponData[] = [
  { id: 1, value: 50, points: 50 },
  { id: 2, value: 100, points: 90 },
  { id: 3, value: 300, points: 300 },
  { id: 4, value: 500, points: 500 },
  { id: 5, value: 1000, points: 1000 },
  { id: 6, value: 3000, points: 3000 },
  { id: 7, value: 5000, points: 5000 },
];

const EarnPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeButton, setActiveButton] = useState(0);
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

  const faqs = [
    {
      question:
        "จะเข้าร่วมโปรแกรม fastwork rewards เพื่อรับสิทธิประโยชน์ได้อย่างไร?",
      answer:
        "เพียงเข้าสู่ระบบ fastwork และไปที่หน้า “ทำภารกิจ” เพื่อเริ่มสะสมคะแนน และแลกของรางวัลสุดพิเศษได้ทันที หากพบปัญหาในการเข้าใช้งาน กรุณาติดต่อศูนย์ช่วยเหลือของเรา.",
    },
    {
      question: "อยากได้ Point เพิ่มใน fastwork rewards ต้องทำยังไงบ้าง?",
      answer:
        "ทำกิจกรรมที่ระบุไว้ในหน้าภารกิจ เช่น เข้าสู่ระบบ และ check-in ในหน้า rewards เป็นประจำทุกวัน พิเศษสำหรับฟรีแลนซ์! รับงานผ่านระบบ fastwork ทุก 320 บาท จะได้รับ 1 point จากงานที่ผู้ว่าจ้างอนุมัติ",
    },
    {
      question: "สิทธิประโยชน์จากโปรแกรม fastwork rewards มีอะไรบ้าง??",
      answer:
        "ตัวอย่างสิทธิประโยชน์จากโปรแกรม fastwork rewards: เงินคืน (Cashback) สำหรับฟรีแลนซ์ ส่วนลดพิเศษสำหรับใช้ในการจ้างงาน ของรางวัลพิเศษ คูปองส่วนลดจากพาร์ทเนอร์ สิทธิพิเศษ ในการเข้าร่วมกิจกรรมต่างๆ ของ fastwork และอื่นๆ อีกมากมาย หมายเหตุ: สิทธิประโยชน์อาจมีการปรับเปลี่ยนตามช่วงเวลา เพื่อให้สอดคล้องกับความต้องการของผู้ใช้งาน.",
    },
    {
      question: "Point ในโปรแกรม fastwork rewards มีวันหมดอายุหรือไม่?",
      answer:
        "Fastwork Points มีอายุ 3 เดือน นับจากวันที่ได้รับ และจะหมดอายุสิ้นเดือนที่ 3 (ตัวอย่าง: หากได้รับ Points ในเดือนมกราคม จะหมดอายุวันที่ 30 เมษายน) เมื่อคุณแลกรางวัล ระบบจะใช้ Points ที่ใกล้หมดอายุก่อนโดยอัตโนมัติ",
    },
  ];

  return (
    <>
      <section className="relative">
        <div className="bg-white absolute top-0 right-0 bottom-0 left-0 flex w-full h-[200px]">
          <div className="flex-shrink-0 h-full">
            <Image
              src={BannerImage.left}
              className="h-full w-auto object-cover"
              alt="left"
            />
          </div>

          <div className="flex-grow flex justify-center h-full">
            <Image
              src={BannerImage.center}
              className="h-full w-auto object-cover"
              alt="center"
            />
          </div>
          <div className="flex-shrink-0 h-full ml-auto">
            <Image
              src={BannerImage.right}
              className="h-full w-auto object-cover"
              alt="right"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 flex justify-center items-center h-[200px] text-black">
          <div className="flex flex-col justify-center items-center text-center">
            <div className="text-[20px] font-[500] leading-[23px]">
              Point ของคุณ
            </div>
            <div className="flex items-center">
              <Image
                src={RewardImage.point}
                alt="point"
                className="w-[2rem] mr-2"
              />
              <div className="text-[28px] font-[600] leading-[46.2px] text-[rgb(29,108,226)]">
                0.00
              </div>
            </div>
            <div className="text-[14px] font-[400] leading-[16.1px] text-[rgba(43,50,59,0.6)]">
              ≈ 0.00 บาท
            </div>
            <div className="text-[14px] font-[400] leading-[16.1px] text-[rgba(43,50,59,0.6)]">
              0.00 points จะหมดอายุวันที่ 28/02/2025
            </div>
          </div>
        </div>
      </section>
      <section className="pt-[200px]">
        <div
          className="flex justify-center items-center h-[135px] px-4 pt-0 pr-4 pb-0 pl-4 bg-[hsl(216,85%,94%)]"
          style={{
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            borderTopLeftRadius: "50% 100%",
            borderTopRightRadius: "50% 100%",
            borderBottomRightRadius: "0px",
          }}
        >
          {" "}
          <div className="flex space-x-8">
            <div
              className={`text-[20px] font-normal cursor-pointer ${
                activeTab === 0
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(0)}
            >
              สะสม Point
            </div>
            <div
              className={`text-[20px] font-normal cursor-pointer ${
                activeTab === 1
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(1)}
            >
              แลกของรางวัล
            </div>
            <div
              className={`text-[20px] font-normal cursor-pointer ${
                activeTab === 2
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(2)}
            >
              ประวัติการใช้งาน
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[hsl(216,85%,94%)] py-24 grid grid-container-desktop gap-y-12 pt-[4rem]">
        <div className="col-start-2 col-end-3">
          <div className="flex">
            <div className="h-[40px] w-[5px] bg-blue-600 mr-2 " />
            <div className="text-[31px] font-semibold text-black">
              รายการของรางวัล{" "}
            </div>
          </div>
          <div className="flex justify-left space-x-4 py-8">
            <button
              className={`py-2 px-6 rounded-full ${
                activeButton === 0
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-600"
              }`}
              onClick={() => setActiveButton(0)}
            >
              รางวัลทั้งหมด{" "}
            </button>
            <button
              className={`py-2 px-6 rounded-full ${
                activeButton === 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-600"
              }`}
              onClick={() => setActiveButton(1)}
            >
              สำหรับการจ้างงาน{" "}
            </button>
          </div>
          <div className="text-[24px] font-[500] leading-[27.6px] text-[rgb(29,108,226)] pt-8">
            ทั่วไป
          </div>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coupons.map((coupon, index) => (
                <CouponCard
                  key={coupon.id}
                  id={coupon.id}
                  value={coupon.value}
                  points={coupon.points}
                  isHotDeal={coupon.isHotDeal}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <section
        className="w-3/5 bg-white mx-auto py-10 md:py-20 grid md:grid-cols-1 gap-5 items-center unicode-bidi-[isolate] max-w-full md:max-w-[980px] border-t border-gray-100"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div className="w-full mx-auto max-w-[980px] border-0 border-solid border-[#dadce8] box-border tab-[4] text-[100%]">
          <div>
            <h2 className="text-[2.25rem] font-bold mb-4 text-gray-900 text-center">
              คำถามที่พบบ่อย
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
      <section className="bg-gray-200  py-24 grid grid-container-desktop gap-y-12 pt-[4rem]">
        <div className="col-start-2 col-end-3 text-black">
          <h2 className="text-[20px] font-bold">เงื่อนไขและข้อตกลง</h2>
          <p className="text-[16px]">
            1. การแลกเปลี่ยนส่วนลด รางวัล หรือสิทธิพิเศษใดๆ
            ถือเป็นการสิ้นสุดเมื่อทำการแลกเปลี่ยน และไม่สามารถขอคืนหรือแลกได้
            <br />
            2. เพื่อให้ท่านได้รับประโยชน์สูงสุดจากโปรแกรม Fastwork Rewards
            โปรดตรวจสอบวันหมดอายุของคะแนนสะสมเป็นประจำ
            และใช้สิทธิ์แลกคะแนนรางวัลนั้นภายในเวลาที่กำหนด
            <br />
            3. Fastwork ขอสงวนสิทธิ์ในการกำหนด และปรับเปลี่ยนเงื่อนไขต่างๆ
            ของโปรแกรม Fastwork Rewards รวมถึงการแลกรางวัล
            โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
          </p>
        </div>
      </section>
      <footer className="w-full bg-blue-700 text-white">
        <div className="p-4 text-sm text-center">
          <p>© สงวนลิขสิทธิ์ บริษัทฟาสต์เวิร์ค เทคโนโลยีส์ จำกัด</p>
        </div>
      </footer>
    </>
  );
};

export default EarnPage;
