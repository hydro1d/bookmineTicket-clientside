import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/SkeletonLoader';
import { CreditCard } from 'lucide-react';

interface Booking {
  _id: string;
  ticket: {
    title: string;
    from: string;
    to: string;
  };
  totalPrice: number;
  paymentIntentId?: string;
  createdAt: string;
  status: string;
}

export const MyTransactions: React.FC = () => {
  const [txns, setTxns] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/bookings/user-bookings');
        if (res.data.success) {
          const paidOnly = res.data.bookings.filter((b: Booking) => b.status === 'paid');
          setTxns(paidOnly);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Transactions</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">View invoice payments and payment gateway logs</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : txns.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">No payment transaction records found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th>Transaction ID</th>
                  <th>Journey Item</th>
                  <th>Amount Paid</th>
                  <th>Verification Date</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((txn) => (
                  <tr key={txn._id} className="border-b border-slate-100 dark:border-slate-850">
                    <td className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                      {txn.paymentIntentId || 'TXN-MOCK-' + txn._id.substring(0, 8).toUpperCase()}
                    </td>
                    <td>
                      <div className="font-bold text-sm">{txn.ticket?.title}</div>
                      <div className="text-xs text-slate-400">{txn.ticket?.from} &rarr; {txn.ticket?.to}</div>
                    </td>
                    <td className="font-extrabold text-slate-800 dark:text-white">${txn.totalPrice}</td>
                    <td className="text-xs text-slate-500">
                      {new Date(txn.createdAt).toLocaleDateString()} | {new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
