import { useState, useRef, ChangeEvent } from "react";

interface UseImageUploadOptions {
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  initialImage?: string | null;
}

interface UseImageUploadReturn {
  imagePreview: string | null;
  isLoading: boolean;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  triggerFileSelect: () => void;
  resetImage: () => void;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const useImageUpload = (
  options?: UseImageUploadOptions
): UseImageUploadReturn => {
  const {
    maxSizeMB = 5,
    acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    initialImage = null,
  } = options || {};

  const [imagePreview, setImagePreview] = useState<string | null>(initialImage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // Convert MB to bytes for size checking
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError(
        `Unsupported file type. Please select a valid image (${acceptedFileTypes.join(
          ", "
        )})`
      );
      resetFileInput();
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum allowed size is ${maxSizeMB}MB`);
      resetFileInput();
      return;
    }

    // Clear any previous errors
    setError(null);
    setIsLoading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setIsLoading(false);
    };

    reader.onerror = () => {
      setError("Error reading file. Please try again.");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);

    // Reset the input value so the same file can be selected again
    resetFileInput();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resetImage = () => {
    setImagePreview(null);
    setError(null);
    resetFileInput();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    imagePreview,
    isLoading,
    error,
    fileInputRef,
    handleFileChange,
    triggerFileSelect,
    resetImage,
    setImagePreview,
  };
};

export default useImageUpload;
