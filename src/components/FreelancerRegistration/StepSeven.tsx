
import React from 'react';

interface StepSevenProps {
  formData: {
    birthDay: string;
    birthMonth: string;
    birthYear: string;
  };
  updateFormData: (data: Partial<StepSevenProps['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const StepSeven: React.FC<StepSevenProps> = ({ formData, updateFormData, nextStep, prevStep }) => {
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => (currentYear - i).toString());

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ birthDay: e.target.value });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ birthMonth: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ birthYear: e.target.value });
  };

  const isFormValid = () => {
    return formData.birthDay !== '' && formData.birthMonth !== '' && formData.birthYear !== '';
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text_primary">คุณเกิดวันอะไร?</h2>
        <p className="text-text_secondary mt-2">อายุไม่มีผลต่อการจ้างงานแต่มีผลต่อกฎหมายแรงงาน</p>
      </div>

      <div className="mb-8">
        <div className="text-sm font-medium text-text_primary mb-2">วันเกิด</div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <select
              value={formData.birthDay}
              onChange={handleDayChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
            >
              <option value="">วัน</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={formData.birthMonth}
              onChange={handleMonthChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
            >
              <option value="">เดือน</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={formData.birthYear}
              onChange={handleYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
            >
              <option value="">ปี</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
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
          บันทึกและดำเนินการต่อ
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StepSeven;
