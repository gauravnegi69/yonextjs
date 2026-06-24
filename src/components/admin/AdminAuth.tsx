"use client";

import React, { useState } from 'react';
import { Lock, ShieldAlert, ArrowRight, Mail, Key } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminAuth: React.FC = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(false);
    
    const success = await login(email, password);
    setLoading(false);

    if (!success) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-md space-y-5">
        
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center mx-auto mb-3">
            <Lock size={18} />
          </div>
          <h1 className="text-base font-black text-slate-800 uppercase tracking-wide">Admin Console</h1>
          <p className="text-xs text-slate-500">Provide credentials to access configuration dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0 text-red-600" />
            <span className="font-semibold">Incorrect email or password. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                disabled={loading}
                autoComplete="off"
                className="w-full h-10 pl-10 pr-4 rounded-xl text-xs outline-none text-slate-800 bg-white border border-slate-300 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10 transition-all font-bold"
              />
              <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Security Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                autoComplete="new-password"
                className="w-full h-10 pl-10 pr-4 rounded-xl text-xs outline-none text-slate-800 bg-white border border-slate-300 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10 transition-all font-mono tracking-widest"
              />
              <Key size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl bg-slate-800 text-white font-extrabold text-xs shadow hover:bg-slate-900 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0"
          >
            {loading ? 'Verifying...' : 'Unlock Console'}
            <ArrowRight size={13} />
          </button>
        </form>

      </div>
    </div>
  );
};
export default AdminAuth;
