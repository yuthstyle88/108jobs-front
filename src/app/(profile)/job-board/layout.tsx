import Header from "@/components/Header";
import { ReactNode } from "react";

interface ConsentManagementLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({
  children,
}: ConsentManagementLayoutProps) {
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
  title: "iBrowe Shield - Blocking Ads, Trackers & more",
};
