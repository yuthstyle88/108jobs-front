"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import {useTranslation} from "react-i18next";

type Props = {
  showSearch: boolean;
};

type SearchForm = {
  query: string;
};

const Search = ({ showSearch }: Props) => {
  const router = useRouter();
  const {t} = useTranslation();
  const searchParams = useSearchParams();
  const titleSearch = searchParams.get("titleSearch") || "";

  const { register, handleSubmit, setValue } = useForm<SearchForm>({
    defaultValues: {
      query: "",
    },
  });

  useEffect(() => {
    if (titleSearch) {
      setValue("query", decodeURIComponent(titleSearch));
    }
  }, [titleSearch, setValue]);

  const onSubmit = (data: SearchForm) => {
    const trimmed = data.query.trim();
    if (trimmed) {
      const encoded = encodeURIComponent(trimmed);
      router.push(`/job/search?titleSearch=${encoded}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex text-black h-[40px] w-full md:w-[250px] relative transition-all duration-300 ${
        showSearch ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <input
        type="text"
        placeholder={
          titleSearch || t("global.hintTextHeaderSearch") || "Search..."
        }
        className="focus:outline-none rounded-[20px] border-2-white pl-5 pr-10 text-sm font-mono w-full"
        {...register("query")}
      />
      <button type="submit">
        <FontAwesomeIcon
          icon={faSearch}
          className="w-[14px] h-[14px] text-primary absolute right-3 top-1/2 -translate-y-1/2"
        />
      </button>
    </form>
  );
};

export default Search;
