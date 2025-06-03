import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { ReactNode } from "react";
interface ConsentManagementLayoutProps {
  children: ReactNode;
}

export async function generateMetadata() {
  return generateLocalizedMetadata("jobBoard");
}

export default function ProfileLayout({
  children,
}: ConsentManagementLayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary" />
      </div>
      <div className="block sm:hidden">
        <SpHeader />
      </div>
      <section className="pt-[5.5rem] sm:pt-[4.5rem] bg-white min-h-screen">
        {children}
      </section>
    </>
  );
}
