"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppDetail } from '../types';

interface StickyCtaProps {
  topApp: AppDetail | null;
}

export const StickyCta: React.FC<StickyCtaProps> = ({ topApp }) => {
  const pathname = usePathname();
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setShowStickyCta(false);
      return;
    }

    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (!showStickyCta || !topApp || pathname !== '/') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-white/10 px-3.5 py-2.5 shadow-2xl">
      <div className="max-w-[480px] lg:max-w-[1200px] mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src={topApp.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0 bg-white" />
          <div className="text-left min-w-0">
            <strong className="text-xs text-white block truncate max-w-[130px] font-black">{topApp.name}</strong>
            <span className="text-[10px] text-emerald-400 block font-bold">{topApp.bonus} Sign Up Reward</span>
          </div>
        </div>
        <a
          href={`/go/${topApp.slug}`}
          target="_blank"
          rel="noreferrer noopener nofollow"
          className="px-4 py-2.5 rounded-xl btn-download-green text-white font-extrabold text-[11px] shrink-0 cursor-pointer shadow-md no-underline"
        >
          ⬇️ Download APK
        </a>
      </div>
    </div>
  );
};
export default StickyCta;
