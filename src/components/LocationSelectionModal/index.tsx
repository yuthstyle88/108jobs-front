"use client";
import { API_ROUTES } from "@/api/endpoints";
import Modal from "@/components/ui/Modal";
import { AssetIcon } from "@/constants/icons";
import {
  usePrivateFetch,
  usePrivatePost,
  usePrivatePut,
} from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountrySearch from "./components/CountrySearch";
import ProvinceSearch from "./components/ProvinceSearch";

export interface LocationForm {
  country: string;
  province: string;
}

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  handleConfirmChange: (location: string) => void;
  isLoading?: boolean;
}

const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  isOpen,
  onClose,
  onOpen,
  handleConfirmChange,
}) => {
  const { control, setValue } = useForm<LocationForm>({
    mode: "onChange",
    defaultValues: {
      country: "Thailand",
      province: "",
    },
  });

  const [selectedGeo, setSelectedGeo] = useState<"thailand" | "other">(
    "thailand"
  );

  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.get_profile
  );

  const { trigger: skipAddress, isMutating: isSkipMutating } = usePrivatePost(
    API_ROUTES.profile.skip_address
  );

  const { trigger: updateNewAddress, isMutating: isUpdateMutating } =
    usePrivatePut(API_ROUTES.profile.update_new_address);

  const [provinceConfirmed, setProvinceConfirmed] = useState<{
    en: string;
    th: string;
  } | null>(null);
  const [countryConfirmed, setCountryConfirmed] = useState<string | null>(null);

  const handleThailandClick = () => {
    setSelectedGeo("thailand");
    setValue("country", "Thailand");
    setValue("province", "");
    setCountryConfirmed(null);
  };

  const handleOtherClick = () => {
    setSelectedGeo("other");
    setValue("country", "");
    setValue("province", "");
    setProvinceConfirmed(null);
  };

  const handleConfirm = async () => {
    if (selectedGeo === "thailand" && provinceConfirmed) {
      await updateNewAddress({
        country: "Thailand",
        province: provinceConfirmed.en,
      });
      handleConfirmChange(provinceConfirmed.en);
    } else if (selectedGeo === "other" && countryConfirmed) {
      await updateNewAddress({
        country: countryConfirmed,
      });
      handleConfirmChange(countryConfirmed);
    }

    onClose();
  };

  const onSkipAddress = async () => {
    await skipAddress({ skip_days: 1 });
    onClose();
  };

  const isButtonEnabled =
    (selectedGeo === "thailand" && !!provinceConfirmed) ||
    (selectedGeo === "other" && !!countryConfirmed);

  useEffect(() => {
    if (user && user.show_country_selection_box) {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-[630px] p-2 w-full"
      closeOnOutsideClick={false}
      isBlur={true}
      showCloseButton={false}
    >
      <main className="px-[12px] w-full flex flex-col gap-3 justify-center">
        <section className="pb-4 border-b-1 border-border_secondary font-semibold text-[1.125rem] text-text_primary font-sans">
          <p className="text-base">Help us improve by sharing your location.</p>
          <p className="text-[1.5rem] text-[#1754b0]">Where are you located?</p>
        </section>

        <section className="flex items-center justify-center gap-6 flex-col my-6">
          <div className="flex flex-row gap-6">
            <div role="button" onClick={handleThailandClick}>
              <div
                className={`group ${
                  selectedGeo === "thailand"
                    ? "bg-[#f6f9fe] border-fifth grayscale-0"
                    : "bg-white border-border_secondary grayscale-[0.8]"
                } border-1 cursor-pointer flex items-center flex-col justify-center w-[170px] h-[210px] rounded-xl p-6 hover:bg-fourth`}
              >
                <Image
                  src={AssetIcon.thailand_geo}
                  alt="thailand"
                  width={500}
                  height={500}
                  className="max-w-full h-auto group-hover:grayscale-[0.4] transition-all duration-300"
                />
                <span className="text-base font-sans mt-auto font-semibold text-[0.875rem] text-[#00000099]">
                  In Thailand
                </span>
              </div>
            </div>

            <div role="button" onClick={handleOtherClick}>
              <div
                className={`group ${
                  selectedGeo === "other"
                    ? "bg-[#f6f9fe] border-fifth grayscale-0"
                    : "bg-white border-border_secondary grayscale-[0.8]"
                } border-1 cursor-pointer flex items-center flex-col justify-center w-[170px] h-[210px] rounded-xl p-6 hover:bg-fourth`}
              >
                <Image
                  src={AssetIcon.other_geo}
                  alt="other"
                  width={500}
                  height={500}
                  className="max-w-full h-auto group-hover:grayscale-[0.4] transition-all duration-300"
                />
                <span className="text-base font-sans mt-auto font-semibold text-[0.875rem] text-[#00000099]">
                  Other Countries
                </span>
              </div>
            </div>
          </div>

          {/* Input selector */}
          <div className="w-[400px] max-w-full box-border">
            {selectedGeo === "thailand" ? (
              <ProvinceSearch
                control={control}
                setValue={setValue}
                fieldName="province"
                onSelect={(en, th) => setProvinceConfirmed({ en, th })}
              />
            ) : (
              <CountrySearch
                control={control}
                setValue={setValue}
                fieldName="country"
                onSelect={(name) => setCountryConfirmed(name)}
              />
            )}
          </div>
        </section>
      </main>

      <div className="flex flex-row gap-2 justify-between items-end pt-4w-full">
        <button onClick={() => onSkipAddress()} disabled={isSkipMutating}>
          <p className="text-text_secondary font-semibold text-[18px] font-sans underline">
            Later
          </p>
        </button>
        <button
          onClick={handleConfirm}
          disabled={!isButtonEnabled || isUpdateMutating}
          className="px-6 py-[10px] cursor-pointer w-[160px] bg-blue-600 text-white font-normal rounded-md shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default LocationSelectionModal;
