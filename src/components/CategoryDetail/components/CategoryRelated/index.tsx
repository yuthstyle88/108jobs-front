import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

type CategoryItem = {
  image: string | StaticImageData;
  title: string;
};

type CategoryRelatedProps = {
  items: CategoryItem;
};

const CategoryRelated: React.FC<CategoryRelatedProps> = ({ items }) => {
  return (
    <Link prefetch={false} href="#" className="relative cursor-pointer h-full">
      <div className="relative border-1 border-borderPrimary rounded-xl overflow-hidden w-full bg-white h-full flex flex-col">
        <Image
          src={items.image}
          alt="wordpress"
          className="h-[98px] w-full object-cover"
        />
        <div className="px-3 pt-3 pb-4 flex-1 flex items-start">
          <p className="text-text_primary text-sm leading-snug line-clamp-2">
            {items.title}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryRelated;
