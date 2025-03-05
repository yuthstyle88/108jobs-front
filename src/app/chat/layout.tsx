import Header from "@/components/Header";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";
interface CreateLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: CreateLayoutProps) {
  return (
    <>
      <Header type="primary" />
      <section className="bg-white min-h-screen">{children}</section>
    </>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "Fastwork chat",
  description: "Fastwork chat",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Fastwork chat",
    description: "Fastwork chat",
  },
};
