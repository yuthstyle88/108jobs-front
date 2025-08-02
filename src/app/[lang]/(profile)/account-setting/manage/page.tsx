"use client";

import {useEffect, useState} from "react";
import TotpModal from "@/components/Common/Modal/TotpModal";
import {toast} from "react-toastify";
import {HttpService, UserService} from "@/services";

export default function AccountManagePage() {
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [showTotpModal, setShowTotpModal] = useState(false);
  const [modalType, setModalType] = useState<"generate" | "remove">("generate");
  const [secretUrl, setSecretUrl] = useState<string | undefined>();

  // Load profile's current TOTP status on mount
  useEffect(() => {
      const enabled =
        !!UserService.Instance.myUserInfo?.localUserView.localUser.totp2faEnabled;
      setTotpEnabled(enabled);
    },
    []);

  const handleTotpToggle = async() => {
    if (!totpEnabled) {
      // Enable flow: fetch secret and show modal
      setModalType("generate");
      setSecretUrl(undefined);
      try {
        const res = await HttpService.client.generateTotpSecret();
        if (res.state === "success") {
          setSecretUrl(res.data.totpSecretUrl);
          setShowTotpModal(true);
        }
      } catch (err) {
        toast("Unexpected error occurred",
          {type: "error"});
      }
    } else {
      // Disable flow: show modal to confirm code
      setModalType("remove");
      setShowTotpModal(true);
    }
  };

  const handleTotpSubmit = async(code: string): Promise<boolean> => {
    try {
      const res = await HttpService.client.updateTotp({
        enabled: modalType === "generate",
        totpToken: code,
      });

      if (res.state === "success") {
        setTotpEnabled(modalType === "generate");
        setShowTotpModal(false);

        toast(
          modalType === "generate"
            ? "Two-Factor Authentication Enabled"
            : "Two-Factor Authentication Disabled",
          {type: "success"}
        );

        // Refresh profile info
        const siteRes = await HttpService.client.getSite();
        if (siteRes.state === "success") {
          UserService.Instance.myUserInfo!.localUserView.localUser.totp2faEnabled =
            modalType === "generate";
        }

        return true;
      } else {
        toast("Incorrect TOTP Code",
          {type: "error"});
        return false;
      }
    } catch (err) {
      toast("Error while updating TOTP",
        {type: "error"});
      return false;
    }
  };

  return (
    <div>
      <TotpModal
        show={showTotpModal}
        onClose={() => setShowTotpModal(false)}
        onSubmit={handleTotpSubmit}
        type={modalType}
        secretUrl={modalType === "generate" ? secretUrl : undefined}
      />

      <div className="bg-white rounded-2xl shadow-md border border-border-primary p-6 space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-black">Account Management</h2>
          <p className="text-sm text-gray-600">
            Set up account information and security
          </p>
        </div>

        {/* TOTP 2FA Section */}
        <div className="border rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Two-Factor Authentication (TOTP)
              </h3>
              <p className="text-xs text-gray-500">
                Add an extra layer of security using a TOTP-compatible authenticator app.
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={totpEnabled}
                onChange={handleTotpToggle}
              />
              <div
                className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors duration-200 relative">
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    totpEnabled ? "translate-x-5" : ""
                  }`}
                ></span>
              </div>
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Status:{" "}
            <span
              className={`font-medium ${
                totpEnabled ? "text-green-600" : "text-red-500"
              }`}
            >
              {totpEnabled ? "Enabled" : "Disabled"}
            </span>
          </p>
        </div>

        {/* Set Password Section */}
        <div className="border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Set Password</h3>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 max-w-md">
              Set a strong password to protect your account from unauthorized access.
            </p>
            <button className="text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 border border-blue-200 text-sm font-medium">
              Set Password
            </button>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Delete Account</h3>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 max-w-md">
              Deleting your account is permanent. You will not be able to recover any data.
            </p>
            <button className="text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 border border-red-200 text-sm font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
