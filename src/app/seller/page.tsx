
const SellerHome = () => {
  return (
    <div>
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-2">
              <h3 className="font-medium">Member</h3>
              <p className="text-sm">Phí dịch vụ 0%</p>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-blue-600 font-medium">đ0,00</span>
              <span className="text-gray-400">/ 800.000,00</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">
                Thu nhập tích lũy trong 3 tháng
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
              Tích lũy thêm đ1.800.000,00
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Để nâng hạng thành viên
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-600 rounded text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium">Bắt đầu làm freelancer</h2>
          <span className="text-sm text-gray-500">
            3 bước để tạo thu nhập trên fastlance
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-green-100 rounded-lg bg-green-50">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">
                  Đăng ký làm freelancer: Freelance đã được xác minh
                </p>
              </div>
            </div>
            <span className="text-green-500">Hoàn tất</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">Đăng dịch vụ của bạn</p>
                <p className="text-sm text-gray-500">
                  Tạo các dịch vụ hấp dẫn để thu hút người thuê và tạo ra thu
                  nhập trên fastlance
                </p>
              </div>
            </div>
            <button className="text-blue-600 hover:underline">
              Đăng dịch vụ
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">3</span>
              </div>
              <div>
                <p className="font-medium">Giới thiệu bản thân</p>
                <p className="text-sm text-gray-500">
                  Thêm kinh nghiệm làm việc, trình độ học vấn và các kỹ năng của
                  bạn
                </p>
              </div>
            </div>
            <button className="text-blue-600 hover:underline">
              Thêm thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
