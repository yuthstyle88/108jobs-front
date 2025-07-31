import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubMenu from "@/components/SubMenu";
import SpHeader from "@/containers/SpHeader";
import {generateLocalizedMetadata} from "@/lib/metadata";
import {LayoutProps} from "@/types/layout";

export async function generateMetadata() {
  return generateLocalizedMetadata("startSelling");
}

export default function StartSellingLayout({
  children,
}: LayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary"/>
      </div>
      <div className="block sm:hidden">
        <SpHeader showSearch={false}/>
      </div>

      <section className="pt-[3rem] md:pt-[4.5rem] bg-white">
        <div className="hidden md:block">
          <SubMenu/>
        </div>
        {children}
      </section>
      <Footer/>
    </>
  );
}

