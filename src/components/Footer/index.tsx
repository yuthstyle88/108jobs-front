import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import id from "@/assets/icons/id.svg";
import th from "@/assets/icons/th.svg";
import vn from "@/assets/icons/vn.svg";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Categories */}
        <div>
          <h3 className="font-bold mb-3">หมวดหมู่งาน</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">ออกแบบกราฟิก</Link>
            </li>
            <li>
              <Link href="#">สถาปัตย์และวิศวกรรม</Link>
            </li>
            <li>
              <Link href="#">เว็บไซต์และเทคโนโลยี</Link>
            </li>
            <li>
              <Link href="#">การตลาดและโฆษณา</Link>
            </li>
            <li>
              <Link href="#">เขียนและแปลภาษา</Link>
            </li>
            <li>
              <Link href="#">ภาพและเสียง</Link>
            </li>
            <li>
              <Link href="#">ธุรกิจและที่ปรึกษา</Link>
            </li>
            <li>
              <Link href="#">ไลฟ์สไตล์</Link>
            </li>
          </ul>
        </div>

        {/* How to Use */}
        <div>
          <h3 className="font-bold mb-3">วิธีการใช้งาน</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">สมัครเป็นฟรีแลนซ์</Link>
            </li>
            <li>
              <Link href="#">เริ่มขายงานอย่างไร</Link>
            </li>
            <li>
              <Link href="#">การชำระค่าจ้าง</Link>
            </li>
            <li>
              <Link href="#">รับประกันการจ้างงาน</Link>
            </li>
            <li>
              <Link href="#">บล็อกความรู้</Link>
            </li>
            <li>
              <Link href="#">คำถามที่พบบ่อย</Link>
            </li>
            <li>
              <Link href="#">จัดการการใช้ข้อมูล</Link>
            </li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold mb-3">ผลิตภัณฑ์</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Fastwork</Link>
            </li>
            <li>
              <Link href="#">Fastwork for Business</Link>
            </li>
          </ul>
        </div>

        {/* About Fastwork */}
        <div>
          <h3 className="font-bold mb-3">เกี่ยวกับ Fastwork</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Feedback พวกเรา</Link>
            </li>
            <li>
              <Link href="#">ร่วมงานกับ Fastwork</Link>
            </li>
            <li>
              <Link href="#">เงื่อนไขการใช้บริการ</Link>
            </li>
            <li>
              <Link href="#">นโยบายความเป็นส่วนตัว</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-3">ติดต่อเรา</h3>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <Link href="mailto:support@fastwork.co">support@fastwork.co</Link>
            </li>
            <li>
              <Link href="#">Facebook Messenger</Link>
            </li>
          </ul>
          <p className="mt-3 text-xs">
            จันทร์-ศุกร์ 9:30-22:00น. <br />
            เสาร์-อาทิตย์, วันหยุดนักขัตฤกษ์ 10:00-19:00น.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-800">
        <div className="container mx-auto px-4 py-2 md:grid-cols-5 gap-6 ">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex space-x-4 text-lg text-white">
              <FaInstagram />
              <FaFacebook />
              <FaTiktok className="mr-4" />
              <span>| Sitemaps |</span>
              <Image src={th} alt="TH" width={24} height={16} />
              <Image src={id} alt="SG" width={24} height={16} />
              <Image src={vn} alt="VN" width={24} height={16} />
            </div>

            {/* Copyright */}
            <p className="text-xs text-white mt-3 md:mt-0">© 2025 Fastwork</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
