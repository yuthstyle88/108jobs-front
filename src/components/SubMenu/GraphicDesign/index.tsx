type CategoryItem = {
  title: string;
  new?: boolean;
};

const graphic: CategoryItem[] = [
  { title: "Logo" },
  { title: "Banner โฆษณา" },
  { title: "Label & Packaging" },
  { title: "สื่อสิ่งพิมพ์และนามบัตร" },
  { title: "ออกแบบ CI" },
  { title: "Presentation" },
  { title: "ทำโมเดล 3D" },
  { title: "ไดคัท & Photoshop" },
  { title: "Portfolio & Resume" },
  { title: "Infographics" },
  { title: "Art & Craft" },
  { title: "ทำ Giveaway" },
  { title: "ออกแบบบอร์ดเกม" },
  { title: "ทำ Art Toy" },
  { title: "ทำวอลเปเปอร์โทรศัพท์" },
  { title: "ทำ FilterNew", new: true },
  { title: "ออกแบบ QR CodeNew", new: true },
  { title: "ทำ CanvaNew", new: true },
  { title: "ออกแบบเหรียญรางวัลNew", new: true },
  { title: "รับทำตรายางNew", new: true },
];

const art: CategoryItem[] = [
  { title: "วาดภาพประกอบ" },
  { title: "วาด/ออกแบบแพทเทิร์นเสื้อผ้า" },
  { title: "ออกแบบ LINE Sticker" },
  { title: "ออกแบบ Character & Mascot" },
  { title: "วาดภาพการ์ตูน" },
  { title: "วาดภาพเหมือน Portrait" },
  { title: "ภาพประกอบเวกเตอร์" },
  { title: "ออกแบบสติ๊กเกอร์" },
  { title: "วาดแผนที่" },
  { title: "เปลี่ยนรูปเป็นเวกเตอร์" },
  { title: "ตัวละครเกมและฉาก" },
  { title: "วาด/ออกแบบสตอรี่บอร์ด" },
  { title: "ออกแบบลายสัก แทททู" },
  { title: "วาดภาพล้อเลียน" },
  { title: "วาดแฟนอาร์ต" },
  { title: "NFT Art" },
  { title: "เพ้นท์ผนัง" },
  { title: "ออกแบบตัวอักษรNew", new: true },
];

const printing: CategoryItem[] = [
  { title: "สกรีนเสื้อผ้า" },
  { title: "ผลิตป้าย" },
  { title: "ผลิตโบรชัวร์" },
  { title: "ผลิตป้ายไวนิล" },
  { title: "ผลิตป้ายแบคดรอป" },
  { title: "ผลิตป้ายโรลอัพ" },
  { title: "ผลิตป้ายสแตนดี้" },
  { title: "ผลิตนามบัตร" },
  { title: "ผลิตปฏิทิน" },
  { title: "ผลิตโปสเตอร์" },
];

// Reusable CategoryList Component
type CategoryListProps = {
  title: string;
  items: CategoryItem[];
};

const CategoryList: React.FC<CategoryListProps> = ({ title, items }) => {
  return (
    <div className="min-w-[12rem] max-w-[12rem]">
      <div className="px-2 font-semibold m-0 p-0">{title}</div>
      <ul className="mt-2 text-[0.875rem] p-0 m-0 list-none ">
        {items.map((item, index) => (
          <li key={index} className="hover:bg-[#e3edfd] text-text_secondary hover:text-third">
            <a className="block px-2 py-[6px] rounded-[4px] ">
              <span>{item.title}</span>
              {item.new && (
                <div className="inline-block bg-third text-white text-[0.6875rem] rounded-[4px] font-bold px-1 py-[1px] ml-1">
                  New
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const GraphicDesign: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <a className="px-2 text-[#485261]">ออกแบบกราฟิก</a>
      <div className="grid grid-cols-[1fr_1fr_1fr] absolute left-0 w-[650px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-10 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <div>
          <CategoryList title="หมวดหมู่" items={graphic} />
          <div className="mt-2 px-2 font-semibold m-0 p-0">Other</div>
          <ul className="mt-2 text-[0.875rem] p-0 m-0 list-none">
            <li>
              <a className="block px-2 py-[6px] rounded-[4px] text-text_secondary">
                อื่นๆ
              </a>
            </li>
          </ul>
        </div>
        <CategoryList title="หมวดหมู่" items={art} />
        <CategoryList title="หมวดหมู่" items={printing} />
      </div>
    </div>
  );
};

export default GraphicDesign;
