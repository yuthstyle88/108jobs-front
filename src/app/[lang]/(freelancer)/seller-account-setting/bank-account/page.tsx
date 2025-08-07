"use client";
import { useState } from "react";
import { getNamespace } from "@/utils/i18nHelper";
import { LanguageFile } from "@/constants/language";
import { Pencil, Plus } from "lucide-react";
import BankAccountModal, { BankAccountFormValues } from "../components/AddBankAccountModal";
import { useHttpGet } from "@/hooks/useHttpGet";
import { useHttpPost } from "@/hooks/useHttpPost";
import LoadingBlur from "@/components/LoadingBlur";

const BankAccount = () => {
  const sellerBankAccountLanguage = getNamespace(LanguageFile.SELLER_BANK_ACCOUNT);
  const global = getNamespace(LanguageFile.GLOBAL);

  const { data, isMutating: isBankLoading } = useHttpGet("getBankAccount");
  const bankList = data?.banks || [];

  const { execute: createBank, isMutating: isCreating } = useHttpPost("addBankAccount");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccountFormValues | null>(null);

  const handleAdd = () => {
    setEditingAccount(null);
    setModalOpen(true);
  };

  const handleEdit = (acc: BankAccountFormValues) => {
    setEditingAccount(acc);
    setModalOpen(true);
  };

  const handleSubmit = async (data: BankAccountFormValues & { id?: string }) => {
    await createBank({
      bankId: Number(data.bankId),
      accountNumber: data.accountNumber,
      accountName: data.accountName,
    });
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="flex justify-between items-center border-b border-gray-200 p-5">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            {sellerBankAccountLanguage?.bankInfoTitle}
          </h2>
          <p className="text-sm text-gray-500">
            {sellerBankAccountLanguage?.bankInfoDescription}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          {sellerBankAccountLanguage?.buttonAddBank}
        </button>
      </div>

      {/* Nếu có danh sách ngân hàng */}
      <div className="p-6">
        {isBankLoading || isCreating && <LoadingBlur text=""/>}
        {!isBankLoading && bankList.length === 0 && <p>{sellerBankAccountLanguage?.noBankFound}</p>}
        {!isBankLoading &&
          bankList.map((bank) => (
            <div
              key={bank.id}
              className="border border-gray-200 p-4 rounded-md flex justify-between items-center mb-4"
            >
              <div>
                <p className="font-medium text-gray-800">{bank.name}</p>
                <p className="text-gray-500">{bank.bankCode}</p>
              </div>
              <button
                onClick={() =>
                  handleEdit({
                    bankId: String(bank.id),
                    accountName: "",
                    accountNumber: "",
                  })
                }
                className="flex items-center gap-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
                {global?.buttonEdit || "Edit"}
              </button>
            </div>
          ))}
      </div>

      <BankAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingAccount}
        onSubmit={handleSubmit}
        bankList={bankList}
      />
    </div>
  );
};

export default BankAccount;
