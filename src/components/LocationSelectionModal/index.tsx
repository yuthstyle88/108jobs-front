"use client";
import Modal from "@/components/ui/Modal";
import { AssetIcon } from "@/constants/icons";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ProvinceSearch from "./components/ProvinceSearch";
import CountrySearch from "./components/CountrySearch";

export interface LocationForm {
  country: string;
  province: string;
}

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: (location: string) => void;
  isLoading?: boolean;
}

const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  isOpen,
  onClose,
  handleConfirmChange,
}) => {
  const { control,  setValue } = useForm<LocationForm>({
  mode: "onChange",
  defaultValues: {
    country: "Thailand",
    province: "",
  },
});

  const [selectedGeo, setSelectedGeo] = useState<"thailand" | "other">(
    "thailand"
  );

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

  const handleConfirm = () => {
    const location =
      selectedGeo === "thailand" && provinceConfirmed
        ? provinceConfirmed.th
        : countryConfirmed;

    if (location) {
      handleConfirmChange(location);
    }
  };

  const isButtonEnabled =
    (selectedGeo === "thailand" && !!provinceConfirmed) ||
    (selectedGeo === "other" && !!countryConfirmed);

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
        <button onClick={onClose}>
          <p className="text-text_secondary font-semibold text-[18px] font-sans underline">
            Later
          </p>
        </button>
        <button
          onClick={handleConfirm}
          disabled={!isButtonEnabled}
          className="px-6 py-[10px] cursor-pointer w-[160px] bg-blue-600 text-white font-normal rounded-md shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default LocationSelectionModal;
