import CategoryList from "@/components/CategoryList";

type CategoryItem = {
  title: string;
  new?: boolean;
};

const fortuneAndFaith: CategoryItem[] = [
  { title: "ดูดวง โหราศาสตร์ ความเชื่อ" },
  { title: "ฮวงจุ้ยสำหรับธุรกิจ" },
  { title: "รับจ้างทำบุญ" },
  { title: "ลายเซ็นมงคล" },
  { title: "ตั้งชื่อมงคล" },
  { title: "เบอร์มงคล" },
];

const travel: CategoryItem[] = [
  { title: "วางแพลนเที่ยว" },
  { title: "รับทำวีซ่า" },
  { title: "รับลง K-ETA" },
  { title: "ไกด์ส่วนตัว", new: true },
];

const cleaningAndCare: CategoryItem[] = [
  { title: "แม่บ้าน ทำความสะอาด" },
  { title: "รับตัดต้นไม้", new: true },
  { title: "ล้างรถนอกสถานที่", new: true },
  { title: "รับสปากระเป๋า", new: true },
  { title: "ซักผ้าม่าน พรม", new: true },
];

const music: CategoryItem[] = [
  { title: "นักดนตรี วงดนตรี" },
  { title: "นักร้อง" },
  { title: "จ้าง DJ" },
  { title: "เช่าเครื่องดนตรี" },
];

const gaming: CategoryItem[] = [
  { title: "รับจ้างเล่นเกม" },
  { title: "หาเพื่อนเล่นเกม" },
];

const healthAndWellness: CategoryItem[] = [
  { title: "Personal Trainer" },
  { title: "ปรึกษานักโภชนาการ" },
  { title: "นักกายภาพบำบัด", new: true },
  { title: "เชฟส่วนตัว", new: true },
  { title: "สอนโยคะ", new: true },
  { title: "นวด", new: true },
];

const fashionAndBeauty: CategoryItem[] = [
  { title: "ช่างแต่งหน้า" },
  { title: "Personal Stylist" },
  { title: "Prop & Stylist" },
  { title: "ทำ Personal Color" },
  { title: "ช่างทำเล็บ", new: true },
  { title: "ที่ปรึกษาความงาม", new: true },
  { title: "ต่อขนตา", new: true },
  { title: "ช่างตัดผม", new: true },
];

const eventAndOrganizer: CategoryItem[] = [
  { title: "รับจัดบูธ" },
  { title: "จัดอบรม สัมมนา" },
  { title: "เช่า Photo Booth" },
  { title: "รับจัดเซอร์ไพรส์" },
  { title: "รับจัดเลี้ยง" },
  { title: "รับจัดงานแต่ง", new: true },
  { title: "รับจัดงานศพ", new: true },
  { title: "รับจัดงานบุญ", new: true },
];

const consultant: CategoryItem[] = [
  { title: "ที่ปรึกษางานวิจัย" },
  { title: "คิดสูตรอาหาร" },
  { title: "ที่ปรึกษาเรียนต่อต่างประเทศ" },
];

const logisticsAndWarehouse: CategoryItem[] = [
  { title: "รับแพ็คสินค้า", new: true },
  { title: "รับขนย้ายของ", new: true },
  { title: "โกดังเก็บของ", new: true },
];

const pets: CategoryItem[] = [
  { title: "รับฝึกสุนัข", new: true },
  { title: "อาบน้ำ ตัดขนสัตว์", new: true },
  { title: "รับจ้างเลี้ยงสัตว์", new: true },
  { title: "ฌาปนกิจสัตว์เลี้ยง", new: true },
];

const sports: CategoryItem[] = [
  { title: "สอนตีแบต", new: true },
  { title: "สอนตีกอล์ฟ", new: true },
  { title: "สอนต่อยมวย", new: true },
  { title: "สอนตีเทนนิส", new: true },
];

const learningAndDevelopment: CategoryItem[] = [
  { title: "ผู้เชี่ยวชาญให้ความรู้เฉพาะด้าน" },
  { title: "สอนภาษาอังกฤษ" },
  { title: "สอนยิงแอด", new: true },
  { title: "สอนการลงทุน" },
  { title: "สอน Excel", new: true },
  { title: "สอนไลฟ์สด", new: true },
  { title: "เรียนตัดต่อวิดีโอ" },
  { title: "เรียน Digital Marketing" },
  { title: "เรียนดูดวง" },
  { title: "สอน SEO" },
  { title: "เรียน Canva", new: true },
  { title: "สอนขับรถ", new: true },
  { title: "สอนดนตรี", new: true },
];

const other: CategoryItem[] = [
  { title: "ตรวจสภาพรถมือสอง" },
  { title: "รับจัดดอกไม้", new: true },
  { title: "คนขับรถ", new: true },
  { title: "บาริสต้า", new: true },
  { title: "บอดี้การ์ด" },
  { title: "บาร์เทนเดอร์", new: true },
  { title: "รับซ่อมนาฬิกา", new: true },
  { title: "อื่นๆ" },
];



const Lifestyle: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <a className="px-2 text-[#485261]">ไลฟ์สไตล์</a>
      <div className="grid grid-cols-[1fr_1fr_1fr] max-h-sub-menu overflow-auto gap-y-4 absolute right-0 w-[670px] opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-10 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <CategoryList title="Fortune & Faith" items={fortuneAndFaith} />
        <CategoryList title="Travel" items={travel} />
        <CategoryList title="Cleaning & Care" items={cleaningAndCare} />
        <CategoryList title="Music" items={music} />
        <CategoryList title="Gaming" items={gaming} />
        <CategoryList title="Health & Wellness" items={healthAndWellness} />
        <CategoryList title="Fashion & Beauty" items={fashionAndBeauty} />
        <CategoryList title="Event & Organizer" items={eventAndOrganizer} />
        <CategoryList title="Consultant" items={consultant} />
        <CategoryList title="Logistics and Warehouse" items={logisticsAndWarehouse} />
        <CategoryList title="Pets" items={pets} />
        <CategoryList title="Sports" items={sports} />
        <CategoryList title="Learning & Development" items={learningAndDevelopment} />
        <CategoryList title="Other" items={other} />
      </div>
    </div>
  );
};


export default Lifestyle;
