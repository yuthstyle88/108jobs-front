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
  birth_day: z.string(),
  birth_month: z.string(),
  birth_year: z.string(),
  card_number: z.string().regex(/^\d{13}$/, "Vui lòng nhập số CMND/CCCD 12 số"),
  card_address_details: z.string().min(1, "Vui lòng nhập thông tin"),
  card_zip_code: z.string().min(1, "Vui lòng nhập thông tin"),
  card_subdistrict_or_district: z.string().min(1, "Vui lòng nhập thông tin"),
  card_district_or_subdistrict: z.string().min(1, "Vui lòng nhập thông tin"),
  card_province: z.string().min(1, "Vui lòng nhập thông tin"),
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
    API_ROUTES_SELLER.profile.update_personal_info
  );

  const { success_message } = useNotification();

  useEffect(() => {
    if (profileData) {
      const [year, month, day] = profileData.user.birth_date?.split("-") ?? [];
      reset({
        title: profileData.card.title,
        name: profileData.card.name,
        surname: profileData.card.surname,
        birth_day: day || "Day",
        birth_month: month || "Month",
        birth_year: year || "Year",
        card_number: profileData.card.card_number,
        card_address_details: profileData.card.address_details,
        card_zip_code: profileData.card.zip_code,
        card_subdistrict_or_district: profileData.card.subdistrict_or_district,
        card_district_or_subdistrict: profileData.card.district_or_subdistrict,
        card_province: profileData.card.province,
      });
      setSelectedFront(profileData.card.front_card);
      setSelectedBack(profileData.card.back_card);
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

      let frontUrl = profileData?.card.front_card;
      let backUrl = profileData?.card.back_card;

      if (frontFile) {
        const frontForm = new FormData();
        frontForm.append("images[]", frontFile);
        const result = await uploadImage(frontForm);
        frontUrl = result?.images?.[0]?.image_url;
        if (!frontUrl) throw new Error("Upload ảnh mặt trước thất bại");
      }

      if (backFile) {
        const backForm = new FormData();
        backForm.append("images[]", backFile);
        const result = await uploadImage(backForm);
        backUrl = result?.images?.[0]?.image_url;
        if (!backUrl) throw new Error("Upload ảnh mặt sau thất bại");
      }

      if (!frontUrl || !backUrl) {
        throw new Error("Thiếu URL ảnh CMND/CCCD");
      }

      const isIncompleteBirth =
        formData.birth_day === "Day" ||
        formData.birth_month === "Month" ||
        formData.birth_year === "Year";

      const payload = {
        front_card: frontUrl,
        back_card: backUrl,
        title: formData.title,
        name: formData.name,
        surname: formData.surname,
        birth_date: isIncompleteBirth
          ? null
          : `${formData.birth_year}-${formData.birth_month}-${formData.birth_day}`,
        card_number: formData.card_number,
        card_address_details: formData.card_address_details,
        card_zip_code: formData.card_zip_code,
        card_subdistrict_or_district: formData.card_subdistrict_or_district,
        card_district_or_subdistrict: formData.card_district_or_subdistrict,
        card_province: formData.card_province,
      };

      await updateCardInfo(payload);
      await mutate();
      success_message("profile", "update", null);
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
