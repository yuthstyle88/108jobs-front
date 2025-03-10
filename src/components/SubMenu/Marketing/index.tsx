import CategoryList from "@/components/CategoryDetail/components/CategoryList";
import Link from "next/link";

type CategoryItem = {
  title: string;
  new?: boolean;
};

const onlineMedia: CategoryItem[] = [
  { title: "โปรโมทเพจ / เว็บ" },
  { title: "ทำ SEO" },
  { title: "Social Media Ads" },
  { title: "Creative & Content Marketing" },
  { title: "PR ประชาสัมพันธ์" },
  { title: "Google ads & Youtube ads" },
  { title: "Google Map & My Business" },
  { title: "เขียนรีวิว" },
  { title: "โปรโมทอสังหาฯ" },
  { title: "ออกแบบริชเมนู" },
  { title: "Email Marketing" },
  { title: "สร้าง Linktree" },
];
const influencer: CategoryItem[] = [
  { title: "Influencer Marketing Plan" },
  { title: "เน็ตไอดอลและบล็อกเกอร์รีวิว" },
  { title: "Gamecaster" },
];

const marketingInsight: CategoryItem[] = [
  { title: "ทำแบบสอบถาม" },
  { title: "Focus Group" },
  { title: "Tracking Data" },
];

const marketingStrategy: CategoryItem[] = [
  { title: "การตลาด" },
  { title: "Branding" },
];

const onlineStoreAndSales: CategoryItem[] = [
  { title: "เปิดร้านค้าออนไลน์และลงสินค้า" },
  { title: "แอดมินดูแลเพจ เว็บไซต์ และร้านค้าออนไลน์" },
  { title: "Callcenter / Telesale" },
  { title: "พนักงานขาย" },
];

const other: CategoryItem[] = [{ title: "อื่นๆ" }];

const Marketing: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link href="#" className="px-2 text-[#485261]">การตลาดและโฆษณา</Link>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-y-4 absolute left-0 w-[630px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-50 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <CategoryList title="Online media" items={onlineMedia} />
        <CategoryList title="Influencer" items={influencer} />
        <CategoryList title="Marketing insight" items={marketingInsight} />
        <CategoryList title="Marketing Strategy" items={marketingStrategy} />
        <CategoryList title="Online Store & Sales" items={onlineStoreAndSales} />
        <CategoryList title="Other" items={other} />
      </div>
    </div>
  );
};

export default Marketing;
