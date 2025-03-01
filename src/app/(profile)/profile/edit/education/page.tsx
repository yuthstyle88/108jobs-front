"use client";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type EducationItem = {
  id: string;
  school: string;
  major: string;
};

const EditEducation = () => {
  const [educationItems, setEducationItems] = useState<EducationItem[]>([
    { id: "1", school: "", major: "" },
  ]);

  const addEducationItem = () => {
    const newItem = {
      id: Date.now().toString(),
      school: "",
      major: "",
    };
    setEducationItems([...educationItems, newItem]);
  };

  const removeEducationItem = (id: string) => {
    if (educationItems.length > 1) {
      setEducationItems(educationItems.filter((item) => item.id !== id));
    }
  };

  const handleChange = (
    id: string,
    field: keyof EducationItem,
    value: string
  ) => {
    setEducationItems(
      educationItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = () => {
    console.log("Saving education data:", educationItems);
    window.location.href = "/profile";
  };

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-600 mb-8">
          Trình độ học vấn
        </h1>

        {educationItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Tên trường</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên trường"
                  value={item.school}
                  onChange={(e) =>
                    handleChange(item.id, "school", e.target.value)
                  }
                />
                <p className="text-red-500 text-xs mt-1">
                  Vui lòng nhập thông tin
                </p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Khoa/Chuyên ngành
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Chỉ định khoa/chuyên ngành"
                  value={item.major}
                  onChange={(e) =>
                    handleChange(item.id, "major", e.target.value)
                  }
                />
                <p className="text-red-500 text-xs mt-1">
                  Vui lòng nhập thông tin
                </p>
              </div>
            </div>

            {educationItems.length > 1 && (
              <button
                onClick={() => removeEducationItem(item.id)}
                className="mt-4 flex items-center text-red-500 text-sm"
              >
                <X className="w-4 h-4 mr-1" /> Xóa thông tin
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addEducationItem}
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

export default EditEducation;
