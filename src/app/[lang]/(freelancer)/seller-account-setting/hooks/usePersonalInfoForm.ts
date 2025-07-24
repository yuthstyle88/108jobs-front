import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import useNotification from "@/hooks/useNotification";
import {ProfileData, UploadImage, UploadImageResponse} from "lemmy-js-client";
import {HttpService, isSuccess, RequestState} from "@/services/HttpService";
import {RequestOptions} from "node:http";
import {UpsertCard} from "lemmy-js-client";
import {uploadSelectedImage} from "@/utils/helpers";

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
  frontFile: File | string | null,
  backFile: File | string | null,
  frontPreview: string | null,
  backPreview: string | null,
  uploadImage: (image: UploadImage, options?: RequestOptions) => Promise<RequestState<UploadImageResponse>>,
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

  const [isUpdateMuting, setIsUpdateMuting] = useState(false);
  
  const updateCardInfo = async (data: UpsertCard) => {
    try {
      setIsUpdateMuting(true);
      const response = await HttpService.client.upsertCard(data);
      if (isSuccess(response)) {
        return response.data;
      }
    } catch (error) {
      throw error;
    } finally {
      setIsUpdateMuting(false);
    }
  };

  const { successMessage } = useNotification();

  useEffect(() => {
    if (profileData) {
      const [year, month, day] = profileData.card.birthDate?.split("-") ?? [];
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
      setSelectedFront(profileData.card.frontCard || "");
      setSelectedBack(profileData.card.backCard || "");
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
        frontUrl = await uploadSelectedImage(frontFile, uploadImage);
      }

      if (backFile) {
          backUrl = await uploadSelectedImage(backFile, uploadImage);
      }

      if (!frontUrl || !backUrl) {
        throw new Error("Thiếu URL ảnh CMND/CCCD");
      }

      const isIncompleteBirth =
        formData.birthDay === "Day" ||
        formData.birthMonth === "Month" ||
        formData.birthYear === "Year";

      const payload:  UpsertCard ={
        frontCard: frontUrl,
        backCard: backUrl,
        title: formData.title,
        name: formData.name,
        surname: formData.surname,
        birthDate: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        cardNumber: formData.cardNumber,
        addressDetails: formData.cardAddressDetails || "",
        zipCode: formData.cardZipCode,
        subdistrictOrDistrict: formData.cardSubdistrictOrDistrict,
        districtOrSubdistrict: formData.cardDistrictOrSubdistrict,
        province: formData.cardProvince,
      };

      await updateCardInfo(payload);
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
