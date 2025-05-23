"use client";
import { toast } from "sonner";
import { useGlobalTranslate } from "./translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";

type NotificationType = {
  profile: {
    success: {
      update?: string;
      update_education?: string;
      update_work_experience?: string;
      update_certification?: string;
      update_skill?: string;
      update_language?: string;
      change_password?: string;
    };
    fail: {
      set_default: string;
    };
  };
};

function useNotification() {

  const {
      data: notiLanguage,
    } = useGlobalTranslate(LanguageFile.NOTIFICATIONS);

  const type: NotificationType = {
    profile: {
      success: {
        update: notiLanguage?.update,
        update_education: notiLanguage?.update_education,
        update_work_experience: notiLanguage?.update_work_experience,
        update_certification: notiLanguage?.update_certification,
        update_skill: notiLanguage?.update_skill,
        update_language: notiLanguage?.update_language,
        change_password: notiLanguage?.change_password,
      },
      fail: {
        set_default: "Failed set default address",
      },
    },
  };

  type MessageKey = keyof typeof type;

  const success_message = (
    msg: MessageKey,
    action: keyof (typeof type)[MessageKey]["success"],
    custom?: string
  ): void => {
    const message = custom ?? type[msg]?.success?.[action];
    if (message) {
      toast.success(message);
    } else {
      console.warn(`Missing success message for ${msg}.${action}`);
    }
  };

  const error_message = (
    msg: MessageKey,
    action: keyof (typeof type)[MessageKey]["fail"],
    custom?: string
  ): void => {
    const message = custom ?? type[msg]?.fail?.[action];
    if (message) {
      toast.error(message);
    } else {
      console.warn(`Missing error message for ${msg}.${action}`);
    }
  };

  return {
    success_message,
    error_message,
  };
}

export default useNotification;
