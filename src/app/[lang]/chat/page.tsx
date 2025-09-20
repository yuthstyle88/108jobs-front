"use client";

import {useTranslation} from "react-i18next";

const Chat = () => {
    const {t} = useTranslation();
    return (
        <div className="w-full h-full flex items-center justify-center text-gray-500 p-4">
            {t("profileChat.selectConversation")}
        </div>
    );
};

export default Chat;
