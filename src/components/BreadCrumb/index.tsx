import Link from "next/link";
import React from "react";

const BreadCrumb = () => {
  return (
    <section className="col-start-2 col-end-auto h-5 mt-2 sm:mt-10">
      <div className="flex justify-between items-center">
        <ul className="text-[12px] sm:text-base flex-wrap inline-flex m-0 h-0 list-none">
          <li className="mr-[0.875rem]">
            <Link
              href="#"
              className="text-third after:content-[''] after:inline-block after:w-[0.425rem] after:h-[0.425rem] after:ml-[0.5rem] after:mb-[1px] after:border-r after:border-b after:border-neutral-400 after:rotate-[-45deg] after:transform origin-center after:transition-all after:duration-300 hover:text-primary"
            >
              ประเภทงานทั้งหมด
            </Link>
          </li>
          <li className="mr-[0.875rem]">
            <Link
              href="#"
              className="text-third after:content-[''] after:inline-block after:w-[0.425rem] after:h-[0.425rem] after:ml-[0.5rem] after:mb-[1px] after:border-r after:border-b after:border-neutral-400 after:rotate-[-45deg] after:transform origin-center after:transition-all after:duration-300 hover:text-primary"
            >
              การตลาดและโฆษณา
            </Link>
          </li>
          <li className="mr-[0.875rem]">
            <Link href="#" className="text-text_primary">
              ทำ SEO
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default BreadCrumb;
