"use client";

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {getNamespace} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";
import React, {useEffect} from "react";
import Modal from "@/components/ui/Modal";
import { Bank } from "@/lib/lemmy-js-client/src";

const schema = z.object({
  bankId: z.string().min(1, "Bank is required"),
  accountNumber: z.string().min(6, "Account number is required"),
  accountName: z.string().min(1, "Account name is required"),
});

export type BankAccountFormValues = z.infer<typeof schema>;

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BankAccountFormValues & { id?: string }) => void;
  initialData?: BankAccountFormValues & { id?: string } | null;
  bankList?: Bank[];
}

const BankAccountModal: React.FC<BankAccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  bankList = [],
}) => {
  const sellerBankAccountLanguage = getNamespace(LanguageFile.SELLER_BANK_ACCOUNT);
  const global = getNamespace(LanguageFile.GLOBAL);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankId: "",
      accountNumber: "",
      accountName: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ bankId: "", accountNumber: "", accountName: "" });
    }
  }, [initialData, reset, isOpen]);

  const onSubmitForm = (data: BankAccountFormValues) => {
    onSubmit({ ...data, id: initialData?.id });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? sellerBankAccountLanguage?.buttonEditBank : sellerBankAccountLanguage?.buttonAddBank}
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 text-text-primary">
        <div>
          <label className="block text-sm font-medium mb-1">
            {sellerBankAccountLanguage?.bankNameLabel}
          </label>
          <select
            {...register("bankId")}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">{sellerBankAccountLanguage?.bankNamePlaceholder}</option>
            {bankList.map((bank) => (
              <option key={String(bank.id)} value={String(bank.id)}>
                {bank.name} {bank.bankCode && `(${bank.bankCode})`}
              </option>
            ))}
          </select>
          {errors.bankId && (
            <p className="text-red-500 text-sm mt-1">{errors.bankId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {sellerBankAccountLanguage?.bankAccountNumberLabel}
          </label>
          <input
            type="text"
            {...register("accountNumber")}
            placeholder={sellerBankAccountLanguage?.bankAccountNumberPlaceholder}
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.accountNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {sellerBankAccountLanguage?.bankAccountName }
          </label>
          <input
            type="text"
            {...register("accountName")}
            placeholder="John Smith"
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.accountName && (
            <p className="text-red-500 text-sm mt-1">{errors.accountName.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#063a68]"
          >
            {global?.buttonSave || "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BankAccountModal;
