import { CategoriesImage } from "@/constants/images";
import { JobCategoryLanguage } from "@/types/language";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  language: Partial<JobCategoryLanguage> | undefined | null;
};
const NotFoundJob = ({ language }: Props) => {
  return (
    <div className="flex justify-center py-32">
      <div className="max-w-2xl text-center flex flex-col items-center gap-6">
        <div className="flex items-center justify-center">
          <Image
            src={CategoriesImage.not_found_search}
            alt="not-found"
            width={103}
            height={82}
            className="align-top"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <h4 className="whitespace-pre-wrap leading-[1.25] text-[1.25rem] font-semibold">
            {language?.no_results_message}
          </h4>
          <div className="mt-4">
            <Link prefetch={false} href="/job-board">
              <button className="submit-button-custom px-5 py-[10px]">
                {language?.post_job_board}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundJob;
