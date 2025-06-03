import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { LayoutProps } from "@/types/layout";

export async function generateMetadata() {
  return generateLocalizedMetadata("commission");
}

export default function ProfileLayout({ children }: LayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary" />
      </div>
      <div className="block sm:hidden">
        <SpHeader showSearch={false} />
      </div>
      <section className="pt-[4.5rem] bg-white min-h-screen">
        {children}
      </section>
    </>
  );
}

