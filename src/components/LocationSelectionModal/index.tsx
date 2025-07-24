"use client";
import { API_ROUTES } from "@/api/endpoints";
import Modal from "@/components/ui/Modal";
import { AssetIcon } from "@/constants/icons";
import {
  usePrivateFetch,
  usePrivatePost,
} from "@/hooks/api-hooks";

import { ProfileData } from "lemmy-js-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountrySearch from "./components/CountrySearch";
import ProvinceSearch from "./components/ProvinceSearch";
import {LOADING_REQUEST, RequestState} from "@/services/HttpService";

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
    API_ROUTES.profile.getProfile
  );

  const { trigger: skipAddress, isMutating: isSkipMutating } = usePrivatePost(
    API_ROUTES.profile.skipAddress
  );

  const [updateAddressState, setUpdateAddressState] = useState<RequestState<any>>(LOADING_REQUEST);
  const isUpdateMutating = updateAddressState.state === "loading";

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
    try {
      setUpdateAddressState(LOADING_REQUEST);
      
      let payload;
      let locationName = "";
      
      if (selectedGeo === "thailand" && provinceConfirmed) {
        payload = {
          country: "Thailand",
          province: provinceConfirmed.en,
        };
        locationName = provinceConfirmed.en;
      } else if (selectedGeo === "other" && countryConfirmed) {
        payload = {
          country: countryConfirmed,
        };
        locationName = countryConfirmed;
      } else {
        return; // No valid selection
      }
      
      // Make a custom fetch request to update the new address
      const response = await fetch(API_ROUTES.profile.updateNewAddress, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update address');
      }
      
      const data = await response.json();
      setUpdateAddressState({ state: "success", data });
      
      handleConfirmChange(locationName);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      setUpdateAddressState({ state: "failed", err: error as Error });
    }
  };

  const onSkipAddress = async () => {
    await skipAddress({ skipDays: 1 });
    onClose();
  };

  const isButtonEnabled =
    (selectedGeo === "thailand" && !!provinceConfirmed) ||
    (selectedGeo === "other" && !!countryConfirmed);

  useEffect(() => {
    if (user && user.showCountrySelectionBox) {
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
        <section className="pb-4 border-b-1 border-borderSecondary font-semibold text-[1.125rem] text-text-primary font-sans">
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
                    : "bg-white border-borderSecondary grayscale-[0.8]"
                } border-1 cursor-pointer flex items-center flex-col justify-center w-[170px] h-[210px] rounded-xl p-6 hover:bg-fourth`}
              >
                <Image
                  src={AssetIcon.thailandGeo}
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
                    : "bg-white border-borderSecondary grayscale-[0.8]"
                } border-1 cursor-pointer flex items-center flex-col justify-center w-[170px] h-[210px] rounded-xl p-6 hover:bg-fourth`}
              >
                <Image
                  src={AssetIcon.otherGeo}
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
          <p className="text-text-secondary font-semibold text-[18px] font-sans underline">
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
