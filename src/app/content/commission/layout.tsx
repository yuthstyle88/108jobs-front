import Header from "@/components/Header";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";

interface CreateLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({
  children,
}: CreateLayoutProps) {
  return (
    <>
      <Header type="primary" />
      <section className="pt-[4.5rem] bg-white min-h-screen">
        {children}
      </section>
    </>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "Commission | Fastwork",
  description:
    "Fastwork Commission",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Commission | Fastwork",
    description:
      "Fastwork Commission",
  },
};
