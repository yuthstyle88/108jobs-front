import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Hiring = () => {
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        เข้าสู่ระบบ ระบุข้อมูล แจ้งฟรีแลนซ์ได้ทันที!
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        เพียง 3 ขั้นตอน หลังเข้าสู่ระบบ <br /> 1. ระบุข้อมูลบริษัท <br /> 2.
        รออนุมัติภายใน 2 ชั่วโมง <br /> 3. แจ้งฟรีแลนซ์ออกเอกสารได้ทันที
      </p>
      <div className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          ระบุข้อมูลบริษัท
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </div>
    </div>
  );
};

export default Hiring;
