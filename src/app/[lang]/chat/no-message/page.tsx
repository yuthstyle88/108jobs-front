"use client";
import { MessageImage } from "@/constants/images";
import { useChatLanguage } from "@/contexts/ChatLanguage";
import Image from "next/image";

const Chat = () => {
  
  const {languageData:chatLanguageData}= useChatLanguage();

  return (
    <div className="flex-1 bg-gray-100 flex justify-center items-center p-4">
      <div className="text-center max-w-md">
        <Image
          src={MessageImage.chatMessage}
          alt="User"
          className="mx-auto w-40 h-40 object-contain"
        />
        <h3 className="mt-4 text-blue-800 font-medium">
          {chatLanguageData?.labelNoConversation}
        </h3>
      </div>
    </div>
  );
};

export default Chat;
