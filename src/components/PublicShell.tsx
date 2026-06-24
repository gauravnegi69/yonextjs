import React from 'react';
import { db } from '../lib/db';
import { Header } from './Header';
import { AnimatedBackground } from './AnimatedBackground';
import { StickyCta } from './StickyCta';
import { CompareDeck } from './CompareDeck';
import { PageTransition } from './PageTransition';
import { ShieldCheck } from 'lucide-react';

interface PublicShellProps {
  children: React.ReactNode;
}

export default async function PublicShell({ children }: PublicShellProps) {
  const [settings, apps] = await Promise.all([
    db.settings.get(),
    db.apps.find()
  ]);

  const cleanSettings = JSON.parse(JSON.stringify(settings));
  const cleanApps = JSON.parse(JSON.stringify(apps));

  const activeApps = cleanApps.filter((a: any) => a.status === 'active');
  const topApp = activeApps[0] || null;

  const isDarkBg = cleanSettings?.backgroundType === 'dark-luxury-coin' || cleanSettings?.backgroundType === 'card-suit-green';

  return (
    <div className="min-h-screen bg-[#ebebeb] flex items-start justify-center w-full">
      <div className={`mobile-container min-h-screen flex flex-col justify-between relative pb-16 w-full max-w-[480px] lg:max-w-[1200px] shadow-xl transition-all duration-300 ${isDarkBg ? 'theme-dark-bg text-slate-100' : 'text-slate-800'
        }`}>

        {/* Falling rupees / luxury coin floating effects */}
        <AnimatedBackground backgroundType={cleanSettings?.backgroundType} />

        {/* Global navigation top header */}
        <Header settings={cleanSettings} />

        {/* Dynamic page content wrapper */}
        <main className="flex-1 p-4 lg:p-8 w-full relative z-10 overflow-x-hidden">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* Public footer section (sponsored promo cards + responsible warning) */}
        {cleanSettings && (
          <div className="px-4 pb-4 space-y-4 relative z-10">
            {/* Sponsored Promo Banner */}
            {cleanSettings.footerAdActive && (
              <section className="border border-slate-200 bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-3.5 flex items-center justify-between gap-3 relative overflow-hidden text-left">
                {/* Gold/emerald light glow */}
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={cleanSettings.footerAdLogo || '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner1.jpg'}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0 shadow-xs"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-black uppercase tracking-wider inline-block">
                      SPONSORED AD
                    </span>
                    <h4 className="text-xs font-black text-slate-800 truncate">
                      {cleanSettings.footerAdName || 'Elite Skill App'}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 leading-tight font-semibold line-clamp-2">
                      {cleanSettings.footerAdDesc || 'Get the ultimate rummy and skill gaming experience now.'}
                    </p>
                  </div>
                </div>

                <a
                  href={cleanSettings.footerAdLink || '#'}
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                  className="px-3.5 py-2 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-750 text-white font-black text-[10.5px] flex items-center justify-center gap-1 shrink-0 shadow-md active:scale-95 transition-all no-underline"
                >
                  📲 GET
                </a>
              </section>
            )}

            {/* Warning footer */}
            <footer className="pt-2">
              <div className="bg-[#003a92]/10 border border-[#003a92]/20 rounded-xl p-4 text-center space-y-2">
                <h4 className="text-[#003a92] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck size={13} />
                  Play Responsibly
                </h4>
                <p className="text-[10.5px] text-slate-550 font-semibold leading-relaxed">
                  Skill gaming platforms involve financial risk and can be addictive. Must be at least 18 years old. Users from Andhra Pradesh, Assam, Odisha, Nagaland, Sikkim, Tamil Nadu and Telangana are requested to keep distance from cash lobbies.
                </p>
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-widest pt-1">
                  {cleanSettings.footerText || '© 2026 Yono Hub'}
                </span>
              </div>
            </footer>
          </div>
        )}

        {/* Sticky bottom CTA banner */}
        <StickyCta topApp={topApp} />

        {/* Compare matrix deck tray */}
        <CompareDeck />

      </div>
    </div>
  );
}
