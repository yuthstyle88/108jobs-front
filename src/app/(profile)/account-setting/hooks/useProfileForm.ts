import { useForm } from "react-hook-form";
import { usePrivatePut } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import { useEffect } from "react";
import useNotification from "@/hooks/useNotification";
import { ImageUploadResponse } from "@/types/image";

interface FormValues {
  display_name: string;
  username: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
}

export const useProfileForm = (
  profileData: ProfileData | undefined,
  selectedImage: string | null,
  uploadImage: (formData: FormData) => Promise<ImageUploadResponse | null>,
  mutate: () => void,
  setSelectedImage: (imageUrl: string) => void
) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const { trigger: updateProfile, isMutating: isUpdateMuting } =
    usePrivatePut<ProfileData>("/profile/info");

  const { success_message } = useNotification();

  useEffect(() => {
    if (profileData?.user) {
      const birthDate = profileData.user.birth_date;
      if (birthDate) {
        const [year, month, day] = birthDate.split("-");
        reset({
          display_name: profileData.user.display_name,
          username: profileData.user.username,
          birth_day: day || "Day",
          birth_month: month || "Month",
          birth_year: year || "Year",
        });
      } else {
        reset({
          display_name: profileData.user.display_name,
          username: profileData.user.username,
          birth_day: "Day",
          birth_month: "Month",
          birth_year: "Year",
        });
      }
      setSelectedImage(profileData.user.avatar_url);
    }
  }, [profileData, reset, setSelectedImage]);

  const onSubmit = async (formData: FormValues) => {
    try {
      let avatarUrl = profileData?.user.avatar_url;

      if (selectedImage && selectedImage !== profileData?.user.avatar_url) {
        const imageFormData = new FormData();
        const blob = await fetch(selectedImage).then((res) => res.blob());
        imageFormData.append("images[]", blob, "profile.jpg");
        const result = await uploadImage(imageFormData);
        const uploadedImageUrl = result?.images?.[0]?.image_url;
        if (!uploadedImageUrl) throw new Error("Image upload failed");
        avatarUrl = uploadedImageUrl;
      }

      const isIncompleteBirthDate =
        formData.birth_day === "Day" ||
        formData.birth_month === "Month" ||
        formData.birth_year === "Year";

      const updateData = {
        display_name: formData.display_name,
        username: formData.username,
        birth_date: isIncompleteBirthDate
          ? null
          : `${formData.birth_year}-${formData.birth_month}-${formData.birth_day}`,
        avatar_url: avatarUrl || null,
      };

      await updateProfile(updateData);
      success_message("profile", "update", null);
      await mutate();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isUpdateMuting,
    onSubmit,
  };
};
