import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../../features/auth/authStore";
import moment from "moment";
import { fetchPaymentHistory } from "../../../features/finance/api";
import { Payment } from "../../../features/finance/types";

const PaymentHistory = () => {
  const { user } = useAuthStore();

  const {
    data: paymentHistoryRaw,
    isLoading,
    error,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["payment-history", user?.email],
    queryFn: () => {
      if (!user?.email) return [];
      return fetchPaymentHistory(user.email);
    },
  });

  const paymentHistory = paymentHistoryRaw || [];

  const downloadCSV = () => {
    if (paymentHistory.length === 0) return;

    const headers = [
      "Transaction ID",
      "Amount (৳)",
      "Payment Method",
      "Paid At",
    ];
    const rows = (paymentHistory as Payment[]).map((p) => [
      p.transactionId,
      p.amount,
      p.paymentMethod,
      moment(p.paid_at).format("YYYY-MM-DD HH:mm"),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payment_history_${moment().format("YYYYMMDD")}.csv`,
    );
    link.click();
  };

  if (isLoading) return <div>Loading payment history...</div>;
  if (error) return <div>Error loading payment history</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          Payment History
        </h2>
        <button
          onClick={downloadCSV}
          className="btn btn-sm bg-primary text-white border-none hover:bg-primary/90 shadow-lg shadow-primary/20 px-6 rounded-xl font-bold"
        >
          Download CSV
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Amount (৳)</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Paid At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(paymentHistory as Payment[]).map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">
                    {payment.transactionId}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800 text-sm">
                      {payment.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge badge-ghost border-none bg-gray-100 text-gray-600 font-bold uppercase text-[10px] tracking-tight py-3 px-4">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {moment(payment.paid_at).format("MMM D, YYYY h:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
