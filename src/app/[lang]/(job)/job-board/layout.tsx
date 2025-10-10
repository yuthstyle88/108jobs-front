"use client";
import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import React, {ReactNode, useState} from "react";
import ChatWrapper from "@/containers/ChatWrapper";
import {ChatLanguageProvider} from "@/contexts/ChatLanguage";
import {ChatRoomsProvider} from "@/core/chat/contexts/ChatRoomsContext";

interface ConsentManagementLayoutProps {
    children: ReactNode;
}


export default function ProfileLayout({
                                          children,
                                      }: ConsentManagementLayoutProps) {
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
                    <section className="pt-[5.5rem] sm:pt-[4.5rem] px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
                        <div className="max-w-[1280px] mx-auto w-full">
                            {children}
                        </div>
                    </section>
                </ChatRoomsProvider>
            </ChatLanguageProvider>
        </>
    );
}
