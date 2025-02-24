"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faFontAwesome } from "@fortawesome/free-regular-svg-icons";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";

const Promotion = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: "สำหรับการสร้างงาน", content: "ยังไม่มีสิทธิพิเศษในขณะนี้" },
    { name: "สำหรับฟรีแลนซ์", content: "ยังไม่มีสิทธิพิเศษในขณะนี้" },
  ];
  return (
    <>
      {/* <CategoryDetail /> */}
      <main>
        <section
          className="flex items-center justify-center w-full h-[200px]"
          style={{ background: "linear-gradient(282deg, #27c8f8, #1850c2)" }}
        >
          <div className="px-[1.5rem] relative">
            <div className="text-center text-white">
              <h1 className="text-[28px]">สิทธิพิเศษและโปรโมชัน</h1>
              <p className="text-[16px]">
                จากทาง fastwork และพาร์ทเนอร์ที่เข้าร่วม
              </p>
            </div>
          </div>
        </section>
        <section className="py-24 grid grid-container-desktop gap-y-12 pt-[4rem]">
          {" "}
          <div className="col-start-2 col-end-3">
            <h2 className="text-[1.75rem] text-black">คูปองส่วนลดของคุณ </h2>
            <p className="text-[20px] text-gray-500">
              คุณสามารถเลือกใช้คูปองต่าง ๆ ได้ เมื่อทำการจ้างงานและชำระเงิน
            </p>
          </div>
          <div className=" flex col-start-2 col-end-3 py-[8rem] justify-center items-center">
            <div className="grid-cols-1 items-center justify-center text-center">
              <div className="flex justify-center items-center">
                <FontAwesomeIcon icon={faClipboard} className="text-black" />
              </div>
              <div className="text-gray-700 mt-2">คุณยังไม่มีคูปองส่วนลด</div>
            </div>
          </div>
          <div className="col-start-2 col-end-3 border-t border-gray-300 mt-8"></div>
        </section>
        <section className="py-24 grid grid-container-desktop gap-y-12 pt-[4rem]">
          <div className="col-start-2 col-end-3">
            <h2 className="text-[1.75rem] text-black">สิทธิพิเศษที่น่าสนใจ </h2>
            <p className="text-[20px] text-gray-500">
              สิทธิพิเศษและส่วนลดจากพาร์ทเนอร์ พร้อมให้คุณเก็บคูปองส่วนลดแล้ว
            </p>
          </div>
          <div className="col-start-2 col-end-3">
            <div className="flex border-b border-gray-300">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`${
                    selectedTab === index
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                  } py-2 px-4 text-lg font-medium`}
                  onClick={() => setSelectedTab(index)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="mt-[5rem] flex justify-center items-center">
              <div className="grid-cols-1 items-center justify-center text-center">
                <FontAwesomeIcon icon={faFontAwesome} className="text-black" />

                <p className="text-gray-700 mt-2">
                  {tabs[selectedTab].content}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Promotion;
