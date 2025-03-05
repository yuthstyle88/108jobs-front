import { defaultMetadata } from "@/config/metadata";
import { ReactNode } from "react";
interface LoginProps {
  children: ReactNode;
}

export default function Login({ children }: LoginProps) {
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
  