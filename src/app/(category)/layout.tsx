import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubMenu from "@/components/SubMenu";
import SpHeader from "@/containers/SpHeader";
import { ReactNode } from "react";
interface CategoryLayoutProps {
  children: ReactNode;
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary" />
      </div>
      <div className="block sm:hidden">
        <SpHeader />
      </div>

      <section className="pt-[4.5rem] bg-white">
        <div className="hidden sm:block">
          <SubMenu />
        </div>
        {children}
      </section>
      <Footer />
    </>
  );
}
