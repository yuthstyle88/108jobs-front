"use client";

import {useTranslation} from "react-i18next";
import {useState} from "react";
import ChatWrapper from "@/containers/ChatWrapper";
import {List} from "lucide-react";

const Chat = () => {
    const {t} = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const onToggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="relative w-full h-full bg-white">
            <div className="hidden sm:block md:hidden">
                <div className="pt-[3.5rem]">
                    <ChatWrapper
                        isSidebarOpen={isSidebarOpen}
                        onToggleSidebar={onToggleSidebar}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </div>

                <button
                    onClick={onToggleSidebar}
                    aria-label={isSidebarOpen ? "Close chat list" : "Open chat list"}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                >
                    <List className="w-6 h-6"/>
                </button>
            </div>

            <div className="hidden md:flex h-full items-center justify-center text-gray-500 p-4">
                {t("profileChat.selectConversation")}
            </div>

            <div className="block sm:hidden h-full items-center justify-center text-gray-500 p-4">
                {t("profileChat.selectConversation")}
            </div>
        </div>
    );
};

export default Chat;
