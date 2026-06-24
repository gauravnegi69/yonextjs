"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Award } from 'lucide-react';
import { AppDetail } from '../types';

interface AppCardProps {
  app: AppDetail;
  variant?: 'compact' | 'medium' | 'featured' | 'horizontal' | 'mobile';
  rank?: number;
  onSelect?: (app: AppDetail) => void;
  cardStyle?: string;
}

export const AppCard: React.FC<AppCardProps> = ({ app, variant = 'medium', rank, onSelect, cardStyle = 'default' }) => {
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (cardStyle === 'spotlight-hover') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSpotlightStyle({
        background: `radial-gradient(130px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardStyle === 'spotlight-hover') {
      setSpotlightStyle({});
    }
  };

  // -------------------------------------------------------------
  // VARIANT 1: COMPACT CARD (Sidebar / Small lists)
  // -------------------------------------------------------------
  if (variant === 'compact') {
    return (
      <Link
        href={`/app/${app.slug}`}
        onClick={(e) => {
          if (onSelect) {
            e.preventDefault();
            onSelect(app);
          }
        }}
        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer transition-all duration-200 text-inherit no-underline"
      >
        <img
          src={app.logo}
          alt={`${app.name} Icon`}
          loading="lazy"
          className="w-9 h-9 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
        />
        <div className="flex-1 min-w-0 font-sans text-left">
          <h4 className="text-xs font-extrabold text-slate-800 truncate">{app.name}</h4>
          <span className="text-[10px] text-emerald-600 font-bold block">{app.bonus} Bonus</span>
        </div>
        <span
          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shrink-0 font-extrabold text-[10px] cursor-pointer"
        >
          📲 Get
        </span>
      </Link>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 2: FEATURED CARD (Crown Podium Style - Top Ranks 1, 2, 3)
  // -------------------------------------------------------------
  if (variant === 'featured') {
    const isRank1 = rank === 1;
    const isRank2 = rank === 2;

    return (
      <Link
        href={`/app/${app.slug}`}
        onClick={(e) => {
          if (onSelect) {
            e.preventDefault();
            onSelect(app);
          }
        }}
        className={`relative flex flex-col items-center text-center p-3.5 rounded-2xl cursor-pointer transition-all duration-300 bg-white text-inherit no-underline ${
          isRank1 
            ? 'podium-rank-1 scale-105 -translate-y-1 z-10 border-2 border-amber-400 shadow-[0_8px_24px_rgba(251,191,36,0.15)] hover:scale-108 hover:-translate-y-1.5' 
            : isRank2 
            ? 'podium-rank-2 border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md' 
            : 'podium-rank-3 border border-orange-200 shadow-sm hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        {/* Crown Badge */}
        {rank !== undefined && rank <= 3 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center z-10 select-none">
            <span className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-full shadow-sm text-white flex items-center gap-0.5 whitespace-nowrap uppercase tracking-wide ${
              isRank1 ? 'bg-amber-500' : isRank2 ? 'bg-slate-400' : 'bg-amber-700'
            }`}>
              {isRank1 ? '👑 RANK 1' : isRank2 ? '🥈 RANK 2' : '🥉 RANK 3'}
            </span>
          </div>
        )}

        {/* Featured Tag */}
        {app.featured && (
          <span className="absolute -top-3 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-[7.5px] font-black text-red-600 select-none">
            <Award size={8} />
            HOT
          </span>
        )}

        {/* Icon */}
        <img
          src={app.logo}
          alt={`${app.name} Premium Logo`}
          loading="lazy"
          className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shadow-sm mt-1.5 shrink-0"
        />

        {/* Details */}
        <h3 className="text-xs font-black text-slate-800 mt-2 truncate w-full font-sans text-center">
          {app.name}
        </h3>

        {/* Responsive Interactive Star rating icons */}
        <div className="flex items-center gap-0.5 text-amber-500 my-1 justify-center shrink-0 star-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={11} 
              fill="currentColor" 
              className="stroke-amber-500 fill-amber-500 transition-all duration-300 hover:scale-140 hover:rotate-[15deg] hover:text-amber-400 hover:fill-amber-450 cursor-pointer" 
            />
          ))}
        </div>

        {/* Safe text */}
        <p className="text-[9px] text-emerald-600 flex items-center gap-0.5 mt-0.5 font-bold justify-center shrink-0 select-none">
          <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
          <span>100% Safe</span>
        </p>

        {/* Action triggers */}
        <div className="w-full flex flex-col gap-1.5 mt-3 shrink-0">
          <span
            className="w-full py-2.5 rounded-xl text-center text-[11px] font-black flex items-center justify-center gap-1 cursor-pointer transition-all duration-200 bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.25)] hover:bg-red-750 hover:shadow-[0_6px_16px_rgba(220,38,38,0.35)] active:scale-[0.97]"
          >
            <span>📲</span> Download
          </span>
        </div>
      </Link>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 3: DEFAULT MEDIUM/ROW CARD (Matches .list .row)
  // -------------------------------------------------------------
  
  // Custom classes for row cards based on cardStyle (compact py-2 padding for mobile)
  let cardClass = "flex items-center gap-3 py-2 px-2.5 rounded-xl transition-all cursor-pointer border-b border-slate-100 last:border-b-0 bg-white relative";

  if (cardStyle === 'dynamic-border') {
    cardClass = "flex items-center gap-3 py-2 px-2.5 rounded-xl transition-all cursor-pointer bg-white relative card-dynamic-border shadow-sm my-1.5";
  } else if (cardStyle === 'flaming-border') {
    cardClass = "flex items-center gap-3 py-2 px-2.5 rounded-xl transition-all cursor-pointer bg-white relative card-flaming-border my-1.5";
  } else if (cardStyle === 'liquid-glass') {
    cardClass = "flex items-center gap-3 py-2 px-2.5 rounded-xl transition-all cursor-pointer relative card-liquid-glass my-1.5";
  } else if (cardStyle === 'expand-on-hover') {
    cardClass = "flex items-center gap-3 py-2 px-2.5 rounded-xl transition-all duration-300 cursor-pointer bg-white relative border border-slate-150 hover:scale-[1.02] hover:py-2.5 hover:shadow-md hover:z-10 my-1.5";
  } else if (cardStyle === 'shine-sweep') {
    cardClass = "flex items-center gap-3 py-2 px-2.5 rounded-xl transition-all cursor-pointer bg-white relative card-shine-sweep shadow-xs my-1.5 hover:scale-[1.01] hover:shadow-sm";
  } else if (cardStyle === 'shine-sweep-medium') {
    cardClass = "flex items-center gap-3 py-2 px-2.5 rounded-xl transition-all cursor-pointer bg-white relative card-shine-sweep-medium shadow-xs my-1.5 hover:scale-[1.01] hover:shadow-sm";
  } else {
    // default
    cardClass = "flex items-center gap-3 py-2 px-2.5 hover:bg-slate-50/70 rounded-xl transition-all cursor-pointer border-b border-slate-100 last:border-b-0 bg-white relative";
  }

  return (
    <Link
      href={`/app/${app.slug}`}
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect(app);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${cardClass} text-inherit no-underline`}
    >
      {/* Spotlight Hover Glow Overlay */}
      {cardStyle === 'spotlight-hover' && (
        <div className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300 z-0" style={spotlightStyle} />
      )}

      {/* Liquid Glass Shine Reflection layer */}
      {cardStyle === 'liquid-glass' && <div className="shimmer-layer" />}

      {/* Shine Sweep Reflection layer */}
      {cardStyle === 'shine-sweep' && <div className="shimmer-shine" />}

      {/* Shine Sweep Medium Reflection layer */}
      {cardStyle === 'shine-sweep-medium' && <div className="shimmer-shine-medium" />}

      {/* Rank indicator */}
      {rank !== undefined && (
        <div className="w-5 text-center font-bold text-sm text-slate-400 relative z-10">
          {rank}
        </div>
      )}

      {/* App Logo (48px size for mobile efficiency) */}
      <div className="shrink-0 relative z-10">
        <img
          src={app.logo}
          alt={`${app.name} Icon`}
          loading="lazy"
          className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shadow-sm"
        />
      </div>

      {/* Meta description details */}
      <div className="flex-1 min-w-0 relative z-10 font-sans text-left">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-black text-slate-800 truncate">
            {app.name}
          </h3>
          {app.featured && <Award size={12} className="text-amber-500 shrink-0 animate-pulse" />}
        </div>
        
        <p className="text-[11px] text-slate-500 mt-0.5 truncate font-bold">
          ⬇ {app.installs} | Bonus {app.bonus}
        </p>
        
        <p className="text-[11px] font-black text-emerald-700 mt-0.5">
          Min. Withdrawal {app.minWithdrawal}
        </p>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-2 shrink-0 relative z-10">
        <span
          className="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all duration-200 bg-[#dc2626] text-white shadow-[0_4px_12px_rgba(220,38,32,0.22)] hover:bg-[#b91c1c] hover:shadow-[0_6px_16px_rgba(220,38,32,0.32)] active:scale-[0.97]"
        >
          <span>📲</span> Download
        </span>
      </div>
    </Link>
  );
};

export default AppCard;
