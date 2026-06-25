import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export const Error404: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-24 p-8 text-center space-y-6">
      <div className="inline-flex p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full">
        <AlertCircle className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-extrabold">Page Not Found</h1>
      <p className="text-slate-505 dark:text-slate-400 text-sm">
        The route you are searching for does not exist or has been removed.
      </p>
      <Link to="/" className="btn btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 inline-flex items-center">
        <Home className="w-4 h-4 mr-2" /> Go back Home
      </Link>
    </div>
  );
};
