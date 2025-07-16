import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import debounce from "lodash.debounce";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { createPortal } from "react-dom";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import { ChevronDown } from "lucide-react";
import { LocationForm } from "../..";

interface Country {
  id: string;
  name: string;
}

interface CountrySearchProps {
  setValue: UseFormSetValue<LocationForm>;
  control: Control<LocationForm>;
  fieldName: keyof LocationForm;
  onSelect?: (name: string) => void;
}

export default function CountrySearch({
  setValue,
  control,
  fieldName,
  onSelect
}: CountrySearchProps) {
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  const countryValue = useWatch({ control, name: fieldName });

  const { data, isLoading } = usePrivateFetchParams<{ countries: Country[] }>(
    searchUrl
  );
  const results = data?.countries || [];

  useLayoutEffect(() => {
    if (showDropdown && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [showDropdown]);

  useEffect(() => {
    if (showDropdown && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        const trimmed = q.trim();
        setSearchUrl(
          `/profile/countries/search?name=${encodeURIComponent(trimmed)}`
        );
        setShowDropdown(true);
      }, 300),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    if (inputRef.current && selectedValue && query === "") {
      inputRef.current.setSelectionRange(0, 0);
    }
  }, [query, selectedValue]);

  useEffect(() => {
  if (!countryValue) {
    setSelectedValue(null);
  }
}, [countryValue]);


  const handleSelect = (country: Country) => {
      setValue(fieldName, country.name, { shouldValidate: true });
      setSelectedValue(country.name);
      setQuery("");
      setShowDropdown(false);
      inputRef.current?.blur();
      onSelect?.(country.name);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        value={query}
        placeholder={selectedValue ?? "Type your country..."}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          setValue(fieldName, val, { shouldValidate: true });
          setSelectedValue(null);
          debouncedSearch(val);
        }}
        onFocus={() => {
          if (!showDropdown) {
            setSearchUrl("/profile/countries/search?name=");
            setShowDropdown(true);
          }
        }}
        className="text-[14px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-textPrimary placeholder:text-textPrimary placeholder:font-sans"
      />
      <span className="absolute right-3 top-2.5 text-gray-500 pointer-events-none">
        <ChevronDown size={16} />
      </span>
      {showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            className="z-[99999] bg-white shadow-lg border rounded-md max-h-52 overflow-y-auto absolute"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center p-3">
                <LoadingMultiCircle />
              </div>
            ) : results.length ? (
              results.map((item) => {
                const isSelected = item.name === countryValue;
                return (
                  <div
                    key={item.id}
                    ref={isSelected ? selectedItemRef : null}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white font-semibold"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    {item.name}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-sm font-sans text-center text-textPrimary">
                No results
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
