import { useForm } from "react-hook-form";
import { usePrivatePut } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import { useEffect } from "react";
import useNotification from "@/hooks/useNotification";
import { ImageUploadResponse } from "@/types/image";
import { API_ROUTES } from "@/api/endpoints";

interface FormValues {
  displayName: string;
  username: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
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
    usePrivatePut<ProfileData>(API_ROUTES.profile.updateProfile);

  const { successMessage } = useNotification();

  useEffect(() => {
    if (profileData?.user) {
      const birthDate = profileData.user.birthDate;
      if (birthDate) {
        const [year, month, day] = birthDate.split("-");
        reset({
          displayName: profileData.user.displayName,
          username: profileData.user.username,
          birthDay: day || "Day",
          birthMonth: month || "Month",
          birthYear: year || "Year",
        });
      } else {
        reset({
          displayName: profileData.user.displayName,
          username: profileData.user.username,
          birthDay: "Day",
          birthMonth: "Month",
          birthYear: "Year",
        });
      }
      setSelectedImage(profileData.user.avatarUrl);
    }
  }, [profileData, reset, setSelectedImage]);

  const onSubmit = async (formData: FormValues) => {
    try {
      let avatarUrl = profileData?.user.avatarUrl;

      if (selectedImage && selectedImage !== profileData?.user.avatarUrl) {
        const imageFormData = new FormData();
        const blob = await fetch(selectedImage).then((res) => res.blob());
        imageFormData.append("images[]", blob, "profile.jpg");
        const result = await uploadImage(imageFormData);
        const uploadedImageUrl = result?.images?.[0]?.imageUrl;
        if (!uploadedImageUrl) throw new Error("Image upload failed");
        avatarUrl = uploadedImageUrl;
      }

      const isIncompleteBirthDate =
        formData.birthDay === "Day" ||
        formData.birthMonth === "Month" ||
        formData.birthYear === "Year";

      const updateData = {
        displayName: formData.displayName,
        username: formData.username,
        birthDate: isIncompleteBirthDate
          ? null
          : `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        avatarUrl: avatarUrl || null,
      };

      await updateProfile(updateData);
      successMessage("profile", "update");
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
