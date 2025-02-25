import { StartSellingImage } from '@/constants/images';
import Image from 'next/image'
import React from 'react'

type Step = {
  number: number;
  title: string;
  description: React.ReactNode;
  image: string;
};

const steps: Step[] = [
  {
    number: 1,
    title: "สมัครเป็นฟรีแลนซ์",
    description: (
      <>
        ลงทะเบียนพร้อมเตรียมบัตรประชาชนและสมุดบัญชีสำหรับยืนยันตัวตนให้พร้อม
        จากนั้นคุณสามารถลงประกาศขายงานได้เลย ดูวิธีใช้{" "}
        <a href="#" className="text-blue-600 hover:underline">
          ตัวอย่างการสมัครเป็นฟรีแลนซ์
        </a>
      </>
    ),
    image: StartSellingImage.step1,
  },
  {
    number: 2,
    title: "ลงประกาศขายงาน",
    description:
      "เตรียมผลงานและคำอธิบายงาน เพื่อแสดงให้รู้ว่าจ้างเห็นถึงความสามารถของคุณ จากนั้นรอการตรวจสอบและอนุมัติจากทีมงานภายใน 48 ชั่วโมง",
    image: StartSellingImage.step2,
  },
  {
    number: 3,
    title: "เริ่มขายงานได้เลย",
    description: (
      <>
        ต้องศึกษา{" "}
        <a href="#" className="text-blue-600 hover:underline">
        &ldquo;เทคนิคนำร่องสำหรับฟรีแลนซ์&rdquo;
        </a>{" "}
        หรือใช้{" "}
        <a href="#" className="text-blue-600 hover:underline">
          &ldquo;Seller Center&rdquo;
        </a>{" "}
        เพื่อศึกษาวิธีเพิ่มโอกาสในการถูกจ้าง
      </>
    ),
    image: StartSellingImage.step3,
  },
  {
    number: 4,
    title: "ทำงานได้ทั่วจอ",
    description:
      "มั่นใจทุกการจ้างงาน Fastwork การันตีดูแลเงินคุณ หมดกังวลเรื่องผู้ว่าจ้างไม่ชำระเงิน ช่วยให้คุณทำงานได้อย่างสบายใจ",
    image: StartSellingImage.step4,
  },
  {
    number: 5,
    title: "ส่งงานและรีวิว",
    description:
      "ส่งผลงานที่ทำสำเร็จให้ผู้ว่าจ้างอนุมัติงาน ยิ่งทำงานดี ผู้ว่าจ้างรีวิวดี จะช่วยเพิ่มความน่าเชื่อถือของผลงาน เพิ่มโอกาสขายงานได้มากขึ้น",
    image: StartSellingImage.step5,
  },
  {
    number: 6,
    title: "รับเงินและสิทธิพิเศษ",
    description: (
      <> 
        Fastwork จะทําการโอนเงินเข้าบัญชีธนาคารของคุณตาม &ldquo;{" "}
        <a href="#" className="text-blue-600 hover:underline">
          เงื่อนไขการรับเงิน
        </a>{" "}
        &rdquo; ยิ่งขายงานได้{" "}
      </>
    ),
    image: StartSellingImage.step6,
  },
];

const Step = () => {
  return (
    <div className="grid-container-desktop w-full py-10 px-4 sm:px-6 lg:px-8">
        <div className="col-start-2 col-end-3">
          <div className="flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">
              6 ขั้นตอนง่ายๆ ขายงานบน Fastwork
            </h2>

            <div className="space-y-4 max-w-[800px] ">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center gap-2"
                >
                  <div className="">
                    <Image
                      src={step.image}
                      alt={`Step ${step.number}`}
                      className="max-w-[180px]"
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="text-xl font-semibold text-primary">
                      {step.number}. {step.title}
                    </h3>
                    <p className="mt-2 text-text_primary font-sans">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Step