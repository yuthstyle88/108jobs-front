"use client";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface ImageState {
  idWithFace: string;
  idFront: string;
  idBack: string;
}

const PersonalInfo = () => {
  const [idNumber, setIdNumber] = useState("168100040910");
  const [firstName, setFirstName] = useState("Vu");
  const [lastName, setLastName] = useState("Giang");
  const [birthDay, setBirthDay] = useState({
    day: "16",
    month: "10",
    year: "1996",
  });

  const [images, setImages] = useState<ImageState>({
    idWithFace: "/lovable-uploads/805a53be-9f23-40a2-ad71-f2dbdbd09018.png",
    idFront: "/lovable-uploads/805a53be-9f23-40a2-ad71-f2dbdbd09018.png",
    idBack: "/lovable-uploads/4e214565-2372-45e9-bc94-cd2f154badf3.png",
  });

  // Handle file input change
  const handleFileChange =
    (type: keyof ImageState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // In a real app, you would upload the file to a server
        // For this demo, we're just simulating the upload
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => ({
              ...prev,
              [type]: event.target?.result as string,
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    };

  // Helper function to trigger file input click
  const triggerFileInput = (type: keyof ImageState) => {
    const fileInput = document.getElementById(`file-input-${type}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  // Delete image
  const deleteImage = (type: keyof ImageState) => {
    setImages((prev) => ({
      ...prev,
      [type]: "",
    }));
  };

  const handleSave = () => {
    console.log("Saving account settings");
    // Logic to save data would go here
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">
          Thông tin CMND/CCCD
        </h2>
        <p className="text-sm text-gray-500">Dùng để xác nhận danh tính</p>
      </div>

      {/* Error alert */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-5">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Không được chấp nhận do
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Nhập địa chỉ theo thẻ CMND/CCCD</li>
                <li>
                  Hãy tải lên ảnh CMND/CCCD hai mặt và một ảnh bạn cầm CMND/CCCD
                  mặt trước
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* ID with face */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h4 className="text-sm text-text_primary font-medium mb-1">
              Ảnh chụp chung với CMND/CCCD
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              Ảnh cần rõ nét và chính chủ
            </p>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
              {images.idWithFace ? (
                <>
                  <Image
                    src={images.idWithFace}
                    alt="ID with face"
                    width={500}
                    height={500}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => deleteImage("idWithFace")}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <input
              type="file"
              id="file-input-idWithFace"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange("idWithFace")}
            />
            <button
              onClick={() => triggerFileInput("idWithFace")}
              className="w-full py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {images.idWithFace ? "Thay đổi ảnh" : "Tải lên ảnh"}
            </button>
          </div>

          {/* ID front */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium mb-1 text-text_primary">
              Ảnh CMND/CCCD
            </h4>
            <p className="text-xs text-gray-500 mb-3">Ảnh cần rõ nét</p>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
              {images.idFront ? (
                <>
                  <Image
                    src={images.idFront}
                    alt="ID front"
                    className="w-full h-40 object-cover"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => deleteImage("idFront")}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <input
              type="file"
              id="file-input-idFront"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange("idFront")}
            />
            <button
              onClick={() => triggerFileInput("idFront")}
              className="w-full py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {images.idFront ? "Thay đổi ảnh" : "Tải lên ảnh"}
            </button>
          </div>

          {/* ID back */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium mb-1 text-text_primary">
              Ảnh CMND/CCCD mặt sau
            </h4>
            <p className="text-xs text-gray-500 mb-3">Ảnh cần rõ nét</p>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
              {images.idBack ? (
                <>
                  <Image
                    src={images.idBack}
                    alt="ID back"
                    className="w-full h-40 object-cover"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => deleteImage("idBack")}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <input
              type="file"
              id="file-input-idBack"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange("idBack")}
            />
            <button
              onClick={() => triggerFileInput("idBack")}
              className="w-full py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {images.idBack ? "Thay đổi ảnh" : "Tải lên ảnh"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đệm và tên
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số CMND/CCCD
          </label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày sinh
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <select
                value={birthDay.day}
                onChange={(e) =>
                  setBirthDay({ ...birthDay, day: e.target.value })
                }
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={birthDay.month}
                onChange={(e) =>
                  setBirthDay({ ...birthDay, month: e.target.value })
                }
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    tháng {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={birthDay.year}
                onChange={(e) =>
                  setBirthDay({ ...birthDay, year: e.target.value })
                }
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 100 }, (_, i) => 2023 - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Địa chỉ theo CMND/CCCD
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            Vui lòng nhập thông tin trùng với CMND/CCCD của bạn
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chi tiết địa chỉ
            </label>
            <input
              type="text"
              defaultValue="ewedawdawdawdawd"
              className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã bưu điện
              </label>
              <input
                type="text"
                defaultValue="100000"
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xã/Phường
              </label>
              <input
                type="text"
                defaultValue="dwdwdd"
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quận/Huyện
              </label>
              <input
                type="text"
                defaultValue="wdwdwd"
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh/Thành phố
              </label>
              <input
                type="text"
                defaultValue="Thành phố Hồ Chí Minh"
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
