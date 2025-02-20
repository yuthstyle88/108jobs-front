import { JobDetailIcon } from '@/constants/icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'


const AsideJob = () => {
  return (
    <aside className="text-black sticky top-40 self-start">
    <div className="bg-[#F6F9FE] rounded-md shadow-jobCard p-4">
      <div className="flex items-center ">
        <div className="mr-4">
          <Image
            src={JobDetailIcon.guarantee}
            alt="guarantee"
            className="w-16 h-[45px]"
          />
        </div>
        <div className="">
          <strong className="text-third ">Fastwork Guarantee</strong>
          <p className="mt-1 text-[0.75rem] text-text_secondary font-sans">
            ดูแลตลอดการจ้างงาน ปลอดภัย ไม่โดนโกง
            ตัวกลางคุ้มครองเงินจนงานได้รับการอนุมัติ
          </p>
          <Link
            href="#"
            className="text-third text-[0.75rem] font-sans"
          >
            อ่านเงื่อนไขและสิทธิ์การคุ้มครองเพิ่มเติม
          </Link>
        </div>
      </div>
    </div>
    <div className="rounded-md overflow-hidden mt-4 shadow-jobCard ">
      <section className="grid-cols-[1fr_1fr_1fr] grid min-w-0 min-h-0">
        <div className="relative bg-white text-third py-5 text-center cursor-pointer rounded-tl-md rounded-tr-md">
          <strong>฿1,600</strong>
        </div>
        <div className="relative bg-[#F6F7F8] text-[#8793a6] py-5 text-center cursor-pointer rounded-tl-md rounded-tr-md">
          <strong>฿2,600</strong>
        </div>
        <div className="relative bg-[#F6F7F8] text-[#8793a6] py-5 text-center cursor-pointer rounded-tl-md rounded-tr-md">
          <strong>฿3,600</strong>
        </div>
      </section>
      <section className="p-6 bg-white">
        <h3 className="font-medium text-third">
          แพ็กเกจ: เพิ่ม Traffic 30 วัน ดันอันดับ เร่ง Index
        </h3>
        <p className="line-clamp-2 text-ellipsis overflow-hidden break-words mt-2 text-[0.875rem] text-text_secondary font-sans ">
          Traffic Package ทุก Package Traffic ทำงาน 30 วันค่ะ Traffic
          Package 6,000 Traffic View เหมาะสำหรับเว็บคู่แข่งน้อย 1,600
          บาท 1 Link 1 Keyword Traffic Package 30,000 Traffic View
          เหมาะสำหรับเว็บคู่แข่งปานกลาง 7,500 บาท 5 Link 5 Keyword
          Traffic Package 100,000 Traffic View เหมาะสำหรับเว็บคู่แข่งสูง
          20,000 บาท 10 Link 10 Keyword เรามีตัวนับ Traffic view
          ย้อนหลัง 30 วันค่ะ การทำ สัญญาณ Offpage SEO
          สมควรทำคู่กันระหว่าง Traffic กับ Backlink
          ผสานกันแบบเป็นธรรมชาติจะได้ผลดีที่สุดค่ะ
        </p>
        <Link
          href=""
          className="text-third mt-2 font-semibold text-[0.875rem] cursor-pointer font-sans"
        >
          ดูข้อมูลแพ็กเกจ
        </Link>
        <hr className="mt-4 bg-border_primary block overflow-visible w-full h-[1px] m-0" />
        <div className="mt-4 mb-4">
          <div className="gap-[0.5em] items-center justify-between flex text-[0.875rem] ">
            <label
              htmlFor="company-payment"
              className="font-medium text-[0.875rem] text-text_secondary"
            >
              สนใจจ้างในนามบริษัท
            </label>
            <input
              name="company-payment"
              type="checkbox"
              className="w-[1.375em] h-[1.375em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-md bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
            />
          </div>
        </div>
        <button className="relative inline-flex justify-center items-center overflow-hidden min-h-[2.5rem] px-[1.125rem] border-none rounded-[0.25rem] bg-third text-[0.875rem] font-medium w-full text-white">
          <span>ทักแชทฟรีแลนซ์</span>
        </button>
        <div className="text-center mt-2">
          <small className="text-[0.75rem] text-text_secondary">
            คุณจะยังไม่เสียค่าใช้จ่าย
          </small>
        </div>
      </section>
    </div>
    <div className="mt-4 overflow-hidden shadow-jobCard rounded-[0.5rem] ">
      <Link href="#">
        <div className="aspect-[320/68] h-[68px] w-full relative">
          <Image
            src={JobDetailIcon.company}
            alt="company"
            className=""
          />
        </div>
      </Link>
    </div>
    <div className="grid grid-cols-[1fr_1fr] text-center mt-4 font-medium text-text_secondary ">
      <div className="flex flex-row items-center justify-center min-w-[34px] border-r-1 border-border_primary p-2 cursor-pointer">
        <FontAwesomeIcon
          icon={faHeart}
          className="text-text_secondary"
        />
        <p className="ml-2 cursor-pointer text-center">บันทึก</p>
      </div>
      <div className="flex flex-row items-center justify-center min-w-[34px] p-2 cursor-pointer">
        <FontAwesomeIcon
          icon={faShareAlt}
          className="text-text_secondary"
        />
        <p className="ml-2 cursor-pointer text-center">บันทึก</p>
      </div>
    </div>
  </aside>
  )
}

export default AsideJob