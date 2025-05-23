import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { SellerContactInfo } from "@/types/language";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type Geography = {
  province_name_th: string;
  district_name_th: string;
  subdistrict_name_th: string;
  postal_code: number;
  full_address_th: string;
};

interface ZipcodeSearchProps {
  formData: {
    zip_code: string;
  };
  onSelect: (data: {
    province: string;
    district_or_subdistrict: string;
    subdistrict_or_district: string;
    zip_code: string;
  }) => void;
  language: Partial<SellerContactInfo> | null | undefined;
}
export default function ZipcodeSearch({
  formData,
  onSelect,
  language,
}: ZipcodeSearchProps) {
  const { setValue, watch } = useForm();
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: searchResults,
    error,
    isLoading,
  } = usePrivateFetchParams<{ geographies: Geography[] }>(searchUrl);

  const [zipcodeValue, setZipcodeValue] = useState("");
  const zipcode = watch("zipcode", "");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("input")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.zip_code) {
      setZipcodeValue(formData.zip_code);
      setValue("zipcode", formData.zip_code);
    }
  }, [formData.zip_code, setValue]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSearchUrl = useCallback(
    debounce((postal: string) => {
      if (postal.length >= 2) {
        setSearchUrl(`/profile/thai/geographies/search?postal=${postal}`);
      } else {
        setSearchUrl(null);
      }
      setShowDropdown(true);
    }, 500),
    []
  );

  const handleSelect = (geo: Geography) => {
    onSelect({
      province: geo.province_name_th,
      district_or_subdistrict: geo.district_name_th,
      subdistrict_or_district: geo.subdistrict_name_th,
      zip_code: geo.postal_code.toString(),
    });

    const selectedZip = geo.postal_code.toString();
    setZipcodeValue(selectedZip);
    setValue("zipcode", selectedZip);
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
        {language?.zipcode}
      </label>
      <input
        value={zipcodeValue}
        onChange={(e) => {
          const value = e.target.value;
          setZipcodeValue(value);
          setValue("zipcode", value);
          updateSearchUrl(value);
        }}
        ref={inputRef}
        placeholder={language?.zipcode_placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary transition-all"
        autoComplete="off"
        onFocus={() => {
          if (zipcodeValue.length >= 2) {
            updateSearchUrl(zipcodeValue);
          }
          setShowDropdown(true);
        }}
      />
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
                {zipcodeValue.length < 2 ? (
                  <div className="flex justify-center items-center px-3 py-3 text-[12px] font-sans text-black">
                    -- ระบุอย่างน้อย 2 ตัวอักษร --
                  </div>
                ) : (searchResults?.geographies?.length ?? 0) > 0 ? (
                  searchResults!.geographies.map((geo, index) => (
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
                      สร้างรหัสไปรษณีย์: &quot;{zipcode}&quot;
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
