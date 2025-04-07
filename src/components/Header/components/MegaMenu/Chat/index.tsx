import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Chat = () => {
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        บริการ Chat to hire หรือผู้ช่วยค้นหาฟรีแลนซ์
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        Chat to Hire หรือผู้ช่วยค้นหาฟรีแลนซ์ผ่านไลน์ เพียงแค่บอกรายละเอียด
        แอดมินก็พร้อมค้นหาฟรีแลนซ์ให้กับคุณ
      </p>
      <div className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          แอดไลน์ @fastwork
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </div>
    </div>
  );
};

export default Chat;
