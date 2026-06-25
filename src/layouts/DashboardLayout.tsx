import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User as UserIcon, Ticket, CreditCard, PlusCircle, List, FileText, 
  TrendingUp, Users, ShieldAlert, LogOut, Sun, Moon, Home 
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = {
    user: [
      { path: '/dashboard', label: 'My Profile', icon: <UserIcon className="w-5 h-5" /> },
      { path: '/dashboard/bookings', label: 'My Bookings', icon: <Ticket className="w-5 h-5" /> },
      { path: '/dashboard/transactions', label: 'Transactions', icon: <CreditCard className="w-5 h-5" /> },
    ],
    vendor: [
      { path: '/dashboard', label: 'My Profile', icon: <UserIcon className="w-5 h-5" /> },
      { path: '/dashboard/add-ticket', label: 'Add Ticket', icon: <PlusCircle className="w-5 h-5" /> },
      { path: '/dashboard/my-tickets', label: 'My Tickets', icon: <List className="w-5 h-5" /> },
      { path: '/dashboard/requested-bookings', label: 'Requested Bookings', icon: <FileText className="w-5 h-5" /> },
      { path: '/dashboard/revenue', label: 'Revenue Stats', icon: <TrendingUp className="w-5 h-5" /> },
    ],
    admin: [
      { path: '/dashboard', label: 'My Profile', icon: <UserIcon className="w-5 h-5" /> },
      { path: '/dashboard/manage-tickets', label: 'Manage Tickets', icon: <List className="w-5 h-5" /> },
      { path: '/dashboard/manage-users', label: 'Manage Users', icon: <Users className="w-5 h-5" /> },
      { path: '/dashboard/advertise', label: 'Advertise Spotlights', icon: <ShieldAlert className="w-5 h-5" /> },
      { path: '/dashboard/stats', label: 'Platform Stats', icon: <TrendingUp className="w-5 h-5" /> },
    ],
  };

  const items = user ? navItems[user.role] : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors">
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <Ticket className="w-5 h-5 rotate-12" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">TicketBari</span>
            </Link>
            <button onClick={toggleTheme} className="p-2 md:hidden text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850/50">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={user?.avatar} alt={user?.name} />
            </div>
            <div className="truncate">
              <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{user?.name}</h4>
              <p className="text-xs text-slate-400 truncate capitalize">{user?.role} Portal</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={"flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all " + (
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2 mt-8 md:mt-0">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850">
            <Home className="w-5 h-5" />
            <span>Public Site</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="hidden md:flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
