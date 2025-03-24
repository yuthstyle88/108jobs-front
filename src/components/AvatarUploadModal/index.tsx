
"use client";
import { Image, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ImageEditor from "../AvatarEditor";
import Modal from "../ui/Modal";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onImageUpload,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load image from localStorage if available when modal opens
  useEffect(() => {
    if (isOpen) {
      const tempImageData = localStorage.getItem('tempImageData');
      if (tempImageData) {
        setSelectedImage(tempImageData);
        localStorage.removeItem('tempImageData'); // Clear after loading
      }
    } else {
      // Only reset the selected image when the modal closes
      setSelectedImage(null);
    }
  }, [isOpen]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Reset the input value after reading
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  const handleChangeImage = () => {
    // Store the intent to change the image in localStorage
    localStorage.setItem('changingImage', 'true');
    // Close the current modal
    onClose();
    // Set timeout to allow the modal to close before opening file picker
    setTimeout(() => {
      // Trigger file picker from the main page
      const uploadBtn = document.getElementById('uploadProfileImageBtn');
      if (uploadBtn) {
        uploadBtn.click();
      }
    }, 300);
  };
  
  const handleSaveImage = (canvas: HTMLCanvasElement) => {
    const imageUrl = canvas.toDataURL('image/png');
    onImageUpload(imageUrl);
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ภาพโปรไฟล์"
      className="max-w-md w-full"
    >
      <div className="space-y-4">
        {!selectedImage ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="bg-gray-100 rounded-full p-4">
              <Image className="h-12 w-12 text-gray-400" aria-label="User profile icon"/>
            </div>
            <p className="text-gray-600 text-center">
              อัปโหลดรูปโปรไฟล์ของคุณ
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button 
              onClick={handleSelectFile} 
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              <span>เลือกรูปภาพ</span>
            </button>
          </div>
        ) : (
          <div>
            <ImageEditor 
              imageSrc={selectedImage} 
              onSave={handleSaveImage}
              onChangeImage={handleChangeImage}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageUploadModal;
