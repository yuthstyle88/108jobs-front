"use client";
import { useState } from "react";
import { Info, MessageSquare } from "lucide-react";
import Link from "next/link";

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

  // Mock data
  const balance = "0.00";
  const transactions: Transaction[] = [];

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-800">
          Thu nhập của tôi
        </h1>
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 flex items-center text-sm font-medium">
            <Info className="w-4 h-4 mr-1" />
            Các bước để nhận tiền
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-blue-600 text-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg font-medium">Số dư tích lũy (đồng)</h2>
            <Info className="w-5 h-5 text-white opacity-80" />
          </div>
          <p className="text-3xl font-bold">{balance}</p>
        </div>
        {/* Verification Requirements Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Thông tin cần được xác minh khi có số dư tích lũy
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <div>
                <span className="text-gray-700">Thông tin CMND/CCCD: </span>
                <Link href="#" className="text-blue-600 hover:underline">
                  Kiểm tra thông tin của bạn
                </Link>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <div>
                <span className="text-gray-700">Thông tin khai báo thuế: </span>
                <Link href="#" className="text-blue-600 hover:underline">
                  Thêm dữ liệu →
                </Link>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-gray-700 mr-2">•</span>
              <div>
                <span className="text-gray-700">
                  Thông tin tài khoản ngân hàng:{" "}
                </span>
                <Link href="#" className="text-blue-600 hover:underline">
                  Thêm dữ liệu →
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Lịch sử chuyển tiền
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
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
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
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
              Bạn sẽ nhận được tiền trong 1-3 ngày làm việc sau khi trạng thái
              chuyển tiền thay đổi thành{" "}
              <span className="font-medium">Đã chuyển tiền</span> tùy thuộc vào
              thời gian xử lý của từng ngân hàng
            </p>
          </div>
        </div>
        {/* Transaction Table */}
        <div className="w-screen sm:w-full overflow-x-auto">
          <table className="min-w-[1024px] table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã rút tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày chốt số dư
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày chuyển
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chuyển đến tài khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngân hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền (đồng)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
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
                        Chưa có giao dịch nào trong {selectedMonth}{" "}
                        {selectedYear}
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
