import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Link from "next/link";
import React from "react";

const CategoryFooter = () => {
  const { data: categoryFooterLanguage } = useGlobalTranslate(
    LanguageFile.CATEGORY_FOOTER
  );
  return (
    <div className="grid-cols-[1fr] grid m-0 p-0 col-start-2 col-end-auto mt-12 gap-y-6">
      <div>
        <h2 className="text-[1.125rem] mb-2 font-semibold leading-[1.5] text-text_primary">
          {categoryFooterLanguage?.seo_title}
        </h2>
      </div>
      <div className="grid-cols-[1fr] m-0 p-0 grid">
        <div className="text-[0.75rem] leading-[1.5] font-sans text-text_primary">
          <p>
            <strong>
              {categoryFooterLanguage?.seo_description_1}{" "}
              <Link prefetch={false} href="https://fastwork.co/seo/backlink">
                {categoryFooterLanguage?.seo_links_backlink}&nbsp;
              </Link>
            </strong>
            <Link prefetch={false} href="https://fastwork.co/seo/wordpress">
              <strong>{categoryFooterLanguage?.seo_links_wordpress}</strong>
            </Link>
            <strong>&nbsp;</strong>
            <Link prefetch={false} href="https://fastwork.co/seo/youtube">
              <strong>{categoryFooterLanguage?.seo_links_youtube}</strong>
            </Link>
            <strong>&nbsp;</strong>
            <Link prefetch={false} href="https://fastwork.co/seo/youtube">
              <strong>{categoryFooterLanguage?.seo_links_facebook}</strong>
            </Link>
            <strong>&nbsp;</strong>
            <Link prefetch={false} href="https://fastwork.co/seo/audit">
              <strong>{categoryFooterLanguage?.seo_links_youtube}</strong>
            </Link>
            <strong>&nbsp;</strong>
            <Link prefetch={false} href="https://fastwork.co/seo/full-service">
              <strong>{categoryFooterLanguage?.seo_links_monthly}</strong>
            </Link>
            <strong>&nbsp;</strong>

            {categoryFooterLanguage?.seo_description_2_part1}
            <strong>
              {categoryFooterLanguage?.seo_description_2_strong_1}
            </strong>
            {categoryFooterLanguage?.seo_description_2_middle}
            <strong>
              {categoryFooterLanguage?.seo_description_2_strong_2}
            </strong>
            {categoryFooterLanguage?.seo_description_2_part2}
          </p>
          {categoryFooterLanguage?.seo_description_3_part1}
          <strong>{categoryFooterLanguage?.seo_description_3_strong_1}</strong>
          {categoryFooterLanguage?.seo_description_3_middle1}
          <strong>{categoryFooterLanguage?.seo_description_3_strong_2}</strong>
          {categoryFooterLanguage?.seo_description_3_part2}
          <h2 className="text-[1.125rem] font-semibold mt-6 mb-2 leading-[1.5]">
            {categoryFooterLanguage?.seo_principles_title}
          </h2>
          <ol className="list-decimal ml-4 text-[0.75rem] leading-[1.5] font-sans">
            <li>{categoryFooterLanguage?.seo_principles_0}</li>
            <li>{categoryFooterLanguage?.seo_principles_1}</li>
            <li>{categoryFooterLanguage?.seo_principles_2}</li>
            <li>{categoryFooterLanguage?.seo_principles_3}</li>
            <li>{categoryFooterLanguage?.seo_principles_4}</li>
          </ol>
          <p>
            {categoryFooterLanguage?.seo_conclusion_part1}
            <strong>{categoryFooterLanguage?.seo_conclusion_strong_1}</strong>
            {categoryFooterLanguage?.seo_conclusion_middle}
            <strong>{categoryFooterLanguage?.seo_conclusion_strong_2}</strong>
            {categoryFooterLanguage?.seo_conclusion_part2}
          </p>
        </div>
      </div>
      <div className="grid-cols-[1fr] m-0 p-0 grid">
        <div className="text-[0.75rem] leading-[1.5] font-sans text-text_primary">
          <h2 className="text-[1.125rem] mb-2 font-semibold leading-[1.5] text-text_primary">
            {categoryFooterLanguage?.how_to_hire_title}
          </h2>
          <ol className="list-decimal ml-4 text-[0.75rem] leading-[1.5] font-sans">
            <li>{categoryFooterLanguage?.how_to_hire_steps_0}</li>
            <li>{categoryFooterLanguage?.how_to_hire_steps_1}</li>
            <li>{categoryFooterLanguage?.how_to_hire_steps_2}</li>
            <li>{categoryFooterLanguage?.how_to_hire_steps_3}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CategoryFooter;
