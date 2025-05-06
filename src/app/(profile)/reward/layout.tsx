import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";
import FaqReward from "@/components/FaqReward";
import RewardHeader from "@/components/RewardHeader";

interface RewardLayoutProps {
  children: ReactNode;
}

export default function RewardLayout({ children }: RewardLayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <RewardHeader/>
      </div>
      <div className="block sm:hidden">
        <RewardHeader/>
      </div>
      <section className="bg-white">{children}</section>
      <FaqReward />
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
