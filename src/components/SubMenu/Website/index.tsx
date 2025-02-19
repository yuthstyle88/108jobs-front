import CategoryList from "@/components/CategoryList";
import Link from "next/link";

type CategoryItem = {
  title: string;
  new?: boolean;
};

const webDevelopment: CategoryItem[] = [
  { title: "Web Development" },
  { title: "Wordpress" },
  { title: "Chatbot" },
  { title: "พัฒนาเกม (Game Development)" },
];

const technical: CategoryItem[] = [
  { title: "IT Solution และ Support" },
  { title: "ทำโปรเจค IoT" },
  { title: "Website Scraping" },
  { title: "IT Project Management" },
  { title: "Quality Assurance" },
  { title: "ทำแผนที่ GIS", new: true },
];
const design: CategoryItem[] = [
  { title: "UX/UI Design for Web & App" },
];

const data: CategoryItem[] = [
  { title: "วิเคราะห์ดาต้า" },
  { title: "Data Science & AI" },
  { title: "Data Engineering" },
  { title: "Data Labeling" },
];

const application: CategoryItem[] = [
  { title: "Mobile Application" },
  { title: "Desktop Application" },
];

const other: CategoryItem[] = [
  { title: "สร้างเหรียญ Crypto", new: true },
  { title: "อื่นๆ" },
];

const Website: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link href="#" className="px-2 text-[#485261]">เว็บไซต์และเทคโนโลยี</Link>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-y-4 absolute left-0 w-[625px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-10 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <CategoryList title="Website Development" items={webDevelopment} />
        <CategoryList title="Design" items={design} />
        <CategoryList title="Application" items={application} />
        <CategoryList title="Technical" items={technical} />
        <CategoryList title="Data" items={data} />
        <CategoryList title="Other" items={other} />
      </div>
    </div>
  );
};

export default Website;
