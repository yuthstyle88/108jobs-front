"use client";
import { API_ROUTES } from "@/api/endpoints";
import { ProfileImage } from "@/constants/images";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import { FileText, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AccountStats = () => {
  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.get_profile
  );
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="flex-1">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-black">
          Thống kê tài khoản
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-black">
          <div className="bg-white rounded-lg p-6 flex flex-col justify-center items-center">
            <figure className="w-20 h-20 rounded-full overflow-hidden relative">
              <Image
                src={user?.user.avatar_url || ProfileImage.avatar}
                alt="avatar"
                width={80}
                height={80}
                className="object-cover"
              />
            </figure>
            <h3 className="text-lg font-medium mb-1">{user?.user.username}</h3>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <h3 className="text-base font-medium flex-grow text-black">
                Hoạt động trực tuyến
              </h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between mb-2">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">{day}</div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 5 ? "bg-green-500" : "bg-gray-100"
                    }`}
                  >
                    {index === 5 && <span className="text-white">✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-black text-center mt-4">
              Hoạt động trực tuyến liên tục để tăng khả năng hiển thị
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md"
                href="/job-board"
                target="_blank"
              >
                Tìm công việc
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 relative">
          <div className="flex items-center mb-4">
            <h3 className="text-text_primary text-base font-medium flex-grow">
              Thời gian phản hồi trung bình
            </h3>
            <Info className="w-4 h-4 text-black" />
          </div>
          <div className="text-sm text-black">Chưa có dữ liệu</div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4 text-black">
            Thống Kê Dịch Vụ
          </h2>
          <div className="text-sm text-black">
            Chỉ chú: Dữ liệu sẽ được cập nhật trong vòng 24 giờ
          </div>

          <div className="mt-6 bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-gray-300 mb-4" />
            <div className="text-black">Chưa có dữ liệu</div>
            <Link href="/manage-product/create">
              <button className="mt-4 bg-blue-100 text-blue-700 text-sm font-medium py-2 px-4 rounded">
                Bắt Đầu Bán
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;
