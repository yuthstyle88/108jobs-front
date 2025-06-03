import Header from "@/components/Header";
import ChatWrapper from "@/containers/ChatWrapper";
import { ChatLanguageProvider } from "@/contexts/ChatLanguage";
import { LayoutProps } from "@/types/layout";

export default function ProfileLayout({ children }: LayoutProps) {
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
