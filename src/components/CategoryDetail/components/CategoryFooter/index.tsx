import { LanguageFile } from "@/constants/language";
import { getNamespace } from "@/utils/i18nHelper";
import Link from "next/link";
import React from "react";


const CategoryFooter = () => {
  const { data: categoryFooterLanguage } = getNamespace(
    LanguageFile.CATEGORY_FOOTER
  );
  return (
    <div className="grid-cols-[1fr] grid m-0 p-0 col-start-2 col-end-auto mt-12 gap-y-6">
      <div>
        <h2 className="text-[1.125rem] mb-2 font-semibold leading-[1.5] text-text-primary">
          {categoryFooterLanguage?.seoTitle}
        </h2>
      </div>
      <div className="grid-cols-[1fr] m-0 p-0 grid">
        <div className="text-[0.75rem] leading-[1.5] font-sans text-text-primary">
          <p>
            <strong>
              {categoryFooterLanguage?.seoDescription1}{" "}
              <Link prefetch={false} href="https://fastwork.co/seo/backlink">
                {categoryFooterLanguage?.seoLinksBacklink}&nbsp;
              </Link>
            </strong>
            <Link prefetch={false} href="https://fastwork.co/seo/wordpress">
              <strong>{categoryFooterLanguage?.seoLinksWordpress}</strong>
            </Link>
            <strong>&nbsp;</strong>
            <Link prefetch={false} href="https://fastwork.co/seo/youtube">
              <strong>{categoryFooterLanguage?.seoLinksYoutube}</strong>
            </Link>
            <strong>&nbsp;</strong>
            <Link prefetch={false} href="https://fastwork.co/seo/youtube">
              <strong>{categoryFooterLanguage?.seoLinksFacebook}</strong>
            </Link>
            <strong>&nbsp;</strong>
            <Link prefetch={false} href="https://fastwork.co/seo/audit">
              <strong>{categoryFooterLanguage?.seoLinksYoutube}</strong>
            </Link>
            <strong>&nbsp;</strong>
            <Link prefetch={false} href="https://fastwork.co/seo/full-service">
              <strong>{categoryFooterLanguage?.seoLinksMonthly}</strong>
            </Link>
            <strong>&nbsp;</strong>

            {categoryFooterLanguage?.seoDescription2Part1}
            <strong>
              {categoryFooterLanguage?.seoDescription2Strong1}
            </strong>
            {categoryFooterLanguage?.seoDescription2Middle}
            <strong>
              {categoryFooterLanguage?.seoDescription2Strong2}
            </strong>
            {categoryFooterLanguage?.seoDescription2Part2}
          </p>
          {categoryFooterLanguage?.seoDescription3Part1}
          <strong>{categoryFooterLanguage?.seoDescription3Strong1}</strong>
          {categoryFooterLanguage?.seoDescription3Middle1}
          <strong>{categoryFooterLanguage?.seoDescription3Strong2}</strong>
          {categoryFooterLanguage?.seoDescription3Part2}
          <h2 className="text-[1.125rem] font-semibold mt-6 mb-2 leading-[1.5]">
            {categoryFooterLanguage?.seoPrinciplesTitle}
          </h2>
          <ol className="list-decimal ml-4 text-[0.75rem] leading-[1.5] font-sans">
            <li>{categoryFooterLanguage?.seoPrinciples0}</li>
            <li>{categoryFooterLanguage?.seoPrinciples1}</li>
            <li>{categoryFooterLanguage?.seoPrinciples2}</li>
            <li>{categoryFooterLanguage?.seoPrinciples3}</li>
            <li>{categoryFooterLanguage?.seoPrinciples4}</li>
          </ol>
          <p>
            {categoryFooterLanguage?.seoConclusionPart1}
            <strong>{categoryFooterLanguage?.seoConclusionStrong1}</strong>
            {categoryFooterLanguage?.seoConclusionMiddle}
            <strong>{categoryFooterLanguage?.seoConclusionStrong2}</strong>
            {categoryFooterLanguage?.seoConclusionPart2}
          </p>
        </div>
      </div>
      <div className="grid-cols-[1fr] m-0 p-0 grid">
        <div className="text-[0.75rem] leading-[1.5] font-sans text-text-primary">
          <h2 className="text-[1.125rem] mb-2 font-semibold leading-[1.5] text-text-primary">
            {categoryFooterLanguage?.howToHireTitle}
          </h2>
          <ol className="list-decimal ml-4 text-[0.75rem] leading-[1.5] font-sans">
            <li>{categoryFooterLanguage?.howToHireSteps0}</li>
            <li>{categoryFooterLanguage?.howToHireSteps1}</li>
            <li>{categoryFooterLanguage?.howToHireSteps2}</li>
            <li>{categoryFooterLanguage?.howToHireSteps3}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CategoryFooter;
