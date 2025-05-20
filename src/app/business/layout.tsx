import { defaultMetadata } from "@/config/metadata";
import { LayoutProps } from "@/types/layout";

export default function BusinessLayout({ children }: LayoutProps) {
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
  