"use client";

import { ProfileChatLanguage } from "@/types/language";
import { Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import FilePreview from "../FilePreview";

type MessageForm = {
  message: string;
};

interface ChatInputProps {
  onSubmit: (data: MessageForm) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: {
    file_url: string;
    file_type: string;
    file_name: string;
  } | null;
  setSelectedFile: (file: null) => void;
  isUploading: boolean;
  chatLanguageData?: Partial<ProfileChatLanguage> | null | undefined;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  onFileUpload,
  selectedFile,
  isUploading,
  chatLanguageData,
}) => {
  const { register, handleSubmit, reset, watch } = useForm<MessageForm>();
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const { ref, ...rest } = register("message");

  const resizeTextarea = () => {
    const textarea = messageRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    resizeTextarea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("message")]);

  const internalSubmit = (data: MessageForm) => {
    onSubmit(data);
    reset();
    setTimeout(() => resizeTextarea(), 0);
  };

  return (
    <form
      onSubmit={handleSubmit(internalSubmit)}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center w-full">
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={onFileUpload}
        />
        <label
          htmlFor="fileInput"
          className="text-gray-400 hover:text-gray-600 mr-3 cursor-pointer"
        >
          {isUploading ? (
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          ) : (
            <Paperclip size={20} />
          )}
        </label>

        <div className="flex-1 border rounded-lg overflow-hidden flex">
          <textarea
            {...rest}
            ref={(e) => {
              ref(e);
              messageRef.current = e;
            }}
            placeholder={
              chatLanguageData?.type_message_here || "Type a message..."
            }
            className="text-text_primary flex-1 px-3 py-2 resize-none focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto break-words whitespace-pre-wrap"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.closest("form");
                if (form) form.requestSubmit();
              }
            }}
          />
          <button
            type="button"
            className="bg-white px-3 text-gray-400 hover:text-gray-600"
          >
            <Smile size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="ml-3 text-blue-500 hover:text-blue-600"
        >
          <Send size={20} />
        </button>
      </div>

      {selectedFile && (
        <FilePreview
          fileUrl={selectedFile.file_url}
          fileType={selectedFile.file_type}
          fileName={selectedFile.file_name}
          showDownloadLink={false}
        />
      )}
    </form>
  );
};

export default ChatInput;
