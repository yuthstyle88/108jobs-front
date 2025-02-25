import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubMenu from "@/components/SubMenu";
import { ReactNode } from "react";

interface PromotionLayoutProps {
  children: ReactNode;
}

export default function PromotionLayout({ children }: PromotionLayoutProps) {
  return (
    <>
      <Header type="primary" />

      <section className="pt-[4.5rem] bg-white">
        <SubMenu />
        {children}
      </section>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Fastwork - promotion ",
};
