import { AssetIcon, CategoriesIcon } from "@/constants/icons";
import Image from "next/image";
import React from "react";

type Props = {};

const SpecificCategory = (props: Props) => {
  return (
    
    <div className="grid grid-cols-[1fr_1216px_1fr] h-12 bg-[#E3EDFD] ">
    <a className="col-start-2 col-end-auto flex justify-center items-center gap-3">
      <Image src={CategoriesIcon.guaranteed} alt="guaranteed" width={22} />
      <p className="text-base font-medium ">
        <span className="text-primary">ปลอดภัย ไม่โดนโกง </span>
        <span className="text-text_primary">ดูแลตลอดการจ้างงาน</span>
      </p>
    </a>
  </div>
  );
};

export default SpecificCategory;
