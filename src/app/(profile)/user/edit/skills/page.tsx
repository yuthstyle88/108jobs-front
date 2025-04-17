
"use client";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type SkillItem = {
  id: string;
  skill: string;
  level: string;
};

const skillLevels = ["Cơ bản", "Trung bình", "Khá", "Tốt", "Chuyên môn cao"];

const EditSkills = () => {
  const [skillItems, setSkillItems] = useState<SkillItem[]>([
    { id: "1", skill: "", level: "Chuyên môn cao" }
  ]);
  
  const addSkillItem = () => {
    const newItem = {
      id: Date.now().toString(),
      skill: "",
      level: "Chuyên môn cao"
    };
    setSkillItems([...skillItems, newItem]);
  };
  
  const removeSkillItem = (id: string) => {
    if (skillItems.length > 1) {
      setSkillItems(skillItems.filter(item => item.id !== id));
    }
  };
  
  const handleChange = (id: string, field: keyof SkillItem, value: string) => {
    setSkillItems(
      skillItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const handleSave = () => {
    // Logic to save data would go here
    console.log("Saving skills data:", skillItems);
    // Then redirect back to profile
    window.location.href = "/profile";
  };
  
  return (
    <div className="flex-1">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-blue-600 mb-8">Kỹ năng</h1>
      
      {skillItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Kỹ năng</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Photoshop, AutoCAD"
                value={item.skill}
                onChange={(e) => handleChange(item.id, "skill", e.target.value)}
              />
              <p className="text-red-500 text-xs mt-1">Vui lòng nhập thông tin</p>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Cấp độ</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white bg-no-repeat bg-right"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"12\" height=\"7\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1 1l5 5 5-5\" stroke=\"%23999\" stroke-width=\"1.5\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundPosition: "right 1rem center" }}
                value={item.level}
                onChange={(e) => handleChange(item.id, "level", e.target.value)}
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          
          {skillItems.length > 1 && (
            <button 
              onClick={() => removeSkillItem(item.id)}
              className="mt-4 flex items-center text-red-500 text-sm"
            >
              <X className="w-4 h-4 mr-1" /> Xóa thông tin
            </button>
          )}
        </div>
      ))}
      
      <button 
        onClick={addSkillItem}
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

export default EditSkills;
