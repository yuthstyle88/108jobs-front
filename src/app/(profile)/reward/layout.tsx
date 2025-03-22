import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";
import FaqReward from "@/components/FaqReward";

interface RewardLayoutProps {
  children: ReactNode;
}

export default function RewardLayout({ children }: RewardLayoutProps) {
  return (
    <>
      <section className="pt-[4.5rem] bg-white">{children}</section>
      <FaqReward/>
    </>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "สะสม Points  | Fastwork Rewards",
  description: "Fastwork Rewards - รับสิทธิประโยชน์ เพื่อชาวฟรีแลนซ์ อีกมากมาย",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "สะสม Points  | Fastwork Rewards",
    description:
      "Fastwork Rewards - รับสิทธิประโยชน์ เพื่อชาวฟรีแลนซ์ อีกมากมาย",
  },
};
