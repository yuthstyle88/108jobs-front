"use client";
import { useState } from "react";

const ContactInfo = () => {
  // const [email, setEmail] = useState("vutruongqiang452002@gmail.com");
  const [address, setAddress] = useState({
    country: "vietnam",
    addressDetail: "Chi tiết địa chỉ theo CMND/CCCD",
    postalCode: "100000",
    district: "Nhập quận/huyện",
    ward: "dwdwdd",
    city: "Thành phố Hồ Chí Minh",
  });

  const handleSave = () => {
    console.log("Saving account settings");
    // Logic to save data would go here
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">
          Thông tin liên lạc
        </h2>
        <p className="text-sm text-gray-500">
          Để chúng tôi và khách hàng có thể liên hệ bạn
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Email liên hệ
            </label>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Thay đổi
            </button>
          </div>
          <input
            type="email"
            value="vutruongqiang452002@gmail.com"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          />
        </div>

        <div className="mt-8 border-t border-gray-200 pt-5">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Thông tin địa chỉ
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Để chúng tôi có thể gửi hàng và tài liệu cho bạn
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ hiện tại
            </label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="country"
                  value="vietnam"
                  checked={address.country === "vietnam"}
                  onChange={() =>
                    setAddress({ ...address, country: "vietnam" })
                  }
                />
                <span className="ml-2 text-sm text-gray-700">Việt Nam</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="country"
                  value="foreign"
                  checked={address.country === "foreign"}
                  onChange={() =>
                    setAddress({ ...address, country: "foreign" })
                  }
                />
                <span className="ml-2 text-sm text-gray-700">Nước ngoài</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chi tiết địa chỉ
            </label>
            <input
              type="text"
              value={address.addressDetail}
              onChange={(e) =>
                setAddress({
                  ...address,
                  addressDetail: e.target.value,
                })
              }
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
                value={address.postalCode}
                onChange={(e) =>
                  setAddress({ ...address, postalCode: e.target.value })
                }
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mã bưu điện"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xã/Phường
              </label>
              <input
                type="text"
                value={address.ward}
                onChange={(e) =>
                  setAddress({ ...address, ward: e.target.value })
                }
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập xã/phường"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quận/Huyện
              </label>
              <input
                type="text"
                value={address.district}
                onChange={(e) =>
                  setAddress({ ...address, district: e.target.value })
                }
                className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập quận/huyện"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh/Thành phố
              </label>
              <input
                type="text"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
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

export default ContactInfo;
