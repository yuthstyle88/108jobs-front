import CategoryList from "@/components/CategoryList";

type CategoryItem = {
  title: string;
  new?: boolean;
};

const architecture: CategoryItem[] = [
  { title: "ออกแบบตกแต่งภายในและภายนอก" },
  { title: "3D Perspective" },
  { title: "ออกแบบภูมิทัศน์และตกแต่งสวน" },
  { title: "ออกแบบแสงสว่างNew", new: true },
];

const engineer: CategoryItem[] = [
  { title: "เขียนแบบวิศวกรรมและออกแบบโครงสร้าง" },
  { title: "ตรวจรับบ้านและคอนโด" },
];

const technician: CategoryItem[] = [
  { title: "รับเหมาก่อสร้าง" },
  { title: "รีโนเวทNew", new: true },
  { title: "ช่างไฟฟ้า" },
  { title: "ล้างแอร์" },
  { title: "ช่างประปา" },
  { title: "ช่างปูนNew", new: true },
  { title: "ช่างปูกระเบื้อง" },
  { title: "ช่างทาสีNew", new: true },
  { title: "ช่างล้างเครื่องซักผ้าNew", new: true },
  { title: "ช่างฝ้า" },
  { title: "ติดวอลเปเปอร์New", new: true },
];
const other: CategoryItem[] = [
  { title: "ที่ปรึกษาสร้างบ้าน" },
  { title: "อื่นๆ" },
];

const Architecture: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <a className="px-2 text-[#485261]">สถาปัตย์และวิศวกรรม</a>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-y-4 absolute left-0 w-[630px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-10 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <CategoryList title="Architecture" items={architecture} />
        <CategoryList title="Engineering" items={engineer} />
        <CategoryList title="Technician" items={technician} />
        <CategoryList title="Other" items={other} />
      </div>
    </div>
  );
};

export default Architecture;
