import Header from "@/components/Header";
import ChatWrapper from "@/containers/ChatWrapper";
import SpHeader from "@/containers/SpHeader";
import { ChatLanguageProvider } from "@/contexts/ChatLanguage";
import { LayoutProps } from "@/types/layout";

export default function ProfileLayout({ children }: LayoutProps) {
  return (
    <ChatLanguageProvider>
      <div className="hidden sm:block">
        <Header type="primary" />
      </div>
      <div className="block sm:hidden">
        <SpHeader />
      </div>
      <div className="h-screen flex flex-col pt-16">
        <div className="flex flex-1 overflow-hidden">
          <ChatWrapper />
          {children}
        </div>
      </div>
    </ChatLanguageProvider>
  );
}
