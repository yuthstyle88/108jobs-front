import Link from "next/link";
import React from "react";

type Crumb = {
  label: string;
  href?: string; 
};

interface BreadCrumbProps {
  items: Crumb[];
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items }) => {
  return (
    <section className="col-start-2 col-end-auto h-5 mt-2 sm:mt-10">
      <div className="flex justify-between items-center">
        <ul className="text-[12px] sm:text-base flex-wrap inline-flex m-0 h-0 list-none">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="mr-[0.875rem]">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-third after:content-[''] after:inline-block after:w-[0.425rem] after:h-[0.425rem] after:ml-[0.5rem] after:mb-[1px] after:border-r after:border-b after:border-neutral-400 after:rotate-[-45deg] after:transform origin-center after:transition-all after:duration-300 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-text_primary">{item.label}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default BreadCrumb;
