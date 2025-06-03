import Footer from "@/components/Footer";
import SpHeader from "@/containers/SpHeader";
import { ReactNode } from "react";
interface ProfileProps {
  children: ReactNode;
}

export default function Profile({ children }: ProfileProps) {
  return (
    <>
      <SpHeader showSearch={false}/>
      <section className="pt-[48px] bg-white">{children}</section>
      <Footer />
    </>
  );
}
