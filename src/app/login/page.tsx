"use client";
import apple from "@/assets/icons/apple.svg";
import google from "@/assets/icons/google-play.svg";
import fastwork from "@/assets/images/fastwork-app-qr.webp";
import Imageapp from "@/assets/images/Image-app.webp";
import { CategoriesImage } from "@/constants/images";
import { CategoriesIcon } from "@/constants/icons";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function Login() {
  return (
    <main>
      <section className="h-screen bg-[#E3EDFD] flex items-center justify-center w-full">
        <div className="col-start-2 col-end-3 ">
          <div className="flex flex-row gap-[5rem]">
            <div className="mx-auto flex flex-col gap-[4rem]">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-row items-center">
                  <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                    จ้างผ่าน
                  </h2>
                  <Image src={CategoriesImage.logodefault} alt="logo" />
                </div>
                <div className="flex gap-2 flex-row items-center">
                  <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                    เงินปลอดภัย ได้งานชัวร์
                  </h2>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  src={CategoriesImage.conceptbanner}
                  alt="concept banner"
                  className="h-[164px]"
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="flex gap-2 items-center">
                  <Image
                    src={CategoriesIcon.architect}
                    alt="advantage"
                    className="h-[48px] w-[48px]"
                  />
                  <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                    รับประกันเงินจ้าง
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    src={CategoriesIcon.architect}
                    alt="advantage"
                    className="h-[48px] w-[48px]"
                  />
                  <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                    มีใบประกอบวิชาชีพ
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    src={CategoriesIcon.architect}
                    alt="advantage"
                    className="h-[48px] w-[48px]"
                  />
                  <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                    ผิดเงื่อนไข ยินดีคืนเงิน
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    src={CategoriesIcon.architect}
                    alt="advantage"
                    className="h-[48px] w-[48px]"
                  />
                  <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                    ให้คำแนะนำตลอดการจ้าง
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <Image
                    src={CategoriesIcon.architect}
                    alt="advantage"
                    className="h-[48px] w-[48px]"
                  />
                  <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                    ฟรีแลนซ์ผ่านการตรวจสอบ
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-3xl shadow-xl w-[28rem] max-w-2xl mx-auto p-10 gap-y-6">
                <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                  เข้าสู่ระบบ / สร้างบัญชี
                </h3>

                <form className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      อีเมลหรือหมายเลขโทรศัพท์
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg shadow-sm"
                      placeholder="ระบบอีเมลหรือเบอร์โทร"
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                    >
                      ดำเนินการต่อ
                    </button>
                    <div className="flex justify-between text-sm text-blue-600 mt-4">
                      <a href="/create-account" className="hover:underline">
                        สร้างบัญชี
                      </a>
                      <a href="/forgot-password" className="hover:underline">
                        ลืมรหัสผ่าน?
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4 text-center mt-6">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="text-gray-600 px-2">หรือ</span>
                    <hr className="flex-grow border-t border-gray-300" />
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-6">
                    <button
                      type="button"
                      className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 flex justify-center items-center transition duration-300"
                    >
                      <FontAwesomeIcon icon={faFacebookF} className="mr-3" />
                      เข้าสู่ระบบด้วย Facebook
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-4">
                    <button
                      type="button"
                      className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 flex justify-center items-center transition duration-300"
                    >
                      <FontAwesomeIcon icon={faGoogle} className="mr-3" />
                      เข้าสู่ระบบด้วย Google
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
