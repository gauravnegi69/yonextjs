"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Database, RefreshCw, LogOut, Settings } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminAuth } from '../../components/admin/AdminAuth';
import { Dashboard } from '../../components/admin/Dashboard';
import { AppsManager } from '../../components/admin/AppsManager';
import { AppDetail, Category, DashboardAnalytics, SiteSettings } from '../../types';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, token, logout, loading: authLoading } = useAdminAuth();
  const [adminSubTab, setAdminSubTab] = useState<'dashboard' | 'crud' | 'settings'>('dashboard');

  // Data states
  const [apps, setApps] = useState<AppDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Fetch core data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, catsRes, settingsRes] = await Promise.all([
        fetch('/api/apps'),
        fetch('/api/categories'),
        fetch('/api/settings')
      ]);

      if (appsRes.ok && catsRes.ok && settingsRes.ok) {
        const appsData = await appsRes.json();
        const catsData = await catsRes.json();
        const settingsData = await settingsRes.json();

        setApps(appsData);
        setCategories(catsData);
        setSettings(settingsData);
      }
    } catch (e) {
      console.error('Data retrieval failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!isAuthenticated || !token) return;
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, token]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-2">
        <RefreshCw className="animate-spin text-cyan-400 w-6 h-6" />
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Securing Connection...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center w-full">
        <div className="w-full max-w-[480px] min-h-screen bg-white flex flex-col justify-center relative p-4 shadow-xl">
          <AdminAuth />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-start justify-center w-full">
      <div className="mobile-container min-h-screen flex flex-col justify-between relative w-full max-w-[480px] lg:max-w-[1200px] bg-slate-50 text-slate-800 shadow-2xl pb-16">

        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-slate-900 text-white px-3.5 py-3 flex items-center justify-between border-b border-white/5 select-none shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-black text-base shadow">
              ⚙️
            </div>
            <div className="text-left">
              <strong className="text-xs font-black tracking-wide block leading-none font-header">YONO HUB</strong>
              <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-wider block mt-0.5">Admin Secured Console</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="text-[9px] font-extrabold text-rose-500 flex items-center gap-1 border border-rose-500/20 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10 cursor-pointer transition-all bg-transparent outline-none"
            >
              <LogOut size={10} />
              Logout
            </button>
            <Link
              href="/"
              className="text-[9px] font-extrabold text-slate-300 flex items-center gap-1 border border-slate-750 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 cursor-pointer transition-all no-underline"
            >
              Public Site
            </Link>
          </div>
        </header>

        {/* Content body frame */}
        <main className="flex-1 p-4 w-full relative z-10">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-[#b91c1c] w-6 h-6" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Loading Lobbies...
              </span>
            </div>
          ) : (
            <div className="space-y-5 animate-fadeIn">

              {/* Admin Dashboard Navigation Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex gap-4">
                  <button
                    onClick={() => setAdminSubTab('dashboard')}
                    className={`pb-2 text-xs font-bold font-header uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-1.5 bg-transparent border-t-0 border-x-0 outline-none ${adminSubTab === 'dashboard'
                        ? 'border-slate-800 text-slate-900 font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <Compass size={12} />
                    STATISTICS
                  </button>

                  <button
                    onClick={() => setAdminSubTab('crud')}
                    className={`pb-2 text-xs font-bold font-header uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-1.5 bg-transparent border-t-0 border-x-0 outline-none ${adminSubTab === 'crud'
                        ? 'border-slate-800 text-slate-900 font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <Database size={12} />
                    LISTINGS
                  </button>

                  <button
                    onClick={() => setAdminSubTab('settings')}
                    className={`pb-2 text-xs font-bold font-header uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-1.5 bg-transparent border-t-0 border-x-0 outline-none ${adminSubTab === 'settings'
                        ? 'border-slate-800 text-slate-900 font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <Settings size={12} />
                    SETTINGS
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { fetchData(); fetchAnalytics(); }}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <RefreshCw size={11} />
                  </button>
                </div>
              </div>

              {/* Content view toggle */}
              {adminSubTab === 'dashboard' && (
                <Dashboard
                  analytics={analytics}
                  loading={analyticsLoading}
                  settings={settings}
                  onRefreshSettings={fetchData}
                  onNavigateToManager={() => setAdminSubTab('crud')}
                  viewMode="metrics"
                />
              )}

              {adminSubTab === 'crud' && (
                <AppsManager
                  apps={apps}
                  categories={categories}
                  onRefresh={() => {
                    fetchData();
                    fetchAnalytics();
                  }}
                />
              )}

              {adminSubTab === 'settings' && (
                <Dashboard
                  analytics={analytics}
                  loading={analyticsLoading}
                  settings={settings}
                  onRefreshSettings={fetchData}
                  onNavigateToManager={() => setAdminSubTab('crud')}
                  viewMode="settings"
                />
              )}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
