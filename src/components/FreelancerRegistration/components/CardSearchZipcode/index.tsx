import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { ApplyToBeFreelancerLanguage } from "@/types/language";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";

type Geography = {
  province_name_th: string;
  district_name_th: string;
  subdistrict_name_th: string;
  postal_code: number;
  full_address_th: string;
};

interface CardZipcodeSearchProps {
  formData: {
    card_zip_code: string;
    card_subdistrict_or_district: string;
    card_district_or_subdistrict: string;
    card_province: string;
  };
  onSelect: (data: {
    card_zip_code: string;
    card_subdistrict_or_district: string;
    card_district_or_subdistrict: string;
    card_province: string;
  }) => void;
  language: Partial<ApplyToBeFreelancerLanguage> | undefined | null;
}

export default function CardZipcodeSearch({
  formData,
  onSelect,
  language,
}: CardZipcodeSearchProps) {
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: searchResults,
    error,
    isLoading,
  } = usePrivateFetchParams<{ geographies: Geography[] }>(searchUrl);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSearchUrl = useCallback(
    debounce((postal: string) => {
      if (postal.length >= 2) {
        setSearchUrl(`/profile/thai/geographies/search?postal=${postal}`);
      } else {
        setSearchUrl(null);
      }
      setShowDropdown(true);
    }, 400),
    []
  );

  useEffect(() => {
    const isValid = /^\d{5}$/.test(formData.card_zip_code || "");

    if (formData.card_zip_code === "") {
      setErrorMsg(null);
    } else if (!isValid) {
      setErrorMsg("รหัสไปรษณีย์ไม่ถูกต้อง");
    } else {
      setErrorMsg(null);
    }
  }, [formData.card_zip_code]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (value: string) => {
    if (!/^\d{0,5}$/.test(value)) return;

    const isValid = /^\d{5}$/.test(value);

    if (!isValid) {
      onSelect({
        card_zip_code: value,
        card_province: formData.card_province,
        card_district_or_subdistrict: formData.card_district_or_subdistrict,
        card_subdistrict_or_district: formData.card_subdistrict_or_district,
      });
    } else {
      onSelect({
        card_zip_code: value,
        card_province: formData.card_province,
        card_district_or_subdistrict: formData.card_district_or_subdistrict,
        card_subdistrict_or_district: formData.card_subdistrict_or_district,
      });
    }

    updateSearchUrl(value);
  };

  const handleSelect = (geo: Geography) => {
    onSelect({
      card_zip_code: geo.postal_code.toString(),
      card_province: geo.province_name_th,
      card_district_or_subdistrict: geo.district_name_th,
      card_subdistrict_or_district: geo.subdistrict_name_th,
    });
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleCreate = () => {
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm text-text_primary font-semibold mb-2">
        {language?.postal_code}
      </label>
      <input
        ref={inputRef}
        autoComplete="postal-code"
        value={formData.card_zip_code}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          if (formData.card_zip_code?.length >= 2) {
            updateSearchUrl(formData.card_zip_code);
          }
          setShowDropdown(true);
        }}
        placeholder={language?.enter_postal_code}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary transition-all"
      />

      {errorMsg && <p className="text-red-500 text-sm px-2 mt-1">{errorMsg}</p>}

      {error && (
        <p className="text-red-500 text-sm px-2">
          Failed to load data. Please try again.
        </p>
      )}

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1">
          <div className="border rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <LoadingMultiCircle />
              </div>
            ) : (
              <>
                {formData.card_zip_code.length < 2 ? (
                  <div className="flex justify-center items-center px-3 py-3 text-[12px] font-sans text-black">
                    -- {language?.min_characters} --
                  </div>
                ) : (searchResults?.geographies?.length ?? 0) > 0 ? (
                  (searchResults?.geographies ?? []).map((geo, index) => (
                    <div
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(geo);
                      }}
                      className="px-3 py-1 hover:bg-secondary cursor-pointer border-b last:border-b-0 transition-colors"
                    >
                      <p className="p-0 text-[12px] font-sans text-black">
                        {geo.full_address_th}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCreate();
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer transition-colors text-center"
                  >
                    <span className="text-[12px] font-sans text-black">
                      {language?.create_postal_code}: &quot;
                      {formData.card_zip_code}&quot;
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
