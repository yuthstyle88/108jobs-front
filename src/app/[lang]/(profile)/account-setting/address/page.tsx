"use client";
import {useState, useCallback, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import ProvinceSelect from "@/components/ThaiAddress/ProvinceSelect";
import DistrictSelect from "@/components/ThaiAddress/DistrictSelect";
import SubdistrictSelect from "@/components/ThaiAddress/SubdistrictSelect";
import {useProvinces, useDistricts, useSubdistricts} from "@/hooks/useThaiGeography";
import useNotification from "@/hooks/useNotification";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {HttpService, REQUEST_STATE} from "@/services/HttpService";

type CreateUpdateAddress = {
    addressLine1: string;
    addressLine2?: string;
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
    countryId: string;
    isDefault?: boolean;
};

const createAddressSchema = (t: any) =>
    z.object({
        addressLine1: z.string().min(1, t("address.addressLine1Required")),
        addressLine2: z.string().optional(),
        subdistrict: z.string().min(1, t("address.subdistrictRequired")),
        district: z.string().min(1, t("address.districtRequired")),
        province: z.string().min(1, t("address.provinceRequired")),
        postalCode: z.string().min(1, t("address.postalCodeRequired")),
        countryId: z.string().min(1, t("address.countryRequired")),
        isDefault: z.boolean().optional(),
    });

export default function Address() {
    const {t} = useTranslation();
    const {successMessage} = useNotification();
    const {address, profileState} = useMyUser();
    const [apiError, setApiError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    const addressSchema = createAddressSchema(t);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isSubmitting, isDirty},
    } = useForm<CreateUpdateAddress>({
        resolver: zodResolver(addressSchema),
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

    const [provinceCode, setProvinceCode] = useState<string | undefined>(undefined);
    const [districtCode, setDistrictCode] = useState<string | undefined>(undefined);
    const [subdistrictCode, setSubdistrictCode] = useState<string | undefined>(undefined);

    const {options: provinceOptions, loading: loadingProv, raw: provinceRaw} = useProvinces();
    const {options: districtOptions, loading: loadingDist} = useDistricts(provinceCode);
    const {options: subdistrictOptions, loading: loadingSub, raw: subdistrictRaw} = useSubdistricts(districtCode);

    // Initialize form with address data from useMyUser
    useEffect(() => {
        if (profileState !== "success" || !address || isReady || loadingProv || !provinceRaw.length) return;

        const provinceCodeFound = String(address.province || "");
        const districtCodeFound = String(address.district || "");
        const subdistrictCodeFound = String(address.subdistrict || "");

        // Set form values with codes
        reset({
            addressLine1: address.addressLine1 || "",
            addressLine2: address.addressLine2 || "",
            subdistrict: subdistrictCodeFound,
            district: districtCodeFound,
            province: provinceCodeFound,
            postalCode: address.postalCode || "",
            countryId: address.countryId || "TH",
            isDefault: address.isDefault || false,
        });

        setProvinceCode(provinceCodeFound || undefined);
        setDistrictCode(districtCodeFound || undefined);
        setSubdistrictCode(subdistrictCodeFound || undefined);
        setIsReady(true);
    }, [profileState, address, isReady, reset, provinceRaw, loadingProv]);

    // Reset district and subdistrict when province changes
    useEffect(() => {
        if (!provinceCode) {
            setDistrictCode(undefined);
            setSubdistrictCode(undefined);
            setValue("district", "", {shouldValidate: true});
            setValue("subdistrict", "", {shouldValidate: true});
            setValue("postalCode", "", {shouldValidate: true});
        }
    }, [provinceCode, setValue]);

    // Reset subdistrict when district changes  
    useEffect(() => {
        if (!districtCode) {
            setSubdistrictCode(undefined);
            setValue("subdistrict", "", {shouldValidate: true});
            setValue("postalCode", "", {shouldValidate: true});
        }
    }, [districtCode, setValue]);

    const onSubmitAddress = useCallback(
        async (data: CreateUpdateAddress) => {
            try {
                setApiError(null);

                const payload: CreateUpdateAddress = {
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2 || undefined,
                    subdistrict: subdistrictCode || "",
                    district: districtCode || "",
                    province: provinceCode || "",
                    postalCode: data.postalCode,
                    countryId: data.countryId,
                    isDefault: data.isDefault || false,
                };

                const addressRes = await HttpService.client.updateAddress(payload);

                switch (addressRes.state) {
                    case REQUEST_STATE.SUCCESS: {
                        successMessage("profile", "update");
                        break;
                    }
                    case REQUEST_STATE.FAILED: {
                        setApiError(t(`address.${addressRes.err.name}`) || t("address.updateFailed"));
                        break;
                    }
                }
            } catch (error) {
                setApiError(t("address.updateFailed"));
            }
        },
        [t, successMessage, provinceCode, districtCode, subdistrictCode]
    );

    const isFormValid = !errors.addressLine1 && !errors.province && !errors.district && !errors.subdistrict && !errors.postalCode;

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
                    {apiError && <div className="md:col-span-2 text-red-500 text-[12px] font-sans">{apiError}</div>}

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
                        {errors.countryId && (
                            <p className="text-red-500 text-[12px] font-sans mt-1">{errors.countryId.message}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">{t("address.addressLine1Label")}</label>
                        <input
                            {...register("addressLine1")}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-third ${
                                errors.addressLine1 ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder={t("address.addressLine1Placeholder")}
                        />
                        {errors.addressLine1 && (
                            <p className="text-red-500 text-[12px] font-sans mt-1">{errors.addressLine1.message}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">{t("address.addressLine2Label")}</label>
                        <input
                            {...register("addressLine2")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third"
                            placeholder={t("address.addressLine2Placeholder")}
                        />
                    </div>

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
                                    setValue("province", v || "", {shouldValidate: true});
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
                                    setValue("district", v || "", {shouldValidate: true});
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
                                    setValue("subdistrict", v || "", {shouldValidate: true});
                                    const found = subdistrictRaw?.find((s) => String(s.subdistrictCode) === String(v));
                                    setValue("postalCode", found?.postalCode ? String(found.postalCode) : "", {shouldValidate: true});
                                }}
                                placeholder={t("address.subdistrictPlaceholder")}
                            />
                        </div>
                        {errors.province && (
                            <p className="text-red-500 text-[12px] font-sans mt-1">{errors.province.message}</p>
                        )}
                        {errors.district && (
                            <p className="text-red-500 text-[12px] font-sans mt-1">{errors.district.message}</p>
                        )}
                        {errors.subdistrict && (
                            <p className="text-red-500 text-[12px] font-sans mt-1">{errors.subdistrict.message}</p>
                        )}
                    </div>

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
                        {errors.postalCode && (
                            <p className="text-red-500 text-[12px] font-sans mt-1">{errors.postalCode.message}</p>
                        )}
                    </div>

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
                        disabled={isSubmitting || !isDirty || !isFormValid}
                        className={`px-4 py-2 rounded text-white transition-colors ${
                            isSubmitting || !isDirty || !isFormValid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isSubmitting ? t("address.isSavingButtonLabel") : t("address.saveAddressButtonLabel")}
                    </button>
                </div>
            </form>
        </>
    );
}