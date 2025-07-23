import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {ProfileData, SaveUserSettings} from "lemmy-js-client";
import {useEffect, useState} from "react";
import useNotification from "@/hooks/useNotification";
import {ImageUploadResponse} from "@/types/image";
import {API_ROUTES_SELLER} from "@/api/endpoints";
import {HttpService,} from "@/services";
import {LOADING_REQUEST, RequestState} from "@/services/HttpService";

// Utility function to fetch a blob using the same pattern as HttpService
const fetchBlob = async (url: string): Promise<Blob> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    console.error("Error fetching blob:", error);
    throw error;
  }
};

const profileSchema = z.object({
  displayName: z
  .string()
  .min(2,
    "Tên hiển thị phải có ít nhất 2 ký tự")
  .max(50,
    "Tên hiển thị không được quá 50 ký tự"),
  username: z
  .string()
  .min(3,
    "Username phải có ít nhất 3 ký tự")
  .max(30,
    "Username không được quá 30 ký tự"),
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
    formState: {errors, isSubmitting},
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
  });

  const [updateProfileState, setUpdateProfileState] = useState<RequestState<ProfileData>>(LOADING_REQUEST);
  const isUpdateMuting = updateProfileState.state === "loading";

  const {successMessage} = useNotification();

  useEffect(() => {
      if (profileData?.localUser) {
        const birthDate = profileData.card.birthDate;
        if (birthDate) {
          const [year, month, day] = birthDate.split("-");
          reset({
            displayName: profileData.person.displayName,
            username: profileData.person.name,
            birthDay: day || "Day",
            birthMonth: month || "Month",
            birthYear: year || "Year",
            freelancerType: profileData.profile.freelancerType,
            bio: profileData.profile.bio || "",
          });
        } else {
          reset({
            displayName: profileData.person.displayName,
            username: profileData.person.name,
            birthDay: "Day",
            birthMonth: "Month",
            birthYear: "Year",
            freelancerType: profileData.profile.freelancerType,
            bio: profileData.profile.bio || "",
          });
        }
        // Use the avatar URL from profileData
        const avatarUrl = profileData.person?.avatar;
        setSelectedImage(avatarUrl || "");
      }
    },
    [profileData, reset, setSelectedImage]);

  const onSubmit = async(formData: FormValues) => {
    try {
      setUpdateProfileState(LOADING_REQUEST);
      
      // Get the current avatar URL, preferring person.avatar if available
      let avatarUrl = profileData?.person?.avatar;

      // If a new image was selected, upload it
      if (selectedImage && selectedImage !== avatarUrl) {
        const imageFormData = new FormData();
        // Use the fetchBlob utility function instead of direct fetch
        const blob = await fetchBlob(selectedImage);
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

 
      const updateData : SaveUserSettings = {
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
        // Include person and localUser updates to ensure data consistency
        updatePerson: {
          name: formData.username,
          displayName: formData.displayName,
          avatar: avatarUrl || null,
          bio: formData.bio,
        },
        // Add localUser update to maintain data consistency
        updateLocalUser: {
          // No direct fields to update, but include for API consistency
          // This ensures the backend knows to update the localUser if needed
        },
      };

      // Then, make a custom request to update the other profile fields
      const response = await HttpService.client.saveUserSettings({
        updateData
      });
      
      if (response.state === "failed") {
        throw new Error('Failed to update profile');
      }
      setUpdateProfileState({ state: "success", data: response.data });
      
      await mutate();
      successMessage("profile", "update");
    } catch (error) {
      console.error("Update error:", error);
      setUpdateProfileState({ state: "failed", err: error as Error });
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
    updateProfileState,
  };
};
