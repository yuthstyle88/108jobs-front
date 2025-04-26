
import { ChangeEvent, useRef, useState } from "react";

interface UseMultiImageUploadOptions {
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  maxImages?: number;
}

const useMultiImageUpload = (options?: UseMultiImageUploadOptions) => {
  const {
    maxSizeMB = 5,
    acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxImages = 30,
  } = options || {};

  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newErrors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!acceptedFileTypes.includes(file.type)) {
        newErrors.push(`${file.name}: Định dạng không hợp lệ.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        newErrors.push(`${file.name}: Dung lượng vượt quá ${maxSizeMB}MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImages((prev) => {
          if (prev.length >= maxImages) {
            newErrors.push(`Chỉ được phép tải lên tối đa ${maxImages} ảnh.`);
            return prev;
          }
          return [...prev, result];
        });
      };
      reader.readAsDataURL(file);
    });

    setErrors(newErrors);
    resetFileInput();
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setImages([]);
    setErrors([]);
    resetFileInput();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return {
    images,
    errors,
    fileInputRef,
    handleFilesChange,
    removeImage,
    reset,
    triggerSelect,
    setImages,
  };
};

export default useMultiImageUpload;
