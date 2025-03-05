import { defaultMetadata } from "@/config/metadata";
import { ReactNode } from "react";
interface ApplyFreelanceLayoutProps {
  children: ReactNode;
}

export default function ApplyFreelanceLayout({ children }: ApplyFreelanceLayoutProps) {
  return (
    <>
        {children}
    </>
  );
}

export const metadata = {
    ...defaultMetadata,
    title: "Seller Center | Fastwork.co",
    description:
      "ติดตามความคืบหน้าและจัดการงาน บน fastwork อย่างมืออาชีพได้แล้ว บน Seller Center",
    openGraph: {
      ...defaultMetadata.openGraph,
      title: "Seller Center | Fastwork.co",
      description:
        "ติดตามความคืบหน้าและจัดการงาน บน fastwork อย่างมืออาชีพได้แล้ว บน Seller Center",
    },
  };
  