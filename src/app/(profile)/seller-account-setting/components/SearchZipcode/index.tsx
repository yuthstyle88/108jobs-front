import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Control,
  FieldError,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { AddressFormData } from "../../contact-info/page";

type Geography = {
  province_name_th: string;
  district_name_th: string;
  subdistrict_name_th: string;
  postal_code: number;
  full_address_th: string;
};

interface ZipcodeSearchProps {
  control: Control<AddressFormData>;
  setValue: UseFormSetValue<AddressFormData>;
  error?: FieldError;
}

export default function ZipcodeSearch({
  control,
  setValue,
  error,
}: ZipcodeSearchProps) {
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: searchResults,
    error: searchError,
    isLoading,
  } = usePrivateFetchParams<{ geographies: Geography[] }>(searchUrl);

  const zipCode = useWatch({ control, name: "zip_code" });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((postal: string) => {
        if (postal.length >= 2) {
          setSearchUrl(`/profile/thai/geographies/search?postal=${postal}`);
          setShowDropdown(true);
        } else {
          setSearchUrl(null);
          setShowDropdown(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSelect = (geo: Geography) => {
    setValue("province", geo.province_name_th, { shouldValidate: true });
    setValue("district_or_subdistrict", geo.district_name_th, {
      shouldValidate: true,
    });
    setValue("subdistrict_or_district", geo.subdistrict_name_th, {
      shouldValidate: true,
    });
    setValue("zip_code", geo.postal_code.toString(), { shouldValidate: true });
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm text-text_primary font-semibold mb-2">
        รหัสไปรษณีย์
      </label>
      <input
        ref={inputRef}
        value={zipCode ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          setValue("zip_code", value, { shouldValidate: true });
          debouncedSearch(value);
        }}
        onFocus={() => {
          if ((zipCode ?? "").length >= 2) debouncedSearch(zipCode ?? "");
          setShowDropdown(true);
        }}
        placeholder="Enter Zipcode"
        autoComplete="off"
        className="w-full px-3 py-2 border placeholder:font-normal placeholder:font-sans border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text_primary transition-all"
      />
      {error && (
        <p className="text-red-500 text-[12px] font-normal font-sans mt-1">
          {error.message}
        </p>
      )}
      {searchError && (
        <p className="text-red-500 text-sm px-2">
          Failed to load data. Please try again.
        </p>
      )}
      {showDropdown && (
        <div className="absolute top-[74px] left-0 right-0 z-20">
          <div className="border rounded-lg bg-white shadow-lg max-h-52 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-3">
                <LoadingMultiCircle />
              </div>
            ) : (zipCode?.length ?? 0) < 2 ? (
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
                  <p className="p-0 text-[12px] font-sans text-black font-normal">
                    {geo.full_address_th}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-3 hover:bg-blue-50 cursor-pointer transition-colors text-center">
                <span className="text-[12px] font-sans text-black font-normal">
                  สร้างรหัสไปรษณีย์: &quot;{zipCode}&quot;
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
