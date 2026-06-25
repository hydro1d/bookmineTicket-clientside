import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Calendar, UserCheck } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your credentials and view account status</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8 shadow-sm">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-150 dark:border-blue-900 flex-shrink-0">
          <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4 text-center sm:text-left flex-grow">
          <div>
            <h2 className="text-2xl font-bold flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {user?.name}
              <span className="badge badge-primary bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-none capitalize py-3">{user?.role}</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3 text-sm">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <span className="text-slate-500 dark:text-slate-400">Account status:</span>
              <span className="font-semibold text-green-500 capitalize">{user?.status}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="text-slate-500 dark:text-slate-400">Security protection:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">JWT Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
