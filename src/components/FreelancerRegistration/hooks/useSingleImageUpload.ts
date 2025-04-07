import { useRef, useState } from "react";
import { usePrivateImagePost } from "@/hooks/api-hooks";
import { ImageUploadResponse } from "@/types/image";
import { API_ROUTES } from "@/api/endpoints";

/**
 * A reusable image uploader hook for single image upload with validation and callbacks.
 */
export const useSingleImageUpload = (
  initialImage: string | null = null,
  onUploadSuccess?: (imageUrl: string | null) => void
) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { trigger: uploadImage } = usePrivateImagePost<
    ImageUploadResponse,
    FormData
  >(API_ROUTES.image.upload);

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("images[]", file);

    try {
      const result = await uploadImage(formData);
      const uploadedUrl = result?.images?.[0]?.image_url;

      if (!uploadedUrl) throw new Error("Image upload failed");

      setImageUrl(uploadedUrl);
      onUploadSuccess?.(uploadedUrl);
    } catch (err) {
      console.log("error", err);
      setError("ไม่สามารถอัปโหลดรูปได้ กรุณาลองใหม่");
    } finally {
      setIsUploading(false);
    }
  };

  const resetImage = () => {
    setImageUrl(null);
    onUploadSuccess?.(null);
  };

  return {
    imageUrl,
    setImageUrl,
    isUploading,
    error,
    fileInputRef,
    handleFileChange,
    handleSelectFile,
    resetImage,
  };
};
