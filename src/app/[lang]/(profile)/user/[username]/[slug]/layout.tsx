import SubMenu from "@/components/SubMenu";
import SpHeader from "@/containers/SpHeader";
import { LayoutProps } from "@/types/layout";

export default function CategoryLayout({ children }: LayoutProps) {
  return (
    <>
      <div className="block sm:hidden">
        <SpHeader showSearch={false}/>
      </div>

      <section className="bg-white">
        <div className="hidden lg:block">
          <SubMenu />
        </div>
        {children}
      </section>
    </>
  );
}
