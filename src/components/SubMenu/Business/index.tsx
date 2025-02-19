import CategoryList from "@/components/CategoryDetail/components/CategoryList";
import Link from "next/link";

type CategoryItem = {
  title: string;
  new?: boolean;
};

const selfImprovement: CategoryItem[] = [
  { title: "นักจิตวิทยา" },
  { title: "พัฒนาตนเอง" },
  { title: "ที่ปรึกษาปัญหาชีวิต" },
];


const businessAndFinance: CategoryItem[] = [
  { title: "กฎหมาย" },
  { title: "ปรึกษาธุรกิจ & Startup" },
  { title: "ทำบัญชีและยื่นภาษี" },
  { title: "เลขาส่วนตัว" },
  { title: "AI Consultant" },
  { title: "จัดหาพนักงาน", new: true },
  { title: "จดทะเบียนการค้า" },
  { title: "สั่งสินค้าจากจีน" },
  { title: "ระบบสต๊อกสินค้า", new: true },
  { title: "จดทะเบียนบริษัท" },
  { title: "วางแผนการเงิน" },
  { title: "จดทะเบียน อย." },
  { title: "วางแผนภาษี", new: true },
  { title: "จดทะเบียนห้างหุ้นส่วน" },
  { title: "จดทะเบียนภาษีมูลค่าเพิ่ม" },
  { title: "จดทะเบียนรถยนต์" },
  { title: "ระบบจัดการออเดอร์", new: true },
  { title: "ตรวจสอบบัญชี", new: true },
  { title: "Dropship", new: true },
  { title: "ทำภาษี ยื่นภาษี", new: true },
];

const oem: CategoryItem[] = [
  { title: "ผลิตเสื้อผ้า" },
  { title: "ผลิตเครื่องสำอาง" },
  { title: "ผลิตสกินแคร์" },
  { title: "ผลิตอาหารเสริม" },
  { title: "ผลิตของพรีเมี่ยม" },
  { title: "ผลิตกระเป๋า" },
];


const other: CategoryItem[] = [
  { title: "นักสืบ" },
  { title: "อื่นๆ" },
  { title: "นายหน้า", new: true },
];

const Business: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link href="#" className="px-2 text-[#485261]">ธุรกิจและที่ปรึกษา</Link>
      <div className="grid grid-cols-[1fr_1fr_1fr] max-h-sub-menu overflow-auto gap-y-4 absolute right-0 w-[670px] opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-10 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <CategoryList title="Self improvement" items={selfImprovement} />
        <CategoryList title="Business & Finance" items={businessAndFinance} />
        <CategoryList title="OEM" items={oem} />
        <CategoryList title="Other" items={other} />
      </div>
    </div>
  );
};


export default Business;
