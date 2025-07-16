"use client";

import React, {useEffect, useRef, useState} from "react";
import Modal from "@/components/ui/Modal";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {QRCodeCanvas} from "qrcode.react";

interface TotpModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (totp: string) => Promise<boolean>;
    type: "login" | "remove" | "generate";
    secretUrl?: string;
}

const TOTP_LENGTH = 6;

export default function TotpModal({
                                      show,
                                      onClose,
                                      onSubmit,
                                      type,
                                      secretUrl,
                                  }: TotpModalProps) {
    const [totp, setTotp] = useState("");
    const [pending, setPending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (show) {
            setTotp("");
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [show]);

    const clearTotp = () => {
        setTotp("");
    };

    const handleSubmit = async (code: string) => {
        setPending(true);
        const ok = await onSubmit(code);
        setPending(false);

        if (!ok) {
            setTotp("");
            inputRef.current?.focus();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setTotp(value);
            if (value.length >= TOTP_LENGTH) void handleSubmit(value);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").trim();

        if (!/^\d+$/.test(text) || text.length > TOTP_LENGTH) {
            toast.error("Invalid TOTP code");
            clearTotp();
        } else {
            setTotp(text);
            if (text.length === TOTP_LENGTH) void handleSubmit(text);
        }
    };

    const modalTitle =
        type === "generate"
            ? "Enable TOTP"
            : type === "remove"
                ? "Disable TOTP"
                : "Enter TOTP Code";

    return (
        <Modal isOpen={show} onClose={onClose} title={<span className="text-black">{modalTitle}</span>}>
            <div className="flex flex-col items-center gap-4 text-black">
                {type === "generate" && secretUrl && (
                    <>
                        <a href={secretUrl} className="btn btn-secondary hover:underline">
                            View TOTP Setup Link
                        </a>
                        <div className="text-center text-black">
                            <strong className="text-black">Scan QR Code</strong>
                            <QRCodeCanvas value={secretUrl} size={180} className="mx-auto mt-2" />
                        </div>
                    </>
                )}

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (totp.length === TOTP_LENGTH) await handleSubmit(totp);
                    }}
                >
                    <label htmlFor="totp-input" className="block font-bold mb-2 text-center text-black">
                        Enter TOTP Code
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={TOTP_LENGTH}
                        id="totp-input"
                        ref={inputRef}
                        className="form-control text-center text-lg px-4 py-2 text-black border border-black focus:border-black focus:ring-black"
                        value={totp}
                        onChange={handleInput}
                        onPaste={handlePaste}
                        disabled={pending}
                        required
                    />
                </form>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <button
                    className="btn btn-success text-black"
                    type="submit"
                    disabled={totp.length !== TOTP_LENGTH || pending}
                    onClick={async () => await handleSubmit(totp)}
                >
                    Submit
                </button>
                <button className="btn btn-danger text-black" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </Modal>
    );

}
