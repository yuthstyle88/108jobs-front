import { ArrowRight } from "lucide-react";
import PointIcon from "./PointIcon";

interface PointCardProps {
  title: string;
  points: number;
  subtitle?: string;
  onCheckPoints: () => void;
}

const PointCard = ({
  title,
  points,
  subtitle,
  onCheckPoints,
}: PointCardProps) => {
  // Format points as +X.XX
  const formattedPoints = points.toFixed(2).replace(/\.00$/, "");
  const displayPoints = points > 0 ? `+${formattedPoints}` : formattedPoints;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex h-40">
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={onCheckPoints}
          className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
        >
          ตรวจสอบ และรับ Points
        </button>
      </div>
      <div className="w-32 bg-gray-50 flex flex-col items-center justify-center p-3">
        <PointIcon />
        <p className="text-blue-600 font-bold text-2xl mt-2">{displayPoints}</p>
        <div className="flex items-center text-sm text-gray-500 mt-2 hover:text-blue-600 cursor-pointer transition-colors">
          <span>ดูรีวอร์ดอื่น</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
};

export default PointCard;
