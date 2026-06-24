"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Send } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  settings: SiteSettings | null;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const pathname = usePathname();

  const getHeaderStyles = (bgType?: string) => {
    switch (bgType) {
      case 'money-rain':
        return {
          topBar: 'bg-[#065f46]/90 text-white border-b border-emerald-950/20',
          nav: 'bg-white/95 border-b border-emerald-100 text-emerald-900/80',
          tabActive: 'text-emerald-700 bg-emerald-50/70 border-b-2 border-emerald-600 font-extrabold',
          tabInactive: 'text-slate-500 hover:bg-emerald-50/30 hover:text-emerald-900',
          tabBorder: 'border-r border-emerald-50/50',
          brandGlow: 'from-amber-400 to-emerald-300 text-emerald-950 shadow-emerald-500/10',
          telegramBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white border-white/20'
        };
      case 'royal-gold':
        return {
          topBar: 'bg-gradient-to-r from-amber-700 to-amber-600 text-white border-b border-amber-800/10',
          nav: 'bg-[#fffbeb]/95 border-b border-amber-200/50 text-amber-950/80',
          tabActive: 'text-amber-800 bg-amber-50/60 border-b-2 border-amber-600 font-extrabold',
          tabInactive: 'text-slate-500 hover:bg-amber-100/30 hover:text-amber-900',
          tabBorder: 'border-r border-amber-100/40',
          brandGlow: 'from-amber-400 to-amber-300 text-slate-950 shadow-amber-500/10',
          telegramBtn: 'bg-amber-800 hover:bg-amber-750 text-white border-white/20'
        };
      case 'dark-luxury-coin':
        return {
          topBar: 'bg-[#001f54]/90 text-white border-b border-white/5',
          nav: 'bg-[#0a0f24]/90 border-b border-slate-900 text-slate-450',
          tabActive: 'text-cyan-400 bg-white/5 border-b-2 border-cyan-400 font-extrabold',
          tabInactive: 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
          tabBorder: 'border-r border-slate-950/55',
          brandGlow: 'from-cyan-400 to-blue-500 text-slate-950 shadow-cyan-500/10',
          telegramBtn: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-cyan-400/20'
        };
      case 'card-suit-green':
        return {
          topBar: 'bg-[#022c22]/90 text-white border-b border-white/5',
          nav: 'bg-[#064e3b]/90 border-b border-emerald-950/50 text-emerald-100/80',
          tabActive: 'text-amber-400 bg-white/5 border-b-2 border-amber-400 font-extrabold',
          tabInactive: 'text-emerald-200/60 hover:bg-white/5 hover:text-white',
          tabBorder: 'border-r border-emerald-950/40',
          brandGlow: 'from-amber-400 to-yellow-300 text-slate-950 shadow-amber-500/10',
          telegramBtn: 'bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white border-amber-400/20'
        };
      default: // 'white' or default
        return {
          topBar: 'bg-gradient-to-r from-[#003a92] to-[#0054cc]/95 text-white border-b border-blue-900/10',
          nav: 'bg-white border-b border-slate-200 text-slate-500',
          tabActive: 'text-[#b91c1c] bg-slate-50/50 border-b-2 border-[#b91c1c] font-extrabold',
          tabInactive: 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800',
          tabBorder: 'border-r border-slate-100',
          brandGlow: 'from-amber-400 to-amber-300 text-slate-950 shadow-blue-500/10',
          telegramBtn: 'bg-[#16a34a] hover:bg-[#15803d] text-white border-white/10'
        };
    }
  };

  const hStyles = getHeaderStyles(settings?.backgroundType);

  const tabs = [
    { href: '/', label: 'Home', minWidth: '65px' },
    { href: '/all-yonoapps', label: 'All Yono Apps', minWidth: '120px' },
    { href: '/about-us', label: 'About Us', minWidth: '85px' },
    { href: '/contact-us', label: 'Contact Us', minWidth: '95px' },
    { href: '/privacy-policy', label: 'Privacy Policy', minWidth: '120px' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full select-none shadow-md backdrop-blur-md">
      {/* Top Bar */}
      <div className={`px-3.5 py-2.5 flex items-center justify-between transition-all duration-300 ${hStyles.topBar}`}>
        <Link href="/" className="flex items-center gap-2 cursor-pointer group no-underline text-inherit">
          {settings?.headerLogo ? (
            <img
              src={settings.headerLogo}
              alt={settings.headerTitle || "Logo"}
              className="w-8 h-8 rounded-lg object-cover bg-white border border-white/20 shadow"
            />
          ) : (
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${hStyles.brandGlow} flex items-center justify-center font-black text-base shadow transition-all duration-300 group-hover:scale-105 active:scale-95`}>
              ⚡
            </div>
          )}
          <div className="text-left">
            <strong className="text-xs font-black tracking-wide block leading-none font-header">
              {settings?.headerTitle || 'YONO HUB'}
            </strong>
            <span className="text-[9px] opacity-90 font-bold uppercase tracking-wider block mt-0.5">
              {settings?.headerSubtitle || 'Verified APK Lobbies'}
            </span>
          </div>
        </Link>

        <a
          href={settings?.telegramLink || 'https://telegram.me/aaron7512'}
          target="_blank"
          rel="noreferrer noopener nofollow"
          className={`inline-flex items-center gap-1 border text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full active:scale-95 transition-all shadow-md no-underline ${hStyles.telegramBtn}`}
        >
          <Send size={11} />
          Join Telegram
        </a>
      </div>

      {/* Scrollable Sub-Navigation tabs */}
      <nav className={`flex overflow-x-auto whitespace-nowrap scrollbar-none text-[10.5px] uppercase transition-all duration-300 ${hStyles.nav}`}>
        {tabs.map((tab, idx) => {
          const isActive = pathname === tab.href;
          const isLast = idx === tabs.length - 1;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{ minWidth: tab.minWidth }}
              className={`flex-1 py-3.5 px-3 transition-all flex items-center justify-center gap-1 no-underline ${
                !isLast ? hStyles.tabBorder : ''
              } ${isActive ? hStyles.tabActive : hStyles.tabInactive}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
export default Header;
