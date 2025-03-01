"use client";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 40 }, (_, i) => (currentYear - i).toString());

const EditExperience = () => {
  const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([
    { 
      id: "1", 
      company: "", 
      position: "", 
      startMonth: "February", 
      startYear: "2025", 
      endMonth: "February", 
      endYear: "2025",
      isCurrent: false
    }
  ]);
  
  const addExperienceItem = () => {
    const newItem = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startMonth: "February",
      startYear: "2025",
      endMonth: "February",
      endYear: "2025",
      isCurrent: false
    };
    setExperienceItems([...experienceItems, newItem]);
  };
  
  const removeExperienceItem = (id: string) => {
    if (experienceItems.length > 1) {
      setExperienceItems(experienceItems.filter(item => item.id !== id));
    }
  };
  
  const handleChange = <K extends keyof ExperienceItem>(
    id: string,
    field: K,
    value: ExperienceItem[K] 
  ) => {
    setExperienceItems(
      experienceItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  
  const handleSave = () => {
    // Logic to save data would go here
    console.log("Saving experience data:", experienceItems);
    // Then redirect back to profile
    window.location.href = "/profile";
  };
  
  return (
    <div className="flex-1">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-blue-600 mb-8">Kinh nghiệm làm việc</h1>
      
      {experienceItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Tên công ty</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chỉ định tên công ty"
                value={item.company}
                onChange={(e) => handleChange(item.id, "company", e.target.value)}
              />
              <p className="text-red-500 text-xs mt-1">Vui lòng nhập thông tin</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Vị trí</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chỉ định vị trí công việc"
                value={item.position}
                onChange={(e) => handleChange(item.id, "position", e.target.value)}
              />
              <p className="text-red-500 text-xs mt-1">Vui lòng nhập thông tin</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Tháng bắt đầu</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"12\" height=\"7\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1 1l5 5 5-5\" stroke=\"%23999\" stroke-width=\"1.5\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundPosition: "right 1rem center" }}
                value={item.startMonth}
                onChange={(e) => handleChange(item.id, "startMonth", e.target.value)}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Năm bắt đầu</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"12\" height=\"7\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1 1l5 5 5-5\" stroke=\"%23999\" stroke-width=\"1.5\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundPosition: "right 1rem center" }}
                value={item.startYear}
                onChange={(e) => handleChange(item.id, "startYear", e.target.value)}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                checked={item.isCurrent}
                onChange={(e) => handleChange(item.id, "isCurrent", e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Nơi làm việc hiện tại</span>
            </label>
          </div>
          
          {!item.isCurrent && (
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Tháng kết thúc</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"12\" height=\"7\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1 1l5 5 5-5\" stroke=\"%23999\" stroke-width=\"1.5\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundPosition: "right 1rem center" }}
                  value={item.endMonth}
                  onChange={(e) => handleChange(item.id, "endMonth", e.target.value)}
                  disabled={item.isCurrent}
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Năm kết thúc</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"12\" height=\"7\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1 1l5 5 5-5\" stroke=\"%23999\" stroke-width=\"1.5\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundPosition: "right 1rem center" }}
                  value={item.endYear}
                  onChange={(e) => handleChange(item.id, "endYear", e.target.value)}
                  disabled={item.isCurrent}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {experienceItems.length > 1 && (
            <button 
              onClick={() => removeExperienceItem(item.id)}
              className="mt-4 flex items-center text-red-500 text-sm"
            >
              <X className="w-4 h-4 mr-1" /> Xóa thông tin
            </button>
          )}
        </div>
      ))}
      
      <button 
        onClick={addExperienceItem}
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

export default EditExperience;
