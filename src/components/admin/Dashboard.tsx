"use client";

import React, { useState, useEffect } from 'react';
import { Eye, MousePointerClick, TrendingUp, AlertCircle, BarChart3, ListCollapse, Award, Settings } from 'lucide-react';
import { DashboardAnalytics, SiteSettings } from '../../types';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface DashboardProps {
  analytics: DashboardAnalytics | null;
  loading: boolean;
  settings: SiteSettings | null;
  onRefreshSettings?: () => void;
  onNavigateToManager?: () => void;
  viewMode?: 'metrics' | 'settings';
}

export const Dashboard: React.FC<DashboardProps> = ({
  analytics,
  loading,
  settings,
  onRefreshSettings,
  onNavigateToManager,
  viewMode = 'metrics'
}) => {
  const { token } = useAdminAuth();

  // Local settings states
  const [settingsTab, setSettingsTab] = useState<'header' | 'banners' | 'footer' | 'theme'>('header');
  const [adImage, setAdImage] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adActive, setAdActive] = useState(false);
  const [backgroundType, setBackgroundType] = useState('white');
  const [cardStyle, setCardStyle] = useState('default');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [banner1, setBanner1] = useState('');
  const [banner2, setBanner2] = useState('');
  const [banner3, setBanner3] = useState('');
  const [banner4, setBanner4] = useState('');
  const [footerAdLogo, setFooterAdLogo] = useState('');
  const [footerAdName, setFooterAdName] = useState('');
  const [footerAdDesc, setFooterAdDesc] = useState('');
  const [siteDomain, setSiteDomain] = useState('');
  const [headerLogo, setHeaderLogo] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerSubtitle, setHeaderSubtitle] = useState('');
  const [telegramLink, setTelegramLink] = useState('');

  // Sync inputs with settings model when retrieved
  useEffect(() => {
    if (settings) {
      setAdImage(settings.footerAdImage || '');
      setAdLink(settings.footerAdLink || '');
      setAdActive(settings.footerAdActive || false);
      setBackgroundType(settings.backgroundType || 'white');
      setCardStyle(settings.cardStyle || 'default');
      setBanner1(settings.banner1 || '');
      setBanner2(settings.banner2 || '');
      setBanner3(settings.banner3 || '');
      setBanner4(settings.banner4 || '');
      setFooterAdLogo(settings.footerAdLogo || '');
      setFooterAdName(settings.footerAdName || '');
      setFooterAdDesc(settings.footerAdDesc || '');
      setSiteDomain(settings.siteDomain || '');
      setHeaderLogo(settings.headerLogo || '');
      setHeaderTitle(settings.headerTitle || '');
      setHeaderSubtitle(settings.headerSubtitle || '');
      setTelegramLink(settings.telegramLink || '');
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...settings,
          footerAdImage: adImage.trim(),
          footerAdLink: adLink.trim(),
          footerAdActive: adActive,
          backgroundType: backgroundType,
          cardStyle: cardStyle,
          banner1: banner1.trim(),
          banner2: banner2.trim(),
          banner3: banner3.trim(),
          banner4: banner4.trim(),
          footerAdLogo: footerAdLogo.trim(),
          footerAdName: footerAdName.trim(),
          footerAdDesc: footerAdDesc.trim(),
          siteDomain: siteDomain.trim(),
          headerLogo: headerLogo.trim(),
          headerTitle: headerTitle.trim(),
          headerSubtitle: headerSubtitle.trim(),
          telegramLink: telegramLink.trim()
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        if (onRefreshSettings) onRefreshSettings();
      } else {
        const err = await res.json();
        setSaveError(err.message || 'Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      setSaveError('Network error. Failed to save settings.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 font-extrabold">
        Fetching site analytics logs...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 font-bold">
        <AlertCircle size={14} className="text-red-500" />
        <span>Failed to retrieve dashboard analytics. Database connection required.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-slate-800">
      
      {/* 1. Header controls */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-black text-slate-850 uppercase tracking-wide">
              {viewMode === 'metrics' ? 'Analytics Dashboard' : 'Site Configuration'}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 text-left">
              {viewMode === 'metrics' 
                ? 'Impressions, APK redirections, and CTR conversions' 
                : 'Manage headers, footers, carousels, themes, and domain configuration'}
            </p>
          </div>

          {viewMode === 'metrics' && onNavigateToManager && (
            <button
              onClick={onNavigateToManager}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-sm transition-all active:scale-98 cursor-pointer border-0"
            >
              <ListCollapse size={13} />
              Manage App Listings
            </button>
          )}
        </div>
      </div>

      {viewMode === 'metrics' ? (
        <>
          {/* 2. Quick stats metrics widgets grid */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Total Views Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between shadow-sm">
              <div className="space-y-1 text-left">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">PAGE VIEWS</span>
                <span className="text-xl font-black text-slate-800 block leading-none">{analytics.totalViews.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Total landing page loads</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-blue-700 shadow-sm shrink-0">
                <Eye size={18} />
              </div>
            </div>

            {/* Total Clicks Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between shadow-sm">
              <div className="space-y-1 text-left">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">APK DOWNLOAD CLICKS</span>
                <span className="text-xl font-black text-slate-800 block leading-none">{analytics.totalClicks.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Outbound redirection clicks</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-indigo-700 shadow-sm shrink-0">
                <MousePointerClick size={18} />
              </div>
            </div>

            {/* Average CTR Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between shadow-sm">
              <div className="space-y-1 text-left">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">CONVERSION RATE (CTR)</span>
                <span className="text-xl font-black text-emerald-700 block leading-none">{analytics.averageCtr}%</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Average conversion click ratios</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-emerald-700 shadow-sm shrink-0">
                <TrendingUp size={18} />
              </div>
            </div>
          </div>

          {/* 3. Performance Rankings Side by Side tables */}
          <div className="space-y-6">
            
            {/* Most Viewed Apps list */}
            <section className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-left">
                <BarChart3 size={15} className="text-blue-700" />
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-wide">
                  Top Visited Listings
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-extrabold">
                      <th className="py-2">APP NAME</th>
                      <th className="py-2 text-right">VIEWS</th>
                      <th className="py-2 text-right">CLICKS</th>
                      <th className="py-2 text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topAppsByViews.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 font-bold truncate max-w-[130px]">{item.name}</td>
                        <td className="py-2.5 text-right font-bold text-slate-800">{item.views.toLocaleString()}</td>
                        <td className="py-2.5 text-right text-slate-400 font-medium">{item.clicks.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-extrabold text-blue-700">{item.ctr}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Most Clicked Redirect apps */}
            <section className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-left">
                <Award size={15} className="text-indigo-700" />
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-wide">
                  Top Converting Campaigns
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-extrabold">
                      <th className="py-2">APP NAME</th>
                      <th className="py-2 text-right">CLICKS</th>
                      <th className="py-2 text-right">VIEWS</th>
                      <th className="py-2 text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topAppsByClicks.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 font-bold truncate max-w-[130px]">{item.name}</td>
                        <td className="py-2.5 text-right font-extrabold text-indigo-700">{item.clicks.toLocaleString()}</td>
                        <td className="py-2.5 text-right text-slate-400 font-medium">{item.views.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-bold text-slate-800">{item.ctr}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
          {/* Tabbed interface for settings */}
          <div className="flex border border-slate-200 bg-slate-100 p-1 rounded-xl gap-1">
            {([
              { id: 'header', label: 'Header & Nav' },
              { id: 'banners', label: 'Carousel Banners' },
              { id: 'footer', label: 'Footer Promo Ad' },
              { id: 'theme', label: 'Theme & Domain' }
            ] as const).map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSettingsTab(tab.id)}
                className={`flex-1 py-2 text-center text-[10.5px] font-extrabold uppercase rounded-lg transition-all cursor-pointer border-0 outline-none ${
                  settingsTab === tab.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-850 hover:bg-slate-200/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-left">
            {saveSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                ✓ Site configuration and theme settings saved successfully.
              </div>
            )}

            {saveError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold">
                ✗ {saveError}
              </div>
            )}

            {settingsTab === 'header' && (
              <section className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                  <Settings size={15} className="text-blue-700" />
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-wide">
                    Header & Navigation Configuration
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {/* Header Logo */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Header Logo URL</label>
                    <input
                      type="text"
                      value={headerLogo}
                      onChange={(e) => setHeaderLogo(e.target.value)}
                      placeholder="e.g., https://site.com/logo.png (leave blank for default ⚡ logo)"
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  {/* Header Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Header Heading Title</label>
                    <input
                      type="text"
                      value={headerTitle}
                      onChange={(e) => setHeaderTitle(e.target.value)}
                      placeholder="e.g., YONO HUB"
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-bold"
                    />
                  </div>

                  {/* Header Subtitle */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Header Subtitle Description</label>
                    <input
                      type="text"
                      value={headerSubtitle}
                      onChange={(e) => setHeaderSubtitle(e.target.value)}
                      placeholder="e.g., Verified APK Lobbies"
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  {/* Telegram Channel Link */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Join Telegram Channel Link</label>
                    <input
                      type="text"
                      value={telegramLink}
                      onChange={(e) => setTelegramLink(e.target.value)}
                      placeholder="e.g., https://telegram.me/aaron7512"
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                </div>
              </section>
            )}

            {settingsTab === 'banners' && (
              <section className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                  <Settings size={15} className="text-blue-700" />
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-wide">
                    Homepage Carousel Banners (4 Rotating Slides)
                  </h2>
                </div>

                <div className="space-y-4 text-left">
                  {([
                    { id: 1, label: 'Slide Banner 1', val: banner1, set: setBanner1 },
                    { id: 2, label: 'Slide Banner 2', val: banner2, set: setBanner2 },
                    { id: 3, label: 'Slide Banner 3', val: banner3, set: setBanner3 },
                    { id: 4, label: 'Slide Banner 4', val: banner4, set: setBanner4 }
                  ]).map(b => (
                    <div key={b.id} className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block">{b.label} Image URL</label>
                      <input
                        type="text"
                        value={b.val}
                        onChange={(e) => b.set(e.target.value)}
                        placeholder="e.g., https://site.com/banners/banner1.png"
                        className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {settingsTab === 'footer' && (
              <section className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                  <Settings size={15} className="text-blue-700" />
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-wide">
                    Footer Promo Advertisement Card
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {/* Ad Logo URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">App Logo URL</label>
                    <input
                      type="text"
                      value={footerAdLogo}
                      onChange={(e) => setFooterAdLogo(e.target.value)}
                      placeholder="e.g., https://site.com/ad-logo.png"
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  {/* Ad App Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">App Name</label>
                    <input
                      type="text"
                      value={footerAdName}
                      onChange={(e) => setFooterAdName(e.target.value)}
                      placeholder="e.g., Rummy Ultra Premium"
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-bold"
                    />
                  </div>

                  {/* Ad Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Description</label>
                    <textarea
                      value={footerAdDesc}
                      onChange={(e) => setFooterAdDesc(e.target.value)}
                      placeholder="e.g., Play the best skill Rummy variant game. Safe, instant payments and Rs. 51 bonus."
                      rows={2}
                      className="w-full p-2.5 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  {/* Ad Redirect URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Redirect/Download URL</label>
                    <input
                      type="text"
                      value={adLink}
                      onChange={(e) => setAdLink(e.target.value)}
                      placeholder="e.g., https://telegram.me/aaron7512"
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-800 outline-none focus:border-blue-500 font-bold"
                    />
                  </div>

                  {/* Active Checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="footerAdActive"
                      checked={adActive}
                      onChange={(e) => setAdActive(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                    <label htmlFor="footerAdActive" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                      Enable Footer Promo Ad Card on Landing Page
                    </label>
                  </div>
                </div>
              </section>
            )}

            {settingsTab === 'theme' && (
              <section className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                  <Settings size={15} className="text-blue-700" />
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-wide">
                    Theme & Domain Configuration
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {/* Container Background Theme */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block font-header">Container Background Theme</label>
                    <select
                      value={backgroundType}
                      onChange={(e) => setBackgroundType(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="white">Classic White (Default)</option>
                      <option value="money-rain">Money Rain (Rupees & Dollars) 💵</option>
                      <option value="royal-gold">Royal Gold (Luxury Sparkles) ✨</option>
                      <option value="dark-luxury-coin">Dark Luxury Coin (Midnight & Gold Coins) 🪙</option>
                      <option value="card-suit-green">Casino Felt (Green Felt & Card Suits) ♠</option>
                    </select>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Choose the background animation layout rendered inside the client viewport container.</p>
                  </div>

                  {/* Card Style Theme */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block font-header">App Listing Card Style Theme</label>
                    <select
                      value={cardStyle}
                      onChange={(e) => setCardStyle(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="default">Default Clean Card</option>
                      <option value="dynamic-border">Dynamic Rainbow Border 🌈</option>
                      <option value="flaming-border">Flaming Orange Pulse 🔥</option>
                      <option value="liquid-glass">Liquid Frosted Glass Shine 🥛</option>
                      <option value="spotlight-hover">Interactive Cursor Spotlight 🔦</option>
                      <option value="shine-sweep">Shine Sweep (Fast Glare) 🌟</option>
                      <option value="shine-sweep-medium">Shine Sweep (Medium Glare) ✨</option>
                      <option value="expand-on-hover">Expand and Scale Height 🚀</option>
                    </select>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Choose the visual style and hover effects applied to normal App Listing Cards.</p>
                  </div>

                  {/* Website Domain (for Canonical, JSON-LD, and Sitemaps) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block font-header">Website Domain URL</label>
                    <input
                      type="text"
                      value={siteDomain}
                      onChange={(e) => setSiteDomain(e.target.value)}
                      placeholder="e.g., https://yononewgamess.com"
                      className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-850 outline-none focus:border-blue-500 font-bold"
                    />
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Define the primary website domain. Saving this generates a new sitemap XML dynamically.</p>
                  </div>
                </div>
              </section>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[12px] cursor-pointer shadow-md transition-all active:scale-[0.99] border-0"
              >
                Save {settingsTab === 'header' ? 'Header & Nav' : settingsTab === 'banners' ? 'Banner' : settingsTab === 'footer' ? 'Footer Promo' : 'Theme & Domain'} Settings
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
export default Dashboard;
