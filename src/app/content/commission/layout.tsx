import Header from "@/components/Header";
import { defaultMetadata } from "@/config/metadata";
import SpHeader from "@/containers/SpHeader";
import { LayoutProps } from "@/types/layout";

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

export const metadata = {
  ...defaultMetadata,
  title: "Commission | Fastwork",
  description: "Fastwork Commission",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Commission | Fastwork",
    description: "Fastwork Commission",
  },
};
