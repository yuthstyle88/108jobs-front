"use client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
    showSearch?: boolean;
    className?: string;
};

type SearchForm = {
    query: string;
};

const Search = ({ showSearch = false, className = "" }: Props) => {
    const router = useRouter();
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const titleSearch = searchParams.get("titleSearch") || "";
    const [isSearchOpen, setIsSearchOpen] = useState(showSearch);

    const { register, handleSubmit, setValue } = useForm<SearchForm>({
        defaultValues: {
            query: "",
        },
    });

    useEffect(() => {
        if (titleSearch) {
            setValue("query", titleSearch);
            setIsSearchOpen(true);
        }
    }, [titleSearch, setValue]);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const onSubmit = (data: SearchForm) => {
        const trimmed = data.query.trim();
        if (trimmed) {
            router.push(`/job-board?q=${trimmed}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <div className={`relative flex items-center ${className}`}>
            {/* Icon-only button for small screens (below lg) */}
            <button
                onClick={toggleSearch}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white text-primary hover:bg-gray-200 transition-colors"
                aria-label="Toggle search"
            >
                <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
            </button>

            {/* Full search bar for large screens (lg and above) */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`hidden lg:flex text-black h-[40px] w-[200px] relative transition-all duration-300 ${
                    showSearch ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                <input
                    type="text"
                    placeholder={
                        titleSearch || t("global.hintTextHeaderSearch") || "Search..."
                    }
                    className="focus:outline-none rounded-[20px] border-2 border-gray-300 pl-5 pr-10 text-sm font-mono w-full"
                    {...register("query")}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <FontAwesomeIcon icon={faSearch} className="w-[14px] h-[14px] text-primary" />
                </button>
            </form>

            {/* Toggleable search box for small screens */}
            {isSearchOpen && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="lg:hidden absolute top-[2.5rem] left-0 z-50 bg-white rounded-md shadow-md"
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={
                                titleSearch || t("global.hintTextHeaderSearch") || "Search..."
                            }
                            className="w-[150px] px-3 py-1 text-sm text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...register("query")}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                            <FontAwesomeIcon icon={faSearch} className="w-[12px] h-[12px] text-primary" />
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Search;