"use client";
import ChangeEmailModal from "@/components/ChangeEmailModal";
import ConfirmChangeEmailModal from "@/components/ConfirmChangeEmailModal";
import LoadingCircle from "@/components/LoadingCircle";
import { ERROR_CONSTANTS } from "@/constants/error";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetch } from "@/hooks/api-hooks";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ZipcodeSearch from "../_components/SearchZipcode";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { addressSchema } from "@/utils/validation/addressSchema";
import { API_ROUTES } from "@/api/endpoints";
import useNotification from "@/hooks/useNotification";
import { LOADING_REQUEST, RequestState } from "@/services/HttpService";
import { Address, CountriesResponse } from "lemmy-js-client";
import { getNamespace } from "@/utils/i18nHelper";

const emailSchema = z.object({
  email: z.string().min(1,
    "กรุณากรอกอีเมลหรือเบอร์โทรศัพท์").optional(),
});

type VerifyEmailFormData = z.infer<typeof emailSchema>;

export default function ContactPage() {
  const { profileState, address, contact } = useMyUser();
  const { t } = useTranslation();

  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    reset: resetEmail,
    formState: { isSubmitting: isSubmittingEmail },
    getValues: getEmailValues,
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: contact?.email,
    },
  });

  const contactInfoLanguageData = getNamespace(LanguageFile.CONTACT);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmChange, setIsConfirmChange] = useState(false);
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isConfirmChange) {
      resetEmail({ email: contact?.email });
    }
  },
    [isConfirmChange, profileState, resetEmail]);

  const onSubmitEmail = async (data: VerifyEmailFormData) => {
    try {
      setApiError(null);
      const response = await fetch("/api/auth/resend-change-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });

      const result = await response.json();
      if (!response.ok) {
        if (result.error) setApiError(ERROR_CONSTANTS.EMAIL_NOT_EXIST);
        return;
      }

      setIsChangeModal(true);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลงทะเบียน"
      );
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border-1 border-border-primary mb-6">
        <div className="border-b p-6">
          <h2 className="text-[16px] font-medium mb-2 text-text-primary">
            {t("profileContact.sectionContactInfo")}
          </h2>
          <p className="text-gray-600 text-[14px] font-sans">
            {t("profileContact.subtitleContactInfo")}
          </p>
        </div>

        <div className="p-6">
          {isConfirmChange ? (
            <form onSubmit={handleEmailSubmit(onSubmitEmail)}>
              <div className="mb-6">
                <div className="flex gap-2 items-end w-full">
                  <div className="flex-1">
                    <label className="block text-sm text-text-primary font-semibold mb-2">
                      {t("profileContact.labelContactEmail")}
                    </label>
                    <input
                      type="email"
                      {...emailRegister("email")}
                      className={`text-text-primary w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${apiError
                        ? "border-[#ea6357] text-[#ea6357]"
                        : "border-gray-300"
                        }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingEmail}
                      className="px-3 py-[8px] submit-button"
                    >
                      {isSubmittingEmail ? (
                        <LoadingCircle />
                      ) : (
                        t("global.buttonChange")
                      )}
                    </button>
                  </div>
                </div>
                {apiError && (
                  <div className="text-[#ea6357] text-[12px] font-sans">
                    {apiError}
                  </div>
                )}
              </div>
            </form>
          ) : (
            <div className="mb-6 flex gap-2 items-end w-full">
              <div className="flex-1">
                <label className="block text-sm text-text-primary font-semibold mb-2">
                  {t("profileContact.labelContactEmail")}
                </label>
                <input
                  type="email"
                  value={contact?.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-[8px] rounded-md text-third border-gray-200 border-1"
                >
                  {t("global.buttonEdit")}
                </button>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm text-text-primary font-semibold text-gray-600 mb-1 font-sans">
              {t("profileContact.labelContactPhone")}
            </h3>
            <p className="text-[12px] text-gray-500 mb-2 font-sans">
              {t("profileContact.noteContactPhone")}
            </p>
            <div className="flex gap-4">
              <input
                type="tel"
                className="text-text-primary flex-1 border border-gray-300 rounded-lg px-3 py-2"
                placeholder="ระบุเบอร์โทร"
                defaultValue="0981893238"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {t("global.buttonEdit")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-lg text-sm text-text-primary font-semibold font-sans p-6 shadow-sm border-1 border-border-primary"
      >
        <div className="border-b pb-6 mb-6">
          <h2 className="text-[16px] font-medium mb-2 text-text-primary">
            {t("profileContact.socialLinksTitle")}
          </h2>
          <p className="text-gray-600 text-[14px] font-sans">
            {t("profileContact.socialLinksSubtitle")}
          </p>
        </div>
        {/* Line ID */}
        <div className="mb-6 flex gap-2 items-end w-full">
          <div className="flex-1">
            <label className="block text-sm text-text-primary font-semibold mb-2">
              {t("profileContact.labelLineId")}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary"
              placeholder="Enter your Line ID"
              defaultValue=""
            />
          </div>
          <div className="justify-end">
            <button
              className="px-3 py-[8px] rounded-md text-third border-gray-200 border-1"
            >
              {t("global.buttonSave")}
            </button>
          </div>
        </div>

        {/* Facebook */}
        <div className="mb-6 flex gap-2 items-end w-full">
          <div className="flex-1">
            <label className="block text-sm text-text-primary font-semibold mb-2">
              {t("profileContact.labelFacebook")}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary"
              placeholder="Enter your Facebook profile/link"
              defaultValue=""
            />
          </div>
          <div className="justify-end">
            <button
              className="px-3 py-[8px] rounded-md text-third border-gray-200 border-1"
            >
              {t("global.buttonSave")}
            </button>
          </div>
        </div>

        {/* Second Email */}
        <div className="mb-6 flex gap-2 items-end w-full">
          <div className="flex-1">
            <label className="block text-sm text-text-primary font-semibold mb-2">
              {t("profileContact.labelSecondEmail")}
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-text-primary"
              placeholder="your.second.email@example.com"
              defaultValue=""
            />
          </div>
          <div className="justify-end">
            <button
              className="px-3 py-[8px] rounded-md text-third border-gray-200 border-1"
            >
              {t("global.buttonSave")}
            </button>
          </div>
        </div>

      </div>

      <ConfirmChangeEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleConfirmChange={() => {
          setIsConfirmChange(true);
          setIsModalOpen(false);
        }}
      />

      <ChangeEmailModal
        formEmail={getEmailValues("email")}
        isOpen={isChangeModal}
        onClose={() => setIsChangeModal(false)}
        handleConfirmChange={async () => {
          setIsConfirmChange(false);
          setIsChangeModal(false);
        }}
      />
    </div>
  );
}
