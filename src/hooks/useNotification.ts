"use client";

import { toast } from "sonner";
import { useGlobalTranslate } from "./translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";

type NotificationGroup = {
  success?: Record<string, string | undefined>;
  fail?: Record<string, string | undefined>;
};

type NotificationType = Record<"profile" | "job" | "review" | "service", NotificationGroup>;

function useNotification() {
  const { data: notiLanguage } = useGlobalTranslate(LanguageFile.NOTIFICATIONS);

  const type: NotificationType = {
    profile: {
      success: {
        update: notiLanguage?.update,
        updateEducation: notiLanguage?.updateEducation,
        updateWorkExperience: notiLanguage?.updateWorkExperience,
        updateCertification: notiLanguage?.updateCertification,
        updateSkill: notiLanguage?.updateSkill,
        updateLanguage: notiLanguage?.updateLanguage,
        changePassword: notiLanguage?.changePassword,
        updateFavorite: "Successfully saved job to favorites",
        deleteFavorite: "Successfully unsaved job from favorites",
        updateAvailable: "You are now accepting new jobs.",
        updateNotAvailable: "You are no longer accepting new jobs."
      },
      fail: {
        setDefault: "Failed set default address",
        updateAvailableFail: "Failed to update job availability. Please try again."
      },
    },
    job: {
      success: {
        updateFavorite: "Successfully saved job to favorites",
        deleteFavorite: "Successfully unsaved job from favorites",
        createJobBoard: "Successfully create new job board"
      },
      fail: {
        createJobBoard: "Failed create new job board"
      },
    },
    review:{
      success: {
        postComment: "Successfully leave a comment",
        updateComment: "Successfully edit comment",
        deleteComment: "Successfully delete comment",
      },
      fail: {},
    },
    service:{
      success: {
        showJob: "Successfully public your job",
        hideJob: "Successfully hide your job",
      },
      fail: {},
    }
  };

  const successMessage = (
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

  const errorMessage = (
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
    successMessage,
    errorMessage,
  };
}

export default useNotification;
