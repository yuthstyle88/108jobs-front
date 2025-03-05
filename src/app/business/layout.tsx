import { defaultMetadata } from "@/config/metadata";
import { ReactNode } from "react";
interface BusinessLayoutProps {
  children: ReactNode;
}

export default function BusinessLayout({ children }: BusinessLayoutProps) {
  return (
    <>
        {children}
    </>
  );
}

export const metadata = {
    ...defaultMetadata,
    title: "Fastwork for Business – แหล่งรวมฟรีแลนซ์สำหรับกลุ่มธุรกิจ",
    description:
      "Fastwork for Business – แหล่งรวมฟรีแลนซ์สำหรับกลุ่มธุรกิจ",
    openGraph: {
      ...defaultMetadata.openGraph,
      title: "Fastwork for Business – แหล่งรวมฟรีแลนซ์สำหรับกลุ่มธุรกิจ",
      description:
        "Fastwork for Business – แหล่งรวมฟรีแลนซ์สำหรับกลุ่มธุรกิจ",
    },
  };
  