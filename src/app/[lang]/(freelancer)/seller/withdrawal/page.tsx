"use client";
import { useState } from "react";
import { Info, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";
import { interpolateDouble } from "@/utils/interpolate";
import Loading from "@/components/Loading";
import Error from "@/app/error";

// Define the interface for a single transaction
interface Transaction {
  transactionId: string;
  balanceDate: string;
  transferDate: string;
  account: string;
  bank: string;
  amount: string;
  status: string;
  note: string;
}

const Withdrawal = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedYear, setSelectedYear] = useState("2025");

  const { data: sellerWithdrawalLanguage,isLoading,error } = useGlobalTranslate(
    LanguageFile.SELLER_WITHDRAWAL
  );

  // Mock data
  const balance = "0.00";
  const transactions: Transaction[] = [];

  if (isLoading) return <Loading />;
  if (error) return <Error/>;

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-800">
          {sellerWithdrawalLanguage?.my_income}
        </h1>
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 flex items-center text-sm font-medium">
            <Info className="w-4 h-4 mr-1" />
            {sellerWithdrawalLanguage?.payment_steps}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-blue-600 text-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg font-medium">
              {sellerWithdrawalLanguage?.accumulated_balance}
            </h2>
            <Info className="w-5 h-5 text-white opacity-80" />
          </div>
          <p className="text-3xl font-bold">{balance}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            {sellerWithdrawalLanguage?.verification_info_title}
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <div>
                <span className="text-gray-700">
                  {sellerWithdrawalLanguage?.verification_id}: {""}
                </span>
                <Link prefetch={false} href="#" className="text-blue-600 hover:underline">
                  {sellerWithdrawalLanguage?.check_your_info}
                </Link>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <div>
                <span className="text-gray-700">
                  {sellerWithdrawalLanguage?.verification_tax}: {""}
                </span>
                <Link prefetch={false} href="#" className="text-blue-600 hover:underline">
                  {sellerWithdrawalLanguage?.add_data} →
                </Link>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <div>
                <span className="text-gray-700">
                  {sellerWithdrawalLanguage?.verification_bank}: {""}
                </span>
                <Link prefetch={false} href="#" className="text-blue-600 hover:underline">
                  {sellerWithdrawalLanguage?.add_data} →
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              {sellerWithdrawalLanguage?.transaction_history}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
            <select
              className="px-4 py-2 border text-text_primary border-gray-300 rounded-md focus:outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <select
              className="px-4 py-2 text-text_primary border border-gray-300 rounded-md focus:outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
        {/* Transaction Notification */}
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <p className="ml-3 text-sm text-blue-700">
              {sellerWithdrawalLanguage?.transfer_note}
            </p>
          </div>
        </div>
        {/* Transaction Table */}
        <div className="w-screen sm:w-full overflow-x-auto">
          <table className="min-w-[1024px] table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {sellerWithdrawalLanguage?.column_withdrawal_code}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {sellerWithdrawalLanguage?.column_closing_date}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {sellerWithdrawalLanguage?.column_transfer_date}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {sellerWithdrawalLanguage?.column_account}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {sellerWithdrawalLanguage?.column_bank}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {sellerWithdrawalLanguage?.column_amount}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {sellerWithdrawalLanguage?.column_status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {sellerWithdrawalLanguage?.column_note}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.balanceDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.transferDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.account}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.bank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.note}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        {interpolateDouble(
                          sellerWithdrawalLanguage?.no_transactions || "",
                          { month: selectedMonth, year: selectedYear }
                        )}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Withdrawal;
