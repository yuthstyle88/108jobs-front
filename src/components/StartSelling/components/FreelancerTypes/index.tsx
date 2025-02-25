import { StartSellingImage } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";

type FreelancerType = {
  title: {
    main: string;
    sub: string;
  };
  image: string;
  badgeText?: string;
  badgeClass?: string;
  description: string;
  benefits: string[];
};

const freelancerTypes: FreelancerType[] = [
  {
    title: {
      main: "Fastwork Freelancer",
      sub: "ฟรีแลนซ์",
    },
    image: StartSellingImage.compare1,
    description:
      "สมัครได้เลยวันนี้ แสดงรายละเอียดของคุณ เป็นฟรีแลนซ์ ได้ภายใน 48 ชั่วโมง",
    benefits: [
      "ลงงานได้ตามความถนัด",
      "ช่วงราคาสามารถกำหนดเองได้ตามความเหมาะสมของงาน",
      "Fastwork support",
      "ระบบใบนัดหมาย, สร้างใบเสนอราคาและแบบฟอร์ม",
      "ใบเสร็จพิเศษ Freelancer",
    ],
  },
  {
    title: {
      main: "Fastwork Specialist",
      sub: "ผู้เชี่ยวชาญ",
    },
    image: StartSellingImage.compare2,
    badgeClass: "bg-blue-100 text-blue-600",
    description:
      "ผู้เชี่ยวชาญที่ผ่านการทดสอบความสามารถตาม สาขาอาชีพและบริการภายในของ Fastwork",
    benefits: [
      "ใช้สิทธิขอคำปรึกษาโดยตรงกับทีมแอดฯ",
      "โอกาสพิเศษรับงานจาก Partner ของเรา",
      "Badge ที่เเสดงว่าเป็น ผู้เชี่ยวชาญ ซึ่งบริการจาก Fastwork ช่วยให้คุณจ้างงานที่คุณได้อย่างมั่น",
      "ใบนัดที่เเสดงสำหรับ ผู้เชี่ยวชาญ",
      "Event ที่เเสดงสำหรับ ผู้เชี่ยวชาญ ระดับ Top",
      "ผู้ช่วยเหลือพิเศษ (Personal Assistant) สำหรับ ผู้เชี่ยวชาญ",
    ],
  },
  {
    title: {
      main: "Fastwork Professional",
      sub: "ผู้เชี่ยวชาญระดับ Professional",
    },
    image: StartSellingImage.compare3,
    badgeClass: "bg-blue-600 text-white",
    description:
      "ผู้เชี่ยวชาญมากหน้าที่ได้รับการคัดเลือกจาก Fastwork จากผลงานและประสบการณ์ในสาขาอาชีพของรายงาน",
    benefits: [
      "ใช้สิทธิขอคำปรึกษาโดยตรงผู้เชี่ยวชาญ",
      "Badge ที่เเสดงสำหรับ Professional ผู้เชี่ยวชาญ Fastwork ช่วยให้คุณจ้างงานที่คุณได้อย่างมั่น",
      "โอกาสในการได้รับงานมากยิ่งขึ้น จากลูกค้าองค์กรชั้นนำของ Fastwork",
      "ใบนัดที่เเสดงสำหรับ Professional",
    ],
  },
];

const FreelancerTypes = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-primary mb-12">
        Fastwork มี Freelance แบบไหนบ้าง?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {freelancerTypes.map((type, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-jobCard p-6 border border-gray-200"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-primary">
                {type.title.main}
              </h3>
              <p className="text-gray-500">{type.title.sub}</p>
            </div>

            <div className="aspect-video pb-6 flex items-center justify-center">
              <Image
                src={type.image}
                alt={type.title.main}
                className="w-[193px] h-full object-cover"
              />
            </div>

            <p className="text-gray-600 mb-6">{type.description}</p>

            <ul className="space-y-3">
              {type.benefits.map((benefit, benefitIndex) => (
                <li key={benefitIndex} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-third mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-2 text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid-container-desktop w-full pt-[64px]">
        <div className="col-start-2 col-end-3 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">
            สมัครเป็นฟรีแลนซ์บน Fastwork เลย
          </h2>
          <Link href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              สมัครเป็นฟรีแลนซ์
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FreelancerTypes;
