import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { usePrivatePut } from "@/hooks/api-hooks";
import useNotification from "@/hooks/useNotification";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import { ImageUploadResponse } from "@/types/image";
import { ProfileData } from "@/types/userData";

const cardSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập thông tin"),
  name: z.string().min(1, "Vui lòng nhập thông tin"),
  surname: z.string().min(1, "Vui lòng nhập thông tin"),
  birthDay: z.string(),
  birthMonth: z.string(),
  birthYear: z.string(),
  cardNumber: z.string().regex(/^\d{13}$/, "Vui lòng nhập số CMND/CCCD 12 số"),
  cardAddressDetails: z.string().min(1, "Vui lòng nhập thông tin"),
  cardZipCode: z.string().min(1, "Vui lòng nhập thông tin"),
  cardSubdistrictOrDistrict: z.string().min(1, "Vui lòng nhập thông tin"),
  cardDistrictOrSubdistrict: z.string().min(1, "Vui lòng nhập thông tin"),
  cardProvince: z.string().min(1, "Vui lòng nhập thông tin"),
});

type FormValues = z.infer<typeof cardSchema>;

export const usePersonalInfoForm = (
  profileData: ProfileData | undefined,
  frontFile: File | null,
  backFile: File | null,
  frontPreview: string | null,
  backPreview: string | null,
  uploadImage: (formData: FormData) => Promise<ImageUploadResponse | null>,
  mutate: () => void,
  setSelectedFront: (imageUrl: string) => void,
  setSelectedBack: (imageUrl: string) => void
) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(cardSchema),
  });

  const { trigger: updateCardInfo, isMutating: isUpdateMuting } = usePrivatePut(
    API_ROUTES_SELLER.profile.updatePersonalInfo
  );

  const { successMessage } = useNotification();

  useEffect(() => {
    if (profileData) {
      const [year, month, day] = profileData.user.birthDate?.split("-") ?? [];
      reset({
        title: profileData.card.title,
        name: profileData.card.name,
        surname: profileData.card.surname,
        birthDay: day || "Day",
        birthMonth: month || "Month",
        birthYear: year || "Year",
        cardNumber: profileData.card.cardNumber,
        cardAddressDetails: profileData.card.addressDetails,
        cardZipCode: profileData.card.zipCode,
        cardSubdistrictOrDistrict: profileData.card.subdistrictOrDistrict,
        cardDistrictOrSubdistrict: profileData.card.districtOrSubdistrict,
        cardProvince: profileData.card.province,
      });
      setSelectedFront(profileData.card.frontCard);
      setSelectedBack(profileData.card.backCard);
    }
  }, [profileData, reset, setSelectedFront, setSelectedBack]);

  const onSubmit = async (formData: FormValues) => {
    try {
      if (!frontPreview || !backPreview) {
        setError("root", {
          type: "manual",
          message: "Vui lòng tải lên cả ảnh mặt trước và mặt sau",
        });
        return;
      }

      let frontUrl = profileData?.card.frontCard;
      let backUrl = profileData?.card.backCard;

      if (frontFile) {
        const frontForm = new FormData();
        frontForm.append("images[]", frontFile);
        const result = await uploadImage(frontForm);
        frontUrl = result?.images?.[0]?.imageUrl;
        if (!frontUrl) throw new Error("Upload ảnh mặt trước thất bại");
      }

      if (backFile) {
        const backForm = new FormData();
        backForm.append("images[]", backFile);
        const result = await uploadImage(backForm);
        backUrl = result?.images?.[0]?.imageUrl;
        if (!backUrl) throw new Error("Upload ảnh mặt sau thất bại");
      }

      if (!frontUrl || !backUrl) {
        throw new Error("Thiếu URL ảnh CMND/CCCD");
      }

      const isIncompleteBirth =
        formData.birthDay === "Day" ||
        formData.birthMonth === "Month" ||
        formData.birthYear === "Year";

      const payload = {
        frontCard: frontUrl,
        backCard: backUrl,
        title: formData.title,
        name: formData.name,
        surname: formData.surname,
        birthDate: isIncompleteBirth
          ? null
          : `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        cardNumber: formData.cardNumber,
        cardAddressDetails: formData.cardAddressDetails,
        cardZipCode: formData.cardZipCode,
        cardSubdistrictOrDistrict: formData.cardSubdistrictOrDistrict,
        cardDistrictOrSubdistrict: formData.cardDistrictOrSubdistrict,
        cardProvince: formData.cardProvince,
      };

      await updateCardInfo(payload);
      await mutate();
      successMessage("profile", "update");
    } catch (error) {
      console.error("Lỗi cập nhật thẻ:", error);
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Có lỗi xảy ra",
      });
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
