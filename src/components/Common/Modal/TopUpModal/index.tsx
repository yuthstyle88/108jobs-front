import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent } from "react";
import {useTranslation} from "react-i18next";

interface TopUpModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    selectedAmount: number | null;
    proofImage: string | null;
    handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
}

const TopUpModal = ({
                        isModalOpen,
                        setIsModalOpen,
                        selectedAmount,
                        proofImage,
                        handleImageUpload,
                        handleSubmit,
                    }: TopUpModalProps) => {
    const {t} = useTranslation();
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 relative overflow-hidden shadow-2xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-[1.02]">
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
                        <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                    </button>
                </div>
                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Amount Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm font-medium">{t("profileCoins.labelAmountToTopUp")}</p>
                        <p className="text-2xl font-bold text-primary">
                            {selectedAmount?.toLocaleString()} Coins
                        </p>
                    </div>
                    {/* Bank Info Section */}
                    <div className="border-l-4 border-primary pl-4">
                        <p className="text-gray-600 text-sm font-medium">{t("global.bankInfo")}</p>
                        <div className="mt-2 text-gray-800 text-sm">
                            <p><span className="font-semibold">{t("sellerBankAccount.bankNameLabel")}:</span> Example Bank</p>
                            <p><span className="font-semibold">{t("sellerBankAccount.bankAccountName")}:</span> Admin Name</p>
                            <p><span className="font-semibold">{t("sellerBankAccount.bankAccountNumberLabel")}:</span> 1234-5678-9012-3456</p>
                        </div>
                    </div>
                    {/* File Upload Section */}
                    <div>
                        <p className="text-gray-600 text-sm font-medium mb-2">{t("profileCoins.uploadProof")}</p>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors duration-200">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Upload proof of transfer"
                            />
                            <p className="text-gray-500 text-sm">
                                {proofImage ? t("profileCoins.imageSelected") :  t("profileCoins.dragDropClick")}
                            </p>
                        </div>
                        {proofImage && (
                            <div className="mt-4">
                                <img
                                    src={proofImage}
                                    alt="Proof of transfer"
                                    className="w-full h-48 object-contain rounded-lg shadow-md"
                                />
                            </div>
                        )}
                    </div>
                    {/* Submit Button */}
                    <button
                        className={`w-full bg-gradient-to-r bg-primary text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-300 ${
                            !proofImage ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handleSubmit}
                        disabled={!proofImage}
                        aria-label="Submit top-up request"
                    >
                        {t("profileCoins.submitPaymentButton")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopUpModal;