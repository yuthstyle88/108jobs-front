import CategoryList from "@/components/CategoryList";
import Link from "next/link";

type CategoryItem = {
  title: string;
  new?: boolean;
};

const contentAndWriting: CategoryItem[] = [
  { title: "เขียนบทความ" },
  { title: "พิมพ์งาน และคีย์ข้อมูล" },
  { title: "ถอดเทป" },
  { title: "เขียนนิยาย / เรื่องสั้น" },
  { title: "เขียน SOP" },
  { title: "ตรวจ TurnItIn" },
];

const language: CategoryItem[] = [
  { title: "แปลภาษา" },
  { title: "ล่าม" },
  { title: "พิสูจน์อักษร" },
];


const other: CategoryItem[] = [{ title: "อื่นๆ" }];

const Write: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link href="#" className="px-2 text-[#485261]">เขียนและแปลภาษา</Link>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-y-4 absolute left-0 w-[630px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-10 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <CategoryList title="Content & Writing" items={contentAndWriting} />
        <CategoryList title="Language" items={language} />
        <CategoryList title="Marketing insight" items={other} />
      </div>
    </div>
  );
};

export default Write;
