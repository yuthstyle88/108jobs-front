import { useForm } from "react-hook-form";
import { usePrivatePut } from "@/hooks/api-hooks";

interface UseBasicInfoFormProps {
  mutateProfile: () => void;
  selectedImage: string | null;
}

export interface FormValues {
  display_name: string;
  username: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
}

export const useBasicInfoForm = ({
  mutateProfile,
  selectedImage,
}: UseBasicInfoFormProps) => {
  const { trigger: updateProfile, isMutating: isUpdateMuting } =
    usePrivatePut("/profile/info");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const handleFormSubmit = async (formData: FormValues) => {
    try {
      const updateData = {
        display_name: formData.display_name,
        username: "giang",
        birth_date: `${formData.birth_year}-${formData.birth_month}-${formData.birth_day}`,
        ...(selectedImage && { avatar_url: selectedImage }),
      };

      const response = await updateProfile(updateData);
      if (!response) throw new Error("Profile update failed");

      await mutateProfile();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    isSubmitting: isSubmitting || isUpdateMuting,
    reset,
  };
};
