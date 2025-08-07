"use client";

import { useState } from "react";
import { getNamespace } from "@/utils/i18nHelper";
import { LanguageFile } from "@/constants/language";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import BankAccountModal, { BankAccountFormValues } from "../components/AddBankAccountModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useHttpGet } from "@/hooks/useHttpGet";
import { useHttpPost } from "@/hooks/useHttpPost";

interface Bank {
  id: number;
  name: string;
  bankCode: string;
}

interface BankAccount {
  id: number;
  bank: Bank;
  accountNumber: string;
  accountName: string;
  isDefault?: boolean;
}

const BankAccount = () => {
  const sellerBankAccountLanguage = getNamespace(LanguageFile.SELLER_BANK_ACCOUNT);
  const global = getNamespace(LanguageFile.GLOBAL);

  const {
    data: bankListRes,
    isMutating: isBankListLoading,
  } = useHttpGet("getBankAccount");

  const {
    data: bankAccountsRes,
    isMutating: isBankAccountsLoading,
  } = useHttpGet("getMyBankAccounts");

  const { execute: createBankAccount } = useHttpPost("addBankAccount");
  const { execute: setDefaultBankAccount } = useHttpPost("setDefaultBankAccount");
  const { execute: deleteBankAccount, isMutating: isDeleting } =
    useHttpPost("deleteBankAccount");

  const bankList: Bank[] = bankListRes?.banks || [];
  const bankAccounts: BankAccount[] = bankAccountsRes?.bankAccounts || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccountFormValues | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(null);

  const handleAdd = () => {
    setEditingAccount(null);
    setModalOpen(true);
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount({
      bankId: String(account.bank.id),
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      id: String(account.id),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (data: BankAccountFormValues & { id?: string }) => {
    await createBankAccount({
      bankId: Number(data.bankId),
      accountNumber: data.accountNumber,
      accountName: data.accountName,
    });
  };

  const handleSetDefault = async (id: number) => {
    await setDefaultBankAccount({ bankAccountId: id });
  };

  const handleConfirmDelete = (id: number) => {
    setDeletingAccountId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (deletingAccountId == null) return;
    await deleteBankAccount({ bankAccountId: deletingAccountId });
    setConfirmDeleteOpen(false);
    setDeletingAccountId(null);
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
          {global?.buttonAdd || "Add"}
        </button>
      </div>

      <div className="p-6 space-y-4">
        {isBankAccountsLoading && <p>Loading accounts...</p>}

        {bankAccounts.map((acc) => (
          <div
            key={acc.id}
            className={`border rounded-md p-4 flex justify-between items-center ${
              acc.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
          >
            <div>
              <p className="font-medium text-gray-800">{acc.bank.name}</p>
              <p className="text-gray-500">
                {acc.accountNumber} — {acc.accountName}
              </p>
              {acc.isDefault && (
                <span className="text-xs text-blue-600 font-medium">
                  ✅ Default
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {!acc.isDefault && (
                <button
                  onClick={() => handleSetDefault(acc.id)}
                  className="text-sm text-blue-600 border border-blue-600 rounded-md px-3 py-1 hover:bg-blue-50"
                >
                  <Star className="w-4 h-4 inline mr-1" />
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleEdit(acc)}
                className="text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4 inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleConfirmDelete(acc.id)}
                className="text-sm text-red-600 border border-red-600 rounded-md px-3 py-1 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete
              </button>
            </div>
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

      <ConfirmDeleteModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Bank Account"
        description="Are you sure you want to delete this bank account? This action cannot be undone."
      />
    </div>
  );
};

export default BankAccount;
