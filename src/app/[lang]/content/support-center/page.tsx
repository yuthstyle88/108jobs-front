"use client";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/Accordion";
import {Button} from "@/components/ui/Button";
import {AssetIcon, ContentIcon} from "@/constants/icons";
import Image from "next/image";

const SupportCenter = () => {
  const faqData = [
    {
      question: "ฉันจะจ้างฟรีแลนซ์ผ่าน 108jobs ได้อย่างไร?",
      answer: [
        "1. พูดคุยกับฟรีแลนซ์และหารือเกี่ยวกับรายละเอียดงาน (ในขั้นตอนนี้คุณยังไม่ถูกเรียกเก็บเงิน)",
        "2. แจ้งให้ฟรีแลนซ์ออกใบเสนอราคา",
        "3. ชำระเงินผ่านระบบเพื่อยืนยันการเริ่มต้นงาน (ระบบจะคุ้มครองการชำระเงินของคุณ)",
        "4. ตรวจสอบและอนุมัติงาน",
      ],
      note: "หมายเหตุ: การชำระเงินในระบบจะได้รับการคุ้มครองโดย 108jobs ดูเพิ่มเติมที่ 108jobs Guarantee",
    },
    {
      question: "ฉันจะจ้างงานในนามบริษัทได้อย่างไร?",
      answer: [
        "1. ให้ข้อมูลบริษัทเพื่อออกเอกสารที่หน้า จ้างงานในนามบริษัท",
        "2. รอการอนุมัติภายใน 2 ชั่วโมง",
        "3. หลังได้รับการอนุมัติ แจ้งให้ฟรีแลนซ์ออกเอกสารผ่านแชททันที",
      ],
    },
    {
      question: "ฉันจะหาฟรีแลนซ์ได้อย่างไร?",
      answer: [
        "1. เพิ่ม @fastwork คลิกเพื่อเพิ่มไลน์",
        "2. เลือกบริการแชทเพื่อจ้างงาน (ผู้ช่วยหาฟรีแลนซ์)",
        "3. แจ้งรายละเอียดให้แอดมินทันที",
      ],
    },
  ];
  return (
    <>
      <main>
        <section
          className="flex items-center justify-center w-full h-[200px] relative overflow-hidden"
          style={{background: "linear-gradient(282deg, #27c8f8, #1850c2)"}}
        >
          <div className="px-[1.5rem] relative">
            <div className="text-center text-white">
              <h1 className="text-[28px]">Frequently Asked Questions</h1>
              <p className="text-[16px]">Get answers to common questions</p>
            </div>
          </div>
          <div className="absolute right-[-100px] bottom-[150px] h-[150px] ml-auto opacity-30 pointer-events-none">
            <Image
              src={AssetIcon.logoIcon}
              alt="Logo"
              width={350}
              height={350}
            />
          </div>
        </section>
        <section className="py-24 grid grid-container-content pt-[4rem]">
          <div className="col-start-2 col-end-3 flex flex-row items-start gap-6 p-4 md:p-0">
            <div className="px-6 w-full">
              <div className="text-center mb-12">
                <h1 className="font-sans text-[1.5rem] text-text-primary font-semibold mb-4">
                  คำถามที่พบบ่อย
                </h1>
                <div className="w-20 h-[2px] rounded-full bg-blue-500 mx-auto"></div>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-gray-200 rounded-lg"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                      <span className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-3">
                        {faq.answer.map((step, stepIndex) => (
                          <p key={stepIndex} className="text-gray-700">
                            {step}
                          </p>
                        ))}
                        {faq.note && (
                          <p className="text-gray-600 italic mt-4">
                            {faq.note}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="text-center mt-8">
                <button className="text-gray-600 hover:text-primary flex items-center mx-auto">
                  ดูคำถามทั้งหมด →
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="grid grid-container-content pt-[1rem] bg-[#FBFBFC]">
          <div className="col-start-2 col-end-3 flex flex-row items-start gap-6 p-4 md:p-0 bg-[#FBFBFC]">
            <div className="bg-gray-50 py-16 mt-2">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h1 className="font-sans text-[1.5rem] text-text-primary font-semibold mb-4">
                    ติดต่อเรา
                  </h1>
                  <div className="w-20 h-[2px] rounded-full bg-blue-500 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {/* Support Center */}
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      ศูนย์ช่วยเหลือ
                    </h3>
                    <p className="text-gray-600 mb-6">
                      ต้องการความช่วยเหลือ? เรายินดีให้บริการคุณ
                    </p>
                    <Button className="bg-primary hover:bg-[#063a68] text-white px-6 py-2 rounded-md mb-6">
                      💬 แชทกับเรา
                    </Button>
                    <p className="text-sm text-gray-500">
                      วันจันทร์-ศุกร์ 9:30-22:00 / เสาร์-อาทิตย์
                      และวันหยุดนักขัตฤกษ์ 10:00-19:00
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                  {/* Contact via Email */}
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      ติดต่อทางอีเมล
                    </h3>
                    <p className="text-gray-600 mb-6">
                      ทีมงานจะตอบกลับภายใน{" "}
                      <span className="text-primary">24 ชั่วโมง</span>
                    </p>
                    <Button className="text-third bg-white border-1 border-gray-300 hover:bg-blue-50 px-6 py-2 rounded-md">
                      ส่งอีเมลถึงเรา
                    </Button>
                  </div>
                  {/* Call */}
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      โทรหาเรา
                    </h3>
                    <p className="text-primary font-semibold text-lg mb-4">
                      02-114-7008
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      วันจันทร์-ศุกร์ เวลา 9:30-11:30 และ 13:00-16:00
                    </p>
                    <p className="text-sm text-gray-500">
                      ปิดให้บริการวันเสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์
                    </p>
                  </div>
                </div>

                {/* Add Line Section */}
                <div className="bg-white rounded-lg p-8 shadow-sm mt-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      ให้เราช่วยหาฟรีแลนซ์ เพียงแค่เพิ่มไลน์
                    </h3>
                    <p className="text-gray-600 mb-4">
                      บริการแชทเพื่อจ้างงาน หรือผู้ช่วยหาฟรีแลนซ์
                    </p>
                    <Button className="text-third bg-white border-1 border-gray-300 px-6 py-2 rounded-md">
                      เพิ่ม @fastwork
                    </Button>
                  </div>
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src={ContentIcon.qr}
                      alt="Line Icon"
                      width={96}
                      height={96}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SupportCenter;
