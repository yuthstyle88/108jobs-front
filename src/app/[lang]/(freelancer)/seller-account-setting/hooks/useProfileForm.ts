import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePrivatePut } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import { useEffect } from "react";
import useNotification from "@/hooks/useNotification";
import { ImageUploadResponse } from "@/types/image";
import { API_ROUTES_SELLER } from "@/api/endpoints";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Tên hiển thị phải có ít nhất 2 ký tự")
    .max(50, "Tên hiển thị không được quá 50 ký tự"),
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(30, "Username không được quá 30 ký tự"),
    // .regex(/^[a-zA-Z0-9_]+$/, "Username chỉ chứa chữ, số và "),
  birthDay: z.string(),
  birthMonth: z.string(),
  birthYear: z.string(),
  freelancerType: z.string(),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof profileSchema>;

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
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
  });

  const { trigger: updateProfile, isMutating: isUpdateMuting } =
    usePrivatePut<ProfileData>(API_ROUTES_SELLER.profile.updateProfile);

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
          freelancerType: profileData.profile.freelancerType,
          bio: profileData.profile.bio || "",
        });
      } else {
        reset({
          displayName: profileData.user.displayName,
          username: profileData.user.username,
          birthDay: "Day",
          birthMonth: "Month",
          birthYear: "Year",
          freelancerType: profileData.profile.freelancerType,
          bio: profileData.profile.bio || "",
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
        updateUser: {
          displayName: formData.displayName,
          username: formData.username,
          avatarUrl: avatarUrl || null,
          birthDate: isIncompleteBirthDate
            ? null
            : `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        },
        freelancerType: formData.freelancerType,
        bio: formData.bio,
      };

      await updateProfile(updateData);
      await mutate();
      successMessage("profile", "update");
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
    watch,
  };
};
