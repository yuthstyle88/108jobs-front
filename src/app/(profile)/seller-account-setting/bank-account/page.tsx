"use client";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const BankAccount = () => {
  const [qrImage, setQrImage] = useState<string>(
    "/lovable-uploads/48265f16-fe13-43a1-9d7e-9b24975b0217.png"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: sellerBankAccountLanguage } = useGlobalTranslate(
    LanguageFile.SELLER_BANK_ACCOUNT
  );

  const { data: global } = useGlobalTranslate(
    LanguageFile.GLOBAL
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setQrImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    console.log("Saving account settings");
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">
          {sellerBankAccountLanguage?.bank_info_title}
        </h2>
        <p className="text-sm text-gray-500">
          {sellerBankAccountLanguage?.bank_info_description}
        </p>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {sellerBankAccountLanguage?.bank_qr_upload_title}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {sellerBankAccountLanguage?.bank_qr_upload_note}
          </p>

          <div className="flex items-center justify-center p-6 bg-gray-100 rounded-lg mb-4">
            <Image
              src={qrImage}
              alt="ProfileImage"
              width={200}
              height={200}
              className="max-h-60"
            />
          </div>

          <button
            onClick={handleUploadClick}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mx-auto"
          >
            <Upload className="w-5 h-5 mr-2" />
            {sellerBankAccountLanguage?.upload_button}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sellerBankAccountLanguage?.bank_name_label}
          </label>
          <select className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option selected disabled>
              {sellerBankAccountLanguage?.bank_name_placeholder}
            </option>
            <option>VietComBank</option>
            <option>BIDV</option>
            <option>Techcombank</option>
            <option>VPBank</option>
            <option>MB Bank</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sellerBankAccountLanguage?.bank_account_number_label}
          </label>
          <input
            type="text"
            placeholder={
              sellerBankAccountLanguage?.bank_account_number_placeholder
            }
            className="text-text_primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {global?.button_save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankAccount;
