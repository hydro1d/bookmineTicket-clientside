import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google-login', {
        email: 'recruiter.google@ticketbari.com',
        name: 'Google Recruiter Guest',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120'
      });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Auth login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
        <p className="text-sm text-slate-500">Sign in to book travel tickets instantly</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold border border-red-200/50 dark:border-red-900/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full pl-10 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input input-bordered w-full pl-10 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full bg-blue-600 border-none hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-bold">Or</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn btn-outline border-slate-350 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 w-full flex items-center justify-center rounded-xl"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.28 1 3.26 3.72 1.34 7.68l3.77 2.92C6.01 7.26 8.78 5.04 12 5.04z" />
          <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.64z" />
          <path fill="#FBBC05" d="M5.11 14.77c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.34 7.23C.48 9 0 10.95 0 13s.48 4 1.34 5.77l3.77-3z" />
          <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.22 0-5.99-2.22-6.89-5.56l-3.77 3C3.26 20.28 7.28 23 12 23z" />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-xs text-slate-500">
        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
      </p>
    </div>
  );
};
