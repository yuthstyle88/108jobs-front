"use client";
import { CategoriesIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [checkboxes, setCheckboxes] = useState({
    termsAccepted: false,
    privacyAccepted: false,
    promotionalAccepted: false,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
    setIsCreateAccount(false);
  };

  const allCheckboxesChecked =
    checkboxes.termsAccepted &&
    checkboxes.privacyAccepted &&
    checkboxes.promotionalAccepted;

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
              {!isCreateAccount && !isForgotPassword ? (
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
                        <button
                          type="button"
                          onClick={() => setIsCreateAccount(true)}
                          className="hover:underline"
                        >
                          สร้างบัญชี
                        </button>
                        <button
                          type="button"
                          onClick={handleForgotPasswordClick}
                          className="hover:underline"
                        >
                          ลืมรหัสผ่าน?
                        </button>
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
              ) : isForgotPassword ? (
                <div className="bg-white rounded-3xl shadow-xl w-[28rem] max-w-2xl mx-auto p-10 gap-y-6 text-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-gray-600 mb-4 inline-block"
                  >
                    &#8592;  
                  </button>
                  <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    ลืมรหัสผ่าน
                  </h3>
                  <div className="text-sm text-left text-gray-800 mb-6">
                    Fastwork จะทำการส่งรหัสยืนยันไปยัง อีเมล/เบอร์โทรศัพท์ของคุณ
                    เพื่อยืนยันความเป็นเจ้าของบัญชี
                  </div>
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
                        placeholder="กรอกอีเมลหรือเบอร์โทร"
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                      >
                        ส่งรหัสยืนยัน
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-xl w-[28rem] max-w-2xl mx-auto p-10 gap-y-6 text-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateAccount(false)}
                    className="text-gray-600 mb-4 inline-block"
                  >
                    &#8592;  
                  </button>
                  <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    สร้างบัญชี Fastwork
                  </h3>

                  <form className="space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        อีเมลที่ติดต่อได้
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg shadow-sm"
                        placeholder="กรอกอีเมล"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        รหัสผ่าน
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          className="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg shadow-sm"
                          placeholder="กรอกรหัสผ่าน"
                        />
                        <button
                          type="button"
                          onClick={togglePassword}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        ยืนยันรหัสผ่าน
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="password_confirmation"
                          name="password_confirmation"
                          className="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg shadow-sm"
                          placeholder="ยืนยันรหัสผ่าน"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPassword}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        เบอร์โทรศัพท์ที่ติดต่อได้
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="w-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg shadow-sm"
                        placeholder="กรอกเบอร์โทร"
                      />
                    </div>

                    <div className="flex justify-between text-sm text-gray-700 mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={checkboxes.termsAccepted}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        ฉันได้อ่านและยอมรับ เงื่อนไขข้อตกลงการใช้บริการ
                      </label>
                    </div>

                    <div className="flex justify-between text-sm text-gray-700 mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="privacyAccepted"
                          checked={checkboxes.privacyAccepted}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        ฉันได้อ่านและยอมรับ นโยบายคุ้มครองความเป็นส่วนตัว
                      </label>
                    </div>

                    <div className="flex justify-between text-sm text-gray-700 mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="promotionalAccepted"
                          checked={checkboxes.promotionalAccepted}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        ฉันสนใจรับข้อมูลข่าวสาร ส่วนลดและโปรโมชันผ่านทางอีเมล
                      </label>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                        disabled={!allCheckboxesChecked}
                      >
                        สร้างบัญชี
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
