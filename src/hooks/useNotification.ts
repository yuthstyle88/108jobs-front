"use client";

import { toast } from "sonner";
import { LanguageFile } from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";

type NotificationGroup = {
  success?: Record<string, string | undefined>;
  fail?: Record<string, string | undefined>;
};

type NotificationType = Record<"profile" | "job" | "review" | "service", NotificationGroup>;

function useNotification() {
  const notiLanguage = getNamespace(LanguageFile.NOTIFICATIONS);
  const jobLanguage = getNamespace(LanguageFile.NOTIFICATION);

  const type: NotificationType = {
    profile: {
      success: {
        update: notiLanguage.update,
        updateEducation: notiLanguage.updateEducation,
        updateWorkExperience: notiLanguage.updateWorkExperience,
        updateCertification: notiLanguage.updateCertification,
        updateSkill: notiLanguage.updateSkill,
        updateLanguage: notiLanguage.updateLanguage,
        changePassword: notiLanguage.changePassword,
        updateFavorite: jobLanguage?.jobUpdateFavoriteSuccess,
        deleteFavorite: jobLanguage?.jobDeleteFavoriteSuccess,
        updateAvailable: jobLanguage?.profileUpdateAvailableSuccess,
        updateNotAvailable: jobLanguage?.profileUpdateNotAvailableSuccess
      },
      fail: {
        setDefault: jobLanguage?.profileSetDefaultFail,
        updateAvailableFail: jobLanguage?.profileUpdateAvailableFail
      },
    },
    job: {
      success: {
        updateFavorite: jobLanguage?.jobUpdateFavoriteSuccess,
        deleteFavorite: jobLanguage?.jobDeleteFavoriteSuccess,
        createJobBoard: jobLanguage?.jobCreateJobBoardSuccess
      },
      fail: {
        createJobBoard: jobLanguage?.jobCreateJobBoardFail
      },
    },
    review:{
      success: {
        postComment: jobLanguage?.reviewPostCommentSuccess,
        updateComment: jobLanguage?.reviewUpdateCommentSuccess,
        deleteComment: jobLanguage?.reviewDeleteCommentSuccess,
      },
      fail: {},
    },
    service:{
      success: {
        showJob: jobLanguage?.serviceShowJobSuccess,
        hideJob: jobLanguage?.serviceHideJobSuccess,
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
