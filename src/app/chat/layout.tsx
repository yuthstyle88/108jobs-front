import Header from "@/components/Header";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";
import ChatWrapper from "@/containers/ChatWrapper";
import { ChatLanguageProvider } from "@/contexts/ChatLanguage";
interface CreateLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: CreateLayoutProps) {
  return (
    <ChatLanguageProvider>
      <Header type="primary" />
      <div className="h-screen flex flex-col pt-16">
        <div className="flex flex-1 overflow-hidden">
          <ChatWrapper />
          {children}
        </div>
      </div>
    </ChatLanguageProvider>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "Fastwork chat",
  description: "Fastwork chat",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Fastwork chat",
    description: "Fastwork chat",
  },
};
