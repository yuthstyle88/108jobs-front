import { ReactNode } from "react";

interface RewardLayoutProps {
  children: ReactNode;
}

export default function RewardLayout({ children }: RewardLayoutProps) {
  return (
    <>
      <section className="pt-[4.5rem] bg-white">
        {children}
      </section>
    </>
  );
}

export const metadata = {
  title: "Fastwork - reward ",
};
