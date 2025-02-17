import GraphicDesign from "./GraphicDesign";
import PopularType from "./PopularType";

type Props = {};

const popular_job = [
  {
    title: "ทำ SEO",
  },
  {
    title: "Logo",
  },
  {
    title: "Web Development",
  },
  {
    title: "เขียนแบบวิศวกรรมและออกแบบโครงสร้าง",
  },
  {
    title: "ช่างทำเล็บNew",
  },
  {
    title: "ดูดวง โหราศาสตร์ ความเชื่อ",
  },
  {
    title: "แม่บ้าน ทำความสะอาด",
  },
  {
    title: "ล้างแอร์",
  },
];

const SubMenu = (props: Props) => {
  return (
    <div className="shadow-categoryMenu relative">
      <nav className="flex justify-center px-2 h-[3.5rem] text-text_primary bg-white">
        <div className="grid grid-flow-col gap-x-3 cursor-pointer">
          <PopularType />
          <GraphicDesign />
          <div className="relative flex items-center justify-center group">
            <a className="px-2 text-[#485261] ">สถาปัตย์และวิศวกรรม</a>
          </div>
          <div className="relative flex items-center justify-center group">
            <a className="px-2 text-[#485261] ">เว็บไซต์และเทคโนโลยี</a>
          </div>
          <div className="relative flex items-center justify-center group">
            <a className="px-2 text-[#485261] ">การตลาดและโฆษณา</a>
          </div>
          <div className="relative flex items-center justify-center group">
            <a className="px-2 text-[#485261] ">เขียนและแปลภาษา</a>
          </div>
          <div className="relative flex items-center justify-center group">
            <a className="px-2 text-[#485261] ">ภาพและเสียง</a>
          </div>
          <div className="relative flex items-center justify-center group">
            <a className="px-2 text-[#485261] ">ธุรกิจและที่ปรึกษา</a>
          </div>
          <div className="relative flex items-center justify-center group">
            <a className="px-2 text-[#485261] ">ไลฟ์สไตล์</a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SubMenu;
