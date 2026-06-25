import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, Ticket } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Ticket className="w-6 h-6 rotate-12" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              TicketBari
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Home</Link>
            <Link to="/tickets" className="text-slate-600 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">All Tickets</Link>
            {user && (
              <Link to="/dashboard" className="text-slate-600 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Dashboard</Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-slate-200 dark:border-slate-800">
                  <div className="w-10 rounded-full">
                    <img src={user.avatar} alt={user.name} />
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 dark:bg-slate-900 rounded-box w-52 border border-slate-200/50 dark:border-slate-800/50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-850">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user.role}</p>
                  </div>
                  <li>
                    <Link to="/dashboard" className="flex items-center py-2"><LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="flex items-center text-red-500 py-2"><LogOut className="w-4 h-4 mr-2" /> Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn btn-ghost text-slate-700 dark:text-slate-200">Login</Link>
                <Link to="/register" className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white rounded-xl shadow-lg shadow-blue-500/25">Register</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800">Home</Link>
            <Link to="/tickets" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-355 hover:bg-slate-100 dark:hover:bg-slate-800">All Tickets</Link>
            {user && (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-355 hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</Link>
            )}
            {user ? (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
                <div className="flex items-center px-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                    <img src={user.avatar} alt={user.name} />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-slate-800 dark:text-slate-200">{user.name}</div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{user.role}</div>
                  </div>
                </div>
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-2 flex flex-col space-y-2 px-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-ghost w-full justify-center">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary w-full justify-center bg-blue-600 border-none text-white shadow-lg shadow-blue-500/20">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
