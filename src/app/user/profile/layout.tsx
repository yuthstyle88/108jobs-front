import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";

interface StartSellingLayoutProps {
  children: ReactNode;
}

export default function StartSellingLayout({ children }: StartSellingLayoutProps) {
  return (
    <>
      <Header type="primary" />
      <section className="pt-[4.4rem] bg-white">
        {children}
      </section>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "iBrowe Shield - Blocking Ads, Trackers & more",
};
