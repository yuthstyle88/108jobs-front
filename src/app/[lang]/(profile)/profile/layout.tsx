"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import React, {ReactNode, useState} from "react";
import ChatWrapper from "@/containers/ChatWrapper";
import {ChatLanguageProvider} from "@/contexts/ChatLanguage";
import {ChatRoomsProvider} from "@/modules/chat/contexts/ChatRoomsContext";

interface UserLayoutProps {
    children: ReactNode;
}

export default function UserLayout({children}: UserLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <ChatLanguageProvider>
                <ChatRoomsProvider>
                    <div className="hidden sm:block">
                        <Header type="primary"/>
                    </div>
                    <div className="block sm:hidden">
                        {/* Mobile Header */}
                        <div className="block sm:hidden fixed top-0 left-0 right-0 z-50">
                            <SpHeader
                                isSidebarOpen={isSidebarOpen}
                                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                                showBackButton={true}
                            />
                        </div>
                        <div className="block sm:hidden">
                            <ChatWrapper
                                isSidebarOpen={isSidebarOpen}
                                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                                setIsSidebarOpen={setIsSidebarOpen}
                            />
                        </div>
                    </div>
                    <section className="pt-[3rem] sm:pt-[4.4rem] bg-white">{children}</section>
                    <Footer/>
                </ChatRoomsProvider>
            </ChatLanguageProvider>
        </>
    );
}
