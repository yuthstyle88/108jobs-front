'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface QuotationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { price: number; description: string; terms?: string; file: File | null }) => void;
}

const QuotationModal: React.FC<QuotationModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [terms, setTerms] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert(t('profileChat.invalidFile') || 'Please select a valid PDF file.');
            setFile(null);
            e.target.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            alert(t('profileChat.invalidPrice') || 'Please enter a valid price.');
            return;
        }
        if (!file) {
            alert(t('profileChat.noFile') || 'Please upload a PDF quotation.');
            return;
        }
        onSubmit({ price: priceValue, description, terms, file });
        setPrice('');
        setDescription('');
        setTerms('');
        setFile(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                <h3 className="text-lg text-gray-600Í font-semibold mb-4">{t('profileChat.quotationTitle') || 'Create Quotation'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t('profileChat.price')}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter price"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t('profileChat.quotationFile') || 'Quotation PDF'}
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:bg-gray-50 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100"
                            required
                        />
                        {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {t('profileChat.cancel') || 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            {t('profileChat.sendQuotation') || 'Send Quotation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuotationModal;