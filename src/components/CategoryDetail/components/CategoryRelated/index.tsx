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
    <Link href="#" className="relative cursor-pointer">
      <div className="relative border-1 border-border_primary rounded-xl overflow-hidden w-full bg-white">
        <Image
          src={items.image}
          alt="wordpress"
          className="max-h-full object-cover align-top h-[98px]"
        />
        <p className="text-text_primary min-h-[47px] pt-3 px-3 mb-3">
          {items.title}
        </p>
      </div>
    </Link>
  );
};

export default CategoryRelated;
