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
  display_name: z
    .string()
    .min(2, "Tên hiển thị phải có ít nhất 2 ký tự")
    .max(50, "Tên hiển thị không được quá 50 ký tự"),
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(30, "Username không được quá 30 ký tự"),
    // .regex(/^[a-zA-Z0-9_]+$/, "Username chỉ chứa chữ, số và _"),
  birth_day: z.string(),
  birth_month: z.string(),
  birth_year: z.string(),
  freelancer_type: z.string(),
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
    usePrivatePut<ProfileData>(API_ROUTES_SELLER.profile.update_Profile);

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
          freelancer_type: profileData.profile.freelancer_type,
          bio: profileData.profile.bio || "",
        });
      } else {
        reset({
          display_name: profileData.user.display_name,
          username: profileData.user.username,
          birth_day: "Day",
          birth_month: "Month",
          birth_year: "Year",
          freelancer_type: profileData.profile.freelancer_type,
          bio: profileData.profile.bio || "",
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
        update_user: {
          display_name: formData.display_name,
          username: formData.username,
          avatar_url: avatarUrl || null,
          birth_date: isIncompleteBirthDate
            ? null
            : `${formData.birth_year}-${formData.birth_month}-${formData.birth_day}`,
        },
        freelancer_type: formData.freelancer_type,
        bio: formData.bio,
      };

      await updateProfile(updateData);
      await mutate();
      success_message("profile", "update", null);
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
