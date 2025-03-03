import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Business = () => {
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        บริการจัดหาฟรีแลนซ์เพื่อธุรกิจ (fastwork for business)
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        บริการจัดหาฟรีแลนซ์เพื่อธุรกิจ (fastwork for business)
      </p>
      <div className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          ไปยัง fastwork for business
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </div>
    </div>
  );
};

export default Business;
