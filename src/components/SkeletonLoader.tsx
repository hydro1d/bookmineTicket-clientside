import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="space-y-2 w-1/3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20"></div>
        </div>
      ))}
    </div>
  );
};
