import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Users, Ticket, CreditCard, ShieldAlert } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalTickets: number;
  totalTransactions: number;
  totalRevenue: number;
}

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">System Administration</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Overall metrics logs, user levels, active bookings and revenue streams</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-450 uppercase font-semibold">Total Users</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{stats?.totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-455 uppercase font-semibold">Total Schedules</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{stats?.totalTickets}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-450 uppercase font-semibold">Transactions</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{stats?.totalTransactions}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-450 uppercase font-semibold">Total Sales Volume</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">${stats?.totalRevenue}</h3>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 flex items-center space-x-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]"></div>
        <div className="space-y-2 relative z-10">
          <h3 className="text-lg font-bold">Recruiter Admin Verification</h3>
          <p className="text-slate-400 text-sm max-w-xl">
            As an Administrator, you can verify tickets uploaded by vendors, promote spot advertisements, adjust role access, and isolate vendor accounts flagged as fraudulent instantly.
          </p>
        </div>
      </div>
    </div>
  );
};
