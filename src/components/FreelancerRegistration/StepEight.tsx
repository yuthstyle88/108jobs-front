
import React, { useState } from 'react';

interface StepEightProps {
  formData: {
    email: string;
    nationality: string;
    currentCity: string;
  };
  updateFormData: (data: Partial<StepEightProps['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const StepEight: React.FC<StepEightProps> = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [isVietnam, setIsVietnam] = useState(true);
  const [isOtherNation, setIsOtherNation] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ email: e.target.value });
  };

  const handleNationalityChange = (nationality: 'เวียดนาม' | 'ต่างชาติ') => {
    if (nationality === 'เวียดนาม') {
      setIsVietnam(true);
      setIsOtherNation(false);
    } else {
      setIsVietnam(false);
      setIsOtherNation(true);
    }
    updateFormData({ nationality });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ currentCity: e.target.value });
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text_primary">ยืนยันข้อมูลการติดต่อของคุณ</h2>
        <p className="text-text_secondary mt-2">เพื่อให้ทางเราส่งข้อมูลการติดต่อกลับคุณได้</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-text_primary font-semibold mb-2">
          อีเมลติดต่อ
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={handleEmailChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
          placeholder="your.email@example.com"
        />
        <div className="flex mt-2">
          <button 
            className="px-4 py-1 rounded-md text-sm bg-third text-white"
          >
            ยืนยัน
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-text_primary font-semibold mb-2">
          ที่อยู่ปัจจุบัน
        </label>
        <div className="flex space-x-4 mb-4">
          <div 
            onClick={() => handleNationalityChange('เวียดนาม')} 
            className={`flex items-center px-4 py-2 rounded-lg cursor-pointer border text-text_primary ${isVietnam ? 'border-third' : 'border-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${isVietnam ? 'border-third' : 'border-gray-400'}`}>
              {isVietnam && <div className="w-2 h-2 rounded-full bg-third"></div>}
            </div>
            <span>เวียดนาม</span>
          </div>
          <div 
            onClick={() => handleNationalityChange('ต่างชาติ')} 
            className={`flex items-center px-4 py-2 rounded-lg cursor-pointer border text-text_primary ${isOtherNation ? 'border-third' : 'border-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${isOtherNation ? 'border-third' : 'border-gray-400'}`}>
              {isOtherNation && <div className="w-2 h-2 rounded-full bg-third"></div>}
            </div>
            <span>ต่างชาติ</span>
          </div>
        </div>
        <select
          value={formData.currentCity}
          onChange={handleCityChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
        >
          <option value="">เมือง/จังหวัด</option>
          <option value="เมืองโฮจิมินห์">เมืองโฮจิมินห์</option>
          <option value="ฮานอย">ฮานอย</option>
          <option value="ดานัง">ดานัง</option>
          <option value="เว้">เว้</option>
          <option value="นาตรัง">นาตรัง</option>
        </select>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={prevStep}
          className="px-6 py-2 border border-gray-300 rounded-lg text-text_primary"
        >
          ย้อนกลับ
        </button>
        <button 
          onClick={nextStep}
          disabled={!isFormValid()}
          className={`px-6 py-2 rounded-lg flex items-center ${
            !isFormValid() 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-third text-white'
          }`}
        >
          บันทึกและส่งข้อมูล
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StepEight;
