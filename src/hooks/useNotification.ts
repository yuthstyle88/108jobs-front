"use client";

import { toast } from "sonner";
import { useGlobalTranslate } from "./translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";

type NotificationGroup = {
  success?: Record<string, string | undefined>;
  fail?: Record<string, string | undefined>;
};

type NotificationType = Record<"profile" | "job", NotificationGroup>;

function useNotification() {
  const { data: notiLanguage } = useGlobalTranslate(LanguageFile.NOTIFICATIONS);

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
        update_favorite: "Successfully saved job to favorites",
        delete_favorite: "Successfully unsaved job from favorites",
      },
      fail: {
        set_default: "Failed set default address",
      },
    },
    job: {
      success: {
        update_favorite: "Successfully saved job to favorites",
        delete_favorite: "Successfully unsaved job from favorites",
      },
      fail: {},
    },
  };

  const success_message = (
    group: keyof NotificationType | null,
    action: string | null,
    custom?: string
  ) => {
    if (custom) {
      toast.success(custom);
      return;
    }

    if (group && action) {
      const message = type[group]?.success?.[action];
      if (message) {
        toast.success(message);
      } else {
        console.warn(`Missing success message for ${group}.${action}`);
      }
    }
  };

  const error_message = (
    group: keyof NotificationType | null,
    action: string | null,
    custom?: string
  ) => {
    if (custom) {
      toast.error(custom);
      return;
    }

    if (group && action) {
      const message = type[group]?.fail?.[action];
      if (message) {
        toast.error(message);
      } else {
        console.warn(`Missing error message for ${group}.${action}`);
      }
    }
  };

  return {
    success_message,
    error_message,
  };
}

export default useNotification;
