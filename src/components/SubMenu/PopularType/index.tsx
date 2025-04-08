import Link from "next/link";

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

const PopularType = () => {
  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link href="#" className="px-2 text-[#485261] ">
        ประเภทงานยอดนิยม
      </Link>
      <div className="absolute left-0 w-[250px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-subMenu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-50 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third  group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <div className="min-w-[rem] max-w-[12rem] ">
          <div className="px-2 font-semibold m-0 p-0">หมวดหมู่</div>
          <ul className="mt-2 text-[0.875rem] p-0 m-0 list-none">
            {popular_job.map((item, index) => (
              <li key={index}>
                <Link
                  href="#"
                  className="block px-2 py-[6px] rounded-[4px] text-text_secondary"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PopularType;
