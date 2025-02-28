
import React from 'react';

interface StepSixProps {
  formData: {
    title: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    address: string;
    district: string;
    province: string;
    postalCode: string;
  };
  updateFormData: (data: Partial<StepSixProps['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const StepSix: React.FC<StepSixProps> = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const isFormValid = () => {
    return (
      formData.title !== '' &&
      formData.firstName !== '' &&
      formData.lastName !== '' &&
      formData.idNumber !== '' &&
      formData.address !== '' &&
      formData.district !== '' &&
      formData.province !== '' &&
      formData.postalCode !== ''
    );
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text_primary">ข้อมูลบัตรประชาชนเพื่อออกเอกสาร</h2>
        <p className="text-text_secondary mt-2">อย่าลืมเช็คความถูกต้องก่อนทำการบันทึก</p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:pr-4 mb-6 md:mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                คำนำหน้าชื่อ
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
              >
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>
            
            <div className="col-span-1"></div>

            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                ชื่อ
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                placeholder="ระบุชื่อจริง"
              />
            </div>
            
            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                นามสกุล
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                placeholder="ระบุนามสกุลจริง"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-text_primary font-semibold mb-2">
              เลขบัตรประชาชน
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
              placeholder="ระบุเลขบัตรประชาชน 13 หลัก"
              maxLength={13}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-text_primary font-semibold mb-2">
              ที่อยู่ตามบัตรประชาชน
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
              placeholder="ระบุที่อยู่, หมู่, ถนน, ซอย"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                ตำบล/แขวง
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                placeholder="ระบุตำบล/แขวง"
              />
            </div>
            
            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                รหัสไปรษณีย์
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                placeholder="ระบุรหัสไปรษณีย์"
                maxLength={5}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                อำเภอ/เขต
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                placeholder="ระบุอำเภอ/เขต"
              />
            </div>
            
            <div>
              <label className="block text-sm text-text_primary font-semibold mb-2">
                จังหวัด
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary"
                placeholder="ระบุจังหวัด"
              />
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 md:pl-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-blue-50">
            <div className="p-6">
              <h3 className="font-bold text-lg text-third mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                ใบเสร็จรับเงิน
              </h3>
              <div className="text-xs text-gray-500 mb-2">Fastwork</div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">ผู้ขาย:</p>
                  <p className="text-sm text-text_primary">
                    {formData.title && formData.firstName && formData.lastName
                      ? `${formData.title} ${formData.firstName} ${formData.lastName}`
                      : 'ยังไม่ระบุ'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ลูกค้า:</p>
                  <p className="text-sm text-text_primary">ยังไม่ระบุ</p>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="h-3 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-48 bg-gray-300 rounded mb-2"></div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-third rounded"></div>
                  <div className="h-3 w-20 bg-third rounded"></div>
                  <div className="h-3 w-20 bg-third rounded"></div>
                </div>
                
                <div className="mt-4">
                  <div className="h-3 w-full bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-full bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-full bg-gray-300 rounded mb-2"></div>
                </div>
              </div>
            </div>
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
          บันทึก และไปต่อ
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StepSix;
