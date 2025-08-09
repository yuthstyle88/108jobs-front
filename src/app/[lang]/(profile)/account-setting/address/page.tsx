"use client";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import ProvinceSelect from "@/components/ThaiAddress/ProvinceSelect";
import DistrictSelect from "@/components/ThaiAddress/DistrictSelect";
import SubdistrictSelect from "@/components/ThaiAddress/SubdistrictSelect";
import {useProvinces, useDistricts, useSubdistricts} from "@/hooks/useThaiGeography";

type CreateUpdateAddress = {
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
    const {t} = useTranslation();

    // const {profileState, person, card} = useMyUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // ฟอร์ม Address ตามสตรักต์ CreateOrUpdateAddress
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors, isSubmitting},
    } = useForm<CreateUpdateAddress>({
        mode: "onChange",
        defaultValues: {
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

    const {options: provinceOptions, loading: loadingProv} = useProvinces();
    const {options: districtOptions, loading: loadingDist} = useDistricts(provinceCode);
    const {options: subdistrictOptions, loading: loadingSub, raw: subdistrictRaw} = useSubdistricts(districtCode);

    const onSubmitAddress = async (data: CreateUpdateAddress) => {
        console.log("Submit CreateOrUpdateAddress:", data);
        // TODO: เรียก API บันทึกตามที่ต้องการ
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmitAddress)}
                className="bg-white rounded-lg text-sm text-text-primary font-sans mb-6 shadow-sm border-1 border-border-primary mt-5"
            >
                <div className="p-6 border-b">
                    <h2 className="text-[16px] font-medium mb-2 text-text-primary">{t("address.addressTitleHeading")}</h2>
                    <p className="text-gray-600 text-[14px]">{t("address.addressSubheading")}</p>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* countryId */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">{t("address.country")}</label>
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
                        <label className="block text-sm font-semibold mb-2">{t("address.addressLine1Label")}</label>
                        <input
                            {...register("addressLine1")}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third ${
                                errors.addressLine1 ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder={t("address.addressLine1Placeholder")}
                        />
                    </div>

                    {/* Address line 2 */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">{t("address.addressLine2Label")}</label>
                        <input
                            {...register("addressLine2")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third"
                            placeholder={t("address.addressLine2Placeholder")}
                        />
                    </div>

                    {/* ThaiAddressSelect */}
                    <div className="md:col-span-2">
                        <label className="block text-sm text-text-primary font-semibold mb-2">
                            {t("address.provinceDistrictSubdistrict")}
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
                                placeholder={t("address.provincePlaceholder")}
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
                                placeholder={t("address.districtPlaceholder")}
                            />
                            <SubdistrictSelect
                                value={subdistrictCode}
                                options={subdistrictOptions}
                                loading={loadingSub}
                                disabled={!districtCode}
                                onChange={(v) => {
                                    setSubdistrictCode(v);
                                    setValue("subdistrict", v ?? "");
                                    // Auto-fill postal code from local dataset (support multiple key names)
                                    const found = subdistrictRaw?.find(
                                        (s: any) => String(s.subdistrictCode ?? s.code) === String(v)
                                    );
                                    const zip = found?.postalCode;
                                    setValue("postalCode", v && zip != null ? String(zip) : "");
                                }}
                                placeholder={t("address.subdistrictPlaceholder")}
                            />
                        </div>
                    </div>

                    {/* Postal code */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">{t("address.postalCodeLabel")}</label>
                        <input
                            {...register("postalCode")}
                            readOnly
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third ${
                                errors.postalCode ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder={t("address.postalCodePlaceholder")}
                        />
                    </div>

                    {/* isDefault */}
                    <div className="md:col-span-2">
                        <label className="inline-flex items-center gap-2">
                            <input type="checkbox" {...register("isDefault")} className="h-4 w-4"/>
                            <span className="text-sm">{t("address.setDefaultAddress")}</span>
                        </label>
                    </div>
                </div>

                <div className="p-6 border-t flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {isSubmitting ? t("address.isSavingButtonLabel") : t("address.saveAddressButtonLabel")}
                    </button>
                </div>
            </form>

            <div
                className="border-1 border-border-primary rounded-lg bg-white mt-5 p-6 flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between">
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