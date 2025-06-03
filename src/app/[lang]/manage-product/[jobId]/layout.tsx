import Header from "@/components/Header";
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
      <section className="bg-white min-h-screen">{children}</section>
    </>
  );
}

