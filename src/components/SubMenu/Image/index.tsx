import CategoryList from "@/components/CategoryList";

type CategoryItem = {
  title: string;
  new?: boolean;
};

const photoAndVideo: CategoryItem[] = [
  { title: "ถ่ายและตัดต่อวีดีโอ" },
  { title: "Photography" },
  { title: "Motion Graphics" },
  { title: "Subtitle" },
  { title: "Animations" },
  { title: "ผู้ช่วยช่างภาพ" },
  { title: "เกลี่ยสีวิดีโอ" },
];

const voiceAndSound: CategoryItem[] = [
  { title: "Voice Over" },
  { title: "ทำเพลง", new: true },
  { title: "พิธีกร MC" },
  { title: "Podcast" },
  { title: "Sound Effect", new: true },
  { title: "Sound Engineer", new: true },
];
const artist: CategoryItem[] = [
  { title: "Acting & Modeling" },
  { title: "Stand-Up Comedy" },
];

const eventAndOrganizer: CategoryItem[] = [
  { title: "Production & Project Management" },
  { title: "สตูดิโอให้เช่า", new: true },
];


const other: CategoryItem[] = [{ title: "อื่นๆ" }];

const ImageAndSound: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <a className="px-2 text-[#485261]">ภาพและเสียง</a>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-y-4 absolute right-0 w-[650px] opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-10 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <CategoryList title="Photo & Video" items={photoAndVideo} />
        <CategoryList title="Voice & Sound" items={voiceAndSound} />
        <CategoryList title="Artist" items={artist} />
        <CategoryList title="Event & Organizer" items={eventAndOrganizer} />
        <CategoryList title="Other" items={other} />
      </div>
    </div>
  );
};


export default ImageAndSound;
