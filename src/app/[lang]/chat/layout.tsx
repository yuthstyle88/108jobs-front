"use client";

import Header from "@/components/Header";
import ChatWrapper from "@/containers/ChatWrapper";
import SpHeader from "@/containers/SpHeader";
import {ChatLanguageProvider} from "@/contexts/ChatLanguage";
import {LayoutProps} from "@/types/layout";
import {ChatRoomsProvider} from "@/contexts/ChatRoomsContext";

export default function ProfileLayout({ children }: LayoutProps) {
    return (
        <ChatLanguageProvider>
            <ChatRoomsProvider>
                {/* Desktop Header */}
                <div className="hidden sm:block fixed top-0 left-0 right-0 z-50">
                    <Header type="primary" />
                </div>
                {/* Mobile Header */}
                <div className="block sm:hidden fixed top-0 left-0 right-0 z-50">
                    <SpHeader showBackButton={true} />
                </div>
                {/* Main Content: fix viewport height and prevent page scroll */}
                <div className="fixed top-16 sm:top-20 left-0 right-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden">
                    <div className="flex h-full">
                        <ChatWrapper />
                        <div className="flex-1 min-w-0 h-full">
                            {children}
                        </div>
                    </div>
                </div>
            </ChatRoomsProvider>
        </ChatLanguageProvider>
    );
}