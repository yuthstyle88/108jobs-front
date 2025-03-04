
import Link from 'next/link';
import { useState } from 'react';

interface PackageInfo {
  price: string;
  title: string;
  description: string;
}

const AsideJob = () => {
  const [selectedPackage, setSelectedPackage] = useState(0);

  const packages: PackageInfo[] = [
    {
      price: "฿1,600",
      title: "แพ็กเกจ: เพิ่ม Traffic 30 วัน ดันอันดับ เร่ง Index",
      description: "Traffic Package ทุก Package Traffic ทำงาน 30 วันค่ะ Traffic Package 6,000 Traffic View เหมาะสำหรับเว็บคู่แข่งน้อย 1,600 บาท 1 Link 1 Keyword"
    },
    {
      price: "฿2,600",
      title: "แพ็กเกจ: Traffic + Backlink Offpage SEO mix ขั้นเทพ ออกแบบตามความต้องการ ดันหน้า 1",
      description: "สูตรที่ 1 ทำ SEO ระดับความยากสี่ ชุดเริ่มต้น Keyword ลูกน้อย เว็บใหม่ เว็บต้องการตั้งตัว..."
    },
    {
      price: "฿3,600",
      title: "แพ็กเกจ: Backlink Package ดันอันดับ เร่ง Index",
      description: "Backlink Package ใช้เวลาทำงานไม่เกิน 5 วันคะ QUALITY BLOG COMMENTS เหมาะสำหรับ..."
    }
  ];

  return (
    <div className="rounded-md overflow-hidden mt-4 shadow-jobCard">
      <section className="grid-cols-[1fr_1fr_1fr] grid min-w-0 min-h-0">
        {packages.map((pkg, index) => (
          <div 
            key={index}
            className={`relative ${selectedPackage === index ? 'bg-white text-[#1a73e8]' : 'bg-[#F6F7F8] text-[#8793a6]'} py-5 text-center cursor-pointer ${index === 0 ? 'rounded-tl-md' : ''} ${index === 2 ? 'rounded-tr-md' : ''}`}
            onClick={() => setSelectedPackage(index)}
          >
            <strong>{pkg.price}</strong>
          </div>
        ))}
      </section>
      <section className="p-6 bg-white">
        <h3 className="font-medium text-[#1a73e8]">
          {packages[selectedPackage].title}
        </h3>
        <p className="line-clamp-2 text-ellipsis overflow-hidden break-words mt-2 text-[0.875rem] text-text_secondary font-sans">
          {packages[selectedPackage].description}
        </p>
        <Link
          href=""
          className="text-[#1a73e8] mt-2 font-semibold text-[0.875rem] cursor-pointer font-sans block"
        >
          ดูข้อมูลแพ็กเกจ
        </Link>
        <hr className="mt-4 bg-[#e4e9f2] block overflow-visible w-full h-[1px] m-0" />
        <div className="mt-4 mb-4">
          <div className="gap-[0.5em] items-center justify-between flex text-[0.875rem]">
            <label
              htmlFor="company-payment"
              className="font-medium text-[0.875rem] text-[#6d7582]"
            >
              สนใจจ้างในนามบริษัท
            </label>
            <input
              name="company-payment"
              type="checkbox"
              className="w-[1.375em] h-[1.375em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-md bg-transparent cursor-pointer checked:border-[#1a73e8] checked:bg-[#1a73e8]"
            />
          </div>
        </div>
        <button className="relative inline-flex justify-center items-center overflow-hidden min-h-[2.5rem] px-[1.125rem] border-none rounded-[0.25rem] bg-[#1a73e8] text-[0.875rem] font-medium w-full text-white">
          <span>ทักแชทฟรีแลนซ์</span>
        </button>
        <div className="text-center mt-2">
          <small className="text-[0.75rem] text-[#6d7582]">
            คุณจะยังไม่เสียค่าใช้จ่าย
          </small>
        </div>
      </section>
    </div>
  );
};

export default AsideJob;
