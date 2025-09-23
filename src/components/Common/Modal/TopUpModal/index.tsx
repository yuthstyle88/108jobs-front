import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoins, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {callHttp, isSuccess} from "@/services/HttpService";
import type {ScbQrCodeResponse, ScbTokenResponse} from "lemmy-js-client";
import LoadingMultiCircle from "@/components/Common/Loading/LoadingMultiCircle";

interface TopUpModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    selectedAmount: number | null;
}

const TopUpModal = ({
                        isModalOpen,
                        setIsModalOpen,
                        selectedAmount,
                    }: TopUpModalProps) => {
    const {t} = useTranslation();

    const [qrImage, setQrImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastAmountRef = useRef<number | null>(null);

    const canRequest = isModalOpen && typeof selectedAmount === "number" && selectedAmount > 0;

    useEffect(() => {
        if (!canRequest) {
            setQrImage(null);
            setError(null);
            setLoading(false);
            return;
        }

        // Avoid refetch if same amount and we already have a QR.
        if (qrImage && lastAmountRef.current === selectedAmount) return;

        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                setQrImage(null);

                // 1) Get SCB access token first
                const tokenRes = await callHttp("generateScbToken");
                if (!(isSuccess<ScbTokenResponse>(tokenRes))) {
                    throw new Error((tokenRes as any).err?.message || "Failed to get token");
                }
                const accessToken = tokenRes.data?.data?.accessToken || tokenRes.data?.data?.accessToken;
                if (!accessToken) {
                    throw new Error("No access token returned");
                }

                // 2) Create QR code with amount (SCB requires shape { body: { qrType, amount, invoice }, token })
                const invoice = String(Math.floor(Date.now() / 1000)); // any unsigned number
                const body: Record<string, unknown> = {
                    qrType: "CS",
                    amount: String(selectedAmount ?? 0),
                    invoice,
                };
                const qrRes = await callHttp("createScbQrCode", {body, token: accessToken});
                if (!isSuccess<ScbQrCodeResponse>(qrRes)) {
                    throw new Error((qrRes as any).err?.message || "Failed to create QR code");
                }

                const raw = qrRes.data?.data?.qrImage || qrRes.data?.data?.qrImage;
                const img = typeof raw === "string"
                    ? (raw.startsWith("data:image") ? raw : `data:image/png;base64,${raw}`)
                    : null;

                if (!cancelled) {
                    setQrImage(img);
                    lastAmountRef.current = selectedAmount ?? null;
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || "Unexpected error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canRequest, selectedAmount, isModalOpen]);

    if (!isModalOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
            <div
                className="bg-white rounded-2xl max-w-md w-full mx-4 relative overflow-hidden shadow-2xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-[1.02]">
                {/* Gradient Header */}
                <div className="bg-gradient-to-r coin-gradient p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {t("profileCoins.topupModalTitle")}
                    </h3>
                    <button
                        className="text-white hover:text-gray-200 transition-colors duration-200"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close modal"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-2xl"/>
                    </button>
                </div>
                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Amount Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm font-medium">{t("profileCoins.labelAmountToTopUp")}</p>
                        <p className="text-2xl font-bold text-primary">
                            {selectedAmount?.toLocaleString()} <FontAwesomeIcon
                            icon={faCoins}
                            className="text-2xl text-yellow-500 transition-transform hover:scale-110"
                        />
                        </p>
                    </div>

                    {/* QR Code Section */}
                    <div className="rounded-lg p-4 border border-gray-100 bg-gray-50">
                        <p className="text-gray-700 text-sm font-medium mb-3">
                            {t("profileCoins.scanQrToPay", {amount: selectedAmount?.toLocaleString()}) ||
                                `Scan this QR code with your banking app to pay ${selectedAmount?.toLocaleString()} Coins`}
                        </p>
                        {loading && (
                            <div className="flex justify-center items-center">
                                {loading && (
                                    <LoadingMultiCircle/>
                                )}
                            </div>
                        )}
                        {error && (
                            <div className="text-sm text-red-600">
                                {t("global.tryRefreshingPage")}
                            </div>
                        )}
                        {!loading && !error && qrImage && (
                            <img src={qrImage} alt="SCB QR Code"
                                 className="w-full h-56 object-contain bg-white rounded-lg shadow"/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopUpModal;