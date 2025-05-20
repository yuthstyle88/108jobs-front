"use client";
import { API_ROUTES } from "@/api/endpoints";
import { ProfileImage } from "@/constants/images";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SpUserAvatar = () => {
  const pathname = usePathname();
  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.get_profile
  );
  return (
    <Link
      href="/profile"
      className={`flex-1 flex items-center justify-center p-2 text-white text-[24px] cursor-pointer ${
        pathname === "/profile" ? "bg-primary" : ""
      }`}
    >
      <Image
        src={user?.user.avatar_url || ProfileImage.avatar}
        alt="avatar"
        className="rounded-full w-8 h-8 object-cover"
        width={500}
        height={500}
      />
    </Link>
  );
};

export default SpUserAvatar;
