"use client";

import {toast} from "sonner";
import {useTranslation} from "react-i18next";

type NotificationGroup = {
  success?: Record<string, string | undefined>;
  fail?: Record<string, string | undefined>;
};

type NotificationType = Record<"profile" | "job" | "review" | "service", NotificationGroup>;

function useNotification() {
  const {t} = useTranslation();

  const type: NotificationType = {
    profile: {
      success: {
        update: t("notifications.update"),
        updateEducation: t("notifications.updateEducation"),
        updateWorkExperience: t("notifications.updateWorkExperience"),
        updateCertification: t("notifications.updateCertification"),
        updateSkill: t("notifications.updateSkill"),
        updateLanguage: t("notifications.updateLanguage"),
        changePassword: t("notifications.changePassword"),
        updateFavorite: t("notification.jobUpdateFavoriteSuccess"),
        deleteFavorite: t("notification.jobDeleteFavoriteSuccess"),
        updateAvailable: t("notification.profileUpdateAvailableSuccess"),
        updateNotAvailable: t("notification.profileUpdateNotAvailableSuccess")
      },
      fail: {
        setDefault: t("notification.profileSetDefaultFail"),
        updateAvailableFail: t("notification.profileUpdateAvailableFail")
      },
    },
    job: {
      success: {
        updateFavorite: t("notification.jobUpdateFavoriteSuccess"),
        deleteFavorite: t("notification.jobDeleteFavoriteSuccess"),
        createJobBoard: t("notification.jobCreateJobBoardSuccess")
      },
      fail: {
        createJobBoard: t("notification.jobCreateJobBoardFail")
      },
    },
    review: {
      success: {
        postComment: t("notification.reviewPostCommentSuccess"),
        updateComment: t("notification.reviewUpdateCommentSuccess"),
        deleteComment: t("notification.reviewDeleteCommentSuccess"),
      },
      fail: {},
    },
    service: {
      success: {
        showJob: t("notification.serviceShowJobSuccess"),
        hideJob: t("notification.serviceHideJobSuccess"),
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
