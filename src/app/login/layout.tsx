import { defaultMetadata } from "@/config/metadata";
import { LayoutProps } from "@/types/layout";

export default function Login({ children }: LayoutProps) {
  return (
    <>
        {children}
    </>
  );
}

export const metadata = {
    ...defaultMetadata,
    title: "เข้าสู่ระบบ fastwork.co",
    description:
      "เข้าสู่ระบบ fastwork.co",
    openGraph: {
      ...defaultMetadata.openGraph,
      title: "เข้าสู่ระบบ fastwork.co",
      description:
        "เข้าสู่ระบบ fastwork.co",
    },
  };
  