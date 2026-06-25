import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'vendor' | 'admin')[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (user.status === 'fraud') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 dark:bg-slate-950 p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-extrabold text-red-650">Account Suspended</h1>
          <p className="text-slate-500 text-sm">
            Your vendor account has been marked as fraud by platform administrators due to non-compliance or fraudulent ticket sales.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
