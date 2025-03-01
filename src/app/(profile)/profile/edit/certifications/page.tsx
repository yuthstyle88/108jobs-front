"use client";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type CertificationItem = {
  id: string;
  name: string;
};

const EditCertifications = () => {
  const [certificationItems, setCertificationItems] = useState<
    CertificationItem[]
  >([{ id: "1", name: "" }]);

  const addCertificationItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "",
    };
    setCertificationItems([...certificationItems, newItem]);
  };

  const removeCertificationItem = (id: string) => {
    if (certificationItems.length > 1) {
      setCertificationItems(
        certificationItems.filter((item) => item.id !== id)
      );
    }
  };

  const handleChange = (
    id: string,
    field: keyof CertificationItem,
    value: string
  ) => {
    setCertificationItems(
      certificationItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = () => {
    // Logic to save data would go here
    console.log("Saving certifications data:", certificationItems);
    // Then redirect back to profile
    window.location.href = "/profile";
  };

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">
          Chứng chỉ và giải thưởng
        </h1>

        {certificationItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div>
              <label className="block text-gray-700 mb-2">
                Tên giải thưởng
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên giải thưởng"
                value={item.name}
                onChange={(e) => handleChange(item.id, "name", e.target.value)}
              />
              <p className="text-red-500 text-xs mt-1">
                Vui lòng nhập thông tin
              </p>
            </div>

            {certificationItems.length > 1 && (
              <button
                onClick={() => removeCertificationItem(item.id)}
                className="mt-4 flex items-center text-red-500 text-sm"
              >
                <X className="w-4 h-4 mr-1" /> Xóa thông tin
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addCertificationItem}
          className="flex items-center justify-center text-blue-600 w-full py-3 border border-dashed border-blue-300 rounded-lg mb-8 hover:bg-blue-50"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm thông tin
        </button>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Lưu thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCertifications;
