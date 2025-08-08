"use client";
import {useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useProfileForm} from "../hooks/useProfileForm";
import {useImagePicker} from "@/hooks/useImagePicker";
import {useHttpPost} from "@/hooks/useHttpPost";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import ProvinceSelect from "@/components/ThaiAddress/ProvinceSelect";
import DistrictSelect from "@/components/ThaiAddress/DistrictSelect";
import SubdistrictSelect from "@/components/ThaiAddress/SubdistrictSelect";
import { useProvinces, useDistricts, useSubdistricts } from "@/hooks/useThaiGeography";

type CreateOrUpdateAddress = {
    localUserId: number;
    addressLine1: string;
    addressLine2?: string;
    subdistrict?: string;
    district: string;
    province: string;
    postalCode: string;
    countryId: string;
    isDefault?: boolean;
};

export default function Address() {
    const { t } = useTranslation();

    const {execute: uploadImage, isMutating: isUploadMuting} =
        useHttpPost("uploadImage");

    const {profileState, person, card} = useMyUser();

    const {
        selectedImage,
        setSelectedImage,
    } = useImagePicker(profileState === "success" ? person?.avatar : undefined);

    const {
        register: profileRegister,
        handleSubmit: handleProfileSubmit,
        errors: profileErrors,
        isSubmitting: isProfileSubmitting,
        onSubmit: onSubmitProfile,
    } = useProfileForm(
        person,
        card,
        selectedImage,
        uploadImage,
        setSelectedImage
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // ฟอร์ม Address ตามสตรักต์ CreateOrUpdateAddress
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateOrUpdateAddress>({
        mode: "onChange",
        defaultValues: {
            localUserId: 0,
            addressLine1: "",
            addressLine2: "",
            subdistrict: "",
            district: "",
            province: "",
            postalCode: "",
            countryId: "TH",
            isDefault: false,
        },
    });

    // Cascading TH address (using hooks + presentational selects)
    const [provinceCode, setProvinceCode] = useState<string | undefined>(undefined);
    const [districtCode, setDistrictCode] = useState<string | undefined>(undefined);
    const [subdistrictCode, setSubdistrictCode] = useState<string | undefined>(undefined);

    const { options: provinceOptions, loading: loadingProv } = useProvinces();
    const { options: districtOptions, loading: loadingDist } = useDistricts(provinceCode);
    const { options: subdistrictOptions, loading: loadingSub } = useSubdistricts(districtCode);

    const onSubmitAddress = async (data: CreateOrUpdateAddress) => {
        // data.province / data.district / data.subdistrict จะมาจาก ThaiAddressSelect โดยตรง
        console.log("Submit CreateOrUpdateAddress:", data);
        // TODO: เรียก API บันทึกตามที่ต้องการ
    };

    return (
        <>
            {/* การ์ดฟอร์มที่อยู่ใหม่ ตามสไตล์เดิม + ThaiAddressSelect */}
            <form
                onSubmit={handleSubmit(onSubmitAddress)}
                className="bg-white rounded-lg text-sm text-text-primary font-sans mb-6 shadow-sm border-1 border-border-primary mt-5"
            >
                <div className="p-6 border-b">
                    <h2 className="text-[16px] font-medium mb-2 text-text-primary">ข้อมูลที่อยู่</h2>
                    <p className="text-gray-600 text-[14px]">กรุณากรอกข้อมูลให้ครบถ้วน</p>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* localUserId */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Local User ID</label>
                        <input
                            type="number"
                            {...register("localUserId", { valueAsNumber: true })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third ${
                                errors.localUserId ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="เช่น 1"
                        />
                    </div>

                    {/* countryId */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">ประเทศ</label>
                        <select
                            {...register("countryId")}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third ${
                                errors.countryId ? "border-red-500" : "border-gray-300"
                            }`}
                        >
                            <option value="TH">Thailand</option>
                        </select>
                    </div>

                    {/* Address line 1 */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">ที่อยู่บรรทัดที่ 1</label>
                        <input
                            {...register("addressLine1")}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third ${
                                errors.addressLine1 ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="บ้านเลขที่, หมู่บ้าน, ถนน"
                        />
                    </div>

                    {/* Address line 2 */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">ที่อยู่บรรทัดที่ 2 (ไม่บังคับ)</label>
                        <input
                            {...register("addressLine2")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third"
                            placeholder="อาคาร, ชั้น, ห้อง (ถ้ามี)"
                        />
                    </div>

                    {/* ThaiAddressSelect */}
                    <div className="md:col-span-2">
                        <label className="block text-sm text-text-primary font-semibold mb-2">
                            จังหวัด / อำเภอ / ตำบล
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <ProvinceSelect
                            value={provinceCode}
                            options={provinceOptions}
                            loading={loadingProv}
                            onChange={(v) => {
                              setProvinceCode(v);
                              setDistrictCode(undefined);
                              setSubdistrictCode(undefined);
                              setValue("province", v ?? "");
                              setValue("district", "");
                              setValue("subdistrict", "");
                            }}
                            placeholder="เลือกจังหวัด"
                          />
                          <DistrictSelect
                            value={districtCode}
                            options={districtOptions}
                            loading={loadingDist}
                            disabled={!provinceCode}
                            onChange={(v) => {
                              setDistrictCode(v);
                              setSubdistrictCode(undefined);
                              setValue("district", v ?? "");
                              setValue("subdistrict", "");
                            }}
                            placeholder="เลือกอำเภอ"
                          />
                          <SubdistrictSelect
                            value={subdistrictCode}
                            options={subdistrictOptions}
                            loading={loadingSub}
                            disabled={!districtCode}
                            onChange={(v) => {
                              setSubdistrictCode(v);
                              setValue("subdistrict", v ?? "");
                            }}
                            placeholder="เลือกตำบล"
                          />
                        </div>
                    </div>

                    {/* Postal code */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">รหัสไปรษณีย์</label>
                        <input
                            {...register("postalCode")}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third ${
                                errors.postalCode ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="เช่น 10310"
                        />
                    </div>

                    {/* isDefault */}
                    <div className="md:col-span-2">
                        <label className="inline-flex items-center gap-2">
                            <input type="checkbox" {...register("isDefault")} className="h-4 w-4" />
                            <span className="text-sm">ตั้งเป็นที่อยู่เริ่มต้น</span>
                        </label>
                    </div>
                </div>

                <div className="p-6 border-t flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {isSubmitting ? "กำลังบันทึก..." : "บันทึกที่อยู่"}
                    </button>
                </div>
            </form>

            <div className="border-1 border-border-primary rounded-lg bg-white mt-5 p-6 flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between">
                <div className="text-[16px] text-text-primary font-medium">
                    {t("profileInfo.sectionPassword")}
                    <p className="text-[14px] text-text-secondary font-normal">
                        {t("profileInfo.passwordDescription")}
                    </p>
                </div>
                <div className="self-end w-full sm:w-fit">
                    <button
                        onClick={openModal}
                        className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t("profileInfo.buttonSetPassword")}
                    </button>
                </div>
            </div>
        </>
    );
}