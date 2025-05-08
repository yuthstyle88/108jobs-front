"use client";
import { Info } from "lucide-react";
import { useState } from "react";

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState("inProgress"); // "inProgress" or "pending"

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="p-4 md:p-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "inProgress"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("inProgress")}
            >
              Đang thực hiện (0)
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "pending"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Chờ phê duyệt (0)
            </button>
          </div>
        </div>

        {/* Projects In Progress Tab */}
        {activeTab === "inProgress" && (
          <div>
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-4 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-black">
                  Dự án đang thực hiện
                </div>
                <div className="text-sm text-black">0 dự án</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="grid grid-cols-5 p-4 border-b border-gray-200 bg-gray-50 text-black">
                <div className="flex items-center">
                  <span className="font-medium text-sm">Tên dự án</span>
                  <Info className="w-4 h-4 ml-1 text-gray-400" />
                </div>
                <div className="font-medium text-sm">Mã dự án</div>
                <div className="font-medium text-sm flex items-center">
                  <span>Số tiền (VND)</span>
                </div>
                <div className="font-medium text-sm flex items-center">
                  <span>Hạn chót</span>
                  <Info className="w-4 h-4 ml-1 text-gray-400" />
                </div>
                <div className="font-medium text-sm">Bắt đầu trò chuyện</div>
              </div>
              <div className="p-12 flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="text-gray-500 text-center">Chưa có dự án</div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Pending Approval Tab */}
        {activeTab === "pending" && (
          <div>
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-4 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-black">
                  Dự án đang chờ phê duyệt
                </div>
                <div className="text-sm text-black">0 dự án</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="grid grid-cols-5 p-4 border-b border-gray-200 bg-gray-50 text-black">
                <div className="flex items-center">
                  <span className="font-medium text-sm">Tên dự án</span>
                  <Info className="w-4 h-4 ml-1 text-gray-400" />
                </div>
                <div className="font-medium text-sm">Mã dự án</div>
                <div className="font-medium text-sm flex items-center">
                  <span>Số tiền (VND)</span>
                </div>
                <div className="font-medium text-sm flex items-center">
                  <span>Bắt đầu trò chuyện</span>
                </div>
              </div>
              <div className="p-12 flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="text-gray-500 text-center">Chưa có dự án</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
