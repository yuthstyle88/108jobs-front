import { useState, useRef } from "react";
import { usePrivateImagePost } from "@/hooks/api-hooks";

export const useImageUpload = (initialImage?: string) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialImage || null
  );
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trigger: uploadImage, isMutating: isUploadMuting } =
    usePrivateImagePost<{ image_url: string }>("/image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        if (imageData) {
          localStorage.setItem("tempImageData", imageData);
          setIsImageModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    const blob = await fetch(imageUrl).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "profile.jpg");
    const result = await uploadImage(formData);
    if (result?.image_url) setSelectedImage(result.image_url);
  };

  return {
    selectedImage,
    setSelectedImage,
    isImageModalOpen,
    setIsImageModalOpen,
    fileInputRef,
    handleFileChange,
    handleImageUpload,
    isUploadMuting,
    isPasswordModalOpen,
    openPasswordModal: () => setIsPasswordModalOpen(true),
    closePasswordModal: () => setIsPasswordModalOpen(false),
  };
};
