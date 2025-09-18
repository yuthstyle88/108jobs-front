"use client";

import {Send, Smile} from "lucide-react";
import {useEffect, useRef} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

type MessageForm = {
    message: string;
};

interface ChatInputProps {
    onSubmit: (data: MessageForm) => void;
    disabled?: boolean;
    disabledHint?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
                                                 onSubmit,
                                                 disabled = false,
                                                 disabledHint,
                                             }) => {
    const {t} = useTranslation();
    const {register, handleSubmit, reset, watch} = useForm<MessageForm>();
    const messageRef = useRef<HTMLTextAreaElement | null>(null);

    const {ref, ...rest} = register("message");

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
        },
        [watch("message")]);

    const internalSubmit = (data: MessageForm) => {
        if (disabled) return;
        onSubmit(data);
        reset();
        setTimeout(() => resizeTextarea(),
            0);
    };

    return (
        <form
            data-testid="chat-form"
            onSubmit={handleSubmit(internalSubmit)}
            className="flex flex-col gap-2"
            aria-disabled={disabled}
        >
            <div className="flex items-center w-full">
                <div className="flex-1 border rounded-lg overflow-hidden flex">
          <textarea
              data-testid="chat-input"
              {...rest}
              ref={(e) => {
                  ref(e);
                  messageRef.current = e;
              }}
              placeholder={
                  disabled
                      ? (disabledHint !== undefined ? disabledHint : (t("profileChat.userNotAvailable") || "This user is not available for messages."))
                      : (t("profileChat.typeMessageHere") || "Type a message...")
              }
              className={`text-text-primary flex-1 px-3 py-2 resize-none focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto break-words whitespace-pre-wrap ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
              rows={1}
              disabled={disabled}
              onKeyDown={(e) => {
                  if (disabled) { e.preventDefault(); return; }
                  if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const form = e.currentTarget.closest("form");
                      if (form) form.requestSubmit();
                  }
              }}
          />
                    <button
                        type="button"
                        className={`bg-white px-3 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                        disabled={disabled}
                        aria-disabled={disabled}
                    >
                        <Smile size={20}/>
                    </button>
                </div>

                <button
                    type="submit"
                    className={`ml-3 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:text-primary'}`}
                    disabled={disabled}
                    aria-disabled={disabled}
                >
                    <Send size={20}/>
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
