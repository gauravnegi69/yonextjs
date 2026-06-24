"use client";

import React, { useState, useEffect } from 'react';
import { AppCard } from './AppCard';
import { SearchBar } from './SearchBar';
import { AppDetail, Category, Collection, SiteSettings } from '../types';
import { Flame, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  apps: AppDetail[];
  categories: Category[];
  collections: Collection[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  onSelectApp?: (app: AppDetail) => void;
  settings: SiteSettings | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  apps,
  categories,
  collections,
  selectedCategory,
  setSelectedCategory,
  onSelectApp,
  settings
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'trending' | 'new' | 'all'>('trending');
  const [newPicksIndex, setNewPicksIndex] = useState(2); // Center active card

  const bannerSlides = [
    settings?.banner1 || '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner1.jpg',
    settings?.banner2 || '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner2.jpg',
    settings?.banner3 || '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner3.jpg',
    settings?.banner4 || '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner4.jpg'
  ];

  // Rotate hero banners
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const activeApps = apps.filter(a => a.status === 'active');

  // Filter apps based on active sub tab
  const getDisplayedApps = () => {
    let list = activeApps.filter(a => a.isAllApps !== false);

    // Apply Category filtering if set
    if (selectedCategory) {
      list = list.filter(a => {
        const cats = a.categories && a.categories.length > 0 ? a.categories : [a.category];
        return cats.some(c => c.toLowerCase() === selectedCategory.toLowerCase());
      });
    }

    if (activeSubTab === 'trending') {
      // Sort by priority/rank
      return list.sort((a, b) => b.priority - a.priority);
    } else if (activeSubTab === 'new') {
      // Filter new launches or similar tag-based rows
      return list.filter(a => a.tags.includes('New Launch') || a.tags.includes('Top Rated')).slice(0, 15);
    }
    return list; // All Apps
  };

  const displayedList = getDisplayedApps();

  // Top 3 Podium apps
  const flaggedRecommended = activeApps.filter(a => a.isRecommended === true);
  const topPodiumApps = flaggedRecommended.length >= 3
    ? flaggedRecommended.slice(0, 3)
    : activeApps.slice(0, 3);

  // Top 5 apps for "New Picks" slider
  const flaggedNewPicks = activeApps.filter(a => a.isNewPick === true);
  let newPicksApps = flaggedNewPicks;
  if (newPicksApps.length < 5) {
    const additional = activeApps.filter(a => !newPicksApps.some(f => f.slug === a.slug));
    newPicksApps = [...newPicksApps, ...additional].slice(0, 5);
  }

  const [isNewPicksHovered, setIsNewPicksHovered] = useState(false);

  // Auto-slide New Picks: initial slide after 300ms on load/mount, then every 2 seconds from left to right
  useEffect(() => {
    if (isNewPicksHovered || newPicksApps.length === 0) return;

    let intervalId: NodeJS.Timeout;

    // Trigger the very first slide shortly after load (300ms) to show motion instantly
    const initialTimeoutId = setTimeout(() => {
      setNewPicksIndex(prev => (prev > 0 ? prev - 1 : newPicksApps.length - 1));

      // After the initial slide, start the regular 2-second interval
      intervalId = setInterval(() => {
        setNewPicksIndex(prev => (prev > 0 ? prev - 1 : newPicksApps.length - 1));
      }, 2000);
    }, 300);

    return () => {
      clearTimeout(initialTimeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isNewPicksHovered, newPicksApps.length]);

  return (
    <div className="space-y-6 pb-12">

      {/* 1. Hero Auto Banner Slider */}
      <section className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[430/230] lg:aspect-auto lg:h-[350px] w-full shadow-sm">
        {bannerSlides.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="Hero Banner Offer"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === slideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          />
        ))}
      </section>

      {/* 2. Global Search Box */}
      <section className="px-0.5">
        <SearchBar onSelectApp={onSelectApp} apps={activeApps} />
      </section>

      {/* 3. Scrolling Notice Ticker (Marquee Alert) */}
      <div className="ticker-wrap rounded-lg shadow-sm border border-red-100">
        <span className="ticker-label">सूचना</span>
        <div className="ticker-marquee">
          {/* @ts-ignore */}
          <marquee behavior="scroll" direction="left" scrollamount="5" className="text-red-750 font-extrabold text-[11px]">
            आवश्यक सूचना : Yono Hub पर उपस्थित सभी ऐप या गेम दूसरे कंपनी के है, कोई भी एप हमारे द्वारा संचालित नही होता है। ऐप या गेम संबंधित समस्या का समाधान गेम या ऐप कंपनी के पास है, कृपया कोई भी समस्या आने पर गेम या ऐप कंपनी से संपर्क करे। और अपने जिम्मेदारी से गेम खेले। 18+ Users Only.....
            {/* @ts-ignore */}
          </marquee>
        </div>
      </div>

      {/* 4. Top 3 Apps Podium display */}
      {topPodiumApps.length >= 3 && (
        <section className="p-3.5 rounded-2xl border border-amber-100 bg-amber-50/15 shadow-sm space-y-3 relative pt-4 pb-2">
          {/* Soft gold radial glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 uppercase px-0.5 relative z-10 animate-pulse">
            <Flame size={14} className="text-amber-500 fill-amber-500 shrink-0" />
            <span>🔥 Recommended Top Picks 🔥</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 relative z-10 pt-2 pb-1">
            {/* Rank 2 (left) */}
            <AppCard app={topPodiumApps[1]} variant="featured" rank={2} onSelect={onSelectApp} cardStyle={settings?.cardStyle || 'default'} />
            {/* Rank 1 (center) */}
            <AppCard app={topPodiumApps[0]} variant="featured" rank={1} onSelect={onSelectApp} cardStyle={settings?.cardStyle || 'default'} />
            {/* Rank 3 (right) */}
            <AppCard app={topPodiumApps[2]} variant="featured" rank={3} onSelect={onSelectApp} cardStyle={settings?.cardStyle || 'default'} />
          </div>
        </section>
      )}

      {/* 4.5 New Picks Horizontal 3D Slider */}
      {newPicksApps.length >= 5 && (
        <section
          onMouseEnter={() => setIsNewPicksHovered(true)}
          onMouseLeave={() => setIsNewPicksHovered(false)}
          className="p-3.5 rounded-2xl border border-blue-100 bg-blue-50/10 shadow-sm space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 text-xs font-black text-blue-700 uppercase px-0.5 animate-pulse">
            <Sparkles size={14} className="text-blue-600 animate-spin shrink-0" />
            <span>🌟 New Picks 🌟</span>
          </div>

          {/* Carousel Swiper Track (Auto-sliding, No arrow controllers) */}
          <div className="flex items-center justify-center py-3 w-full select-none relative h-48 overflow-hidden">
            {newPicksApps.map((app, idx) => {
              let offset = idx - newPicksIndex;
              // Circular wrap math
              const half = Math.floor(newPicksApps.length / 2);
              if (offset < -half) offset += newPicksApps.length;
              if (offset > half) offset -= newPicksApps.length;

              const isActive = offset === 0;
              const isSide = Math.abs(offset) === 1;

              return (
                <div
                  key={app.slug}
                  onClick={() => setNewPicksIndex(idx)}
                  className={`absolute cursor-pointer select-none text-center p-3 rounded-2xl bg-white border ${isActive
                      ? 'z-20 border-blue-500 shadow-[0_12px_28px_rgba(37,99,235,0.22)] opacity-100'
                      : isSide
                        ? 'z-10 border-slate-200 shadow-sm opacity-40'
                        : 'z-0 opacity-0 pointer-events-none'
                    }`}
                  style={{
                    transform: `translateX(${offset * 124}px) scale(${isActive ? 1.28 : 0.85})`,
                    width: '110px',
                    transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms ease, box-shadow 500ms ease, border-color 500ms ease'
                  }}
                >
                  <img
                    src={app.logo}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover mx-auto border border-slate-200 bg-white shadow-xs"
                  />
                  <h4 className="text-[10px] font-black text-slate-800 mt-2 truncate w-full">
                    {app.name}
                  </h4>
                  <span className="text-[9.5px] text-emerald-700 font-extrabold block mt-0.5">
                    {app.bonus}
                  </span>

                  <a
                    href={`/go/${app.slug}`}
                    target="_blank"
                    rel="noreferrer noopener nofollow"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 py-1.5 px-2 rounded-xl bg-red-600 hover:bg-red-750 text-white font-extrabold text-[9.5px] block shadow-md text-center transition-all active:scale-95 no-underline"
                  >
                    📲 Get
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section Title Strip */}
      <div className="bg-[#b91c1c] text-white border-2 border-white text-center font-black text-xs py-2 uppercase tracking-wide rounded-sm shadow-sm select-none">
        🔥 Top Rummy Bonus Apps in India 🔥
      </div>

      {/* 5. Sub Navigation tab selectors */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1 px-1">
          <div className="flex gap-4">
            {[
              { id: 'trending', label: 'Top Trending' },
              { id: 'new', label: 'New Launch' },
              { id: 'all', label: 'All Apps' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`pb-2 text-xs font-extrabold uppercase tracking-wide transition-all border-b-2 cursor-pointer bg-transparent border-t-0 border-x-0 outline-none ${activeSubTab === tab.id
                    ? 'border-[#b91c1c] text-[#b91c1c]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-extrabold hover:bg-slate-200 cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Categories Chips filters */}
        <div className="flex flex-wrap gap-2 py-1 px-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                className={`text-[10px] px-3 py-1.5 rounded-full border font-extrabold transition-all cursor-pointer ${isSelected
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* 6. Grid List listings row cards */}
        {displayedList.length > 0 ? (
          <motion.div
            key={`${activeSubTab}-${selectedCategory || 'all'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:border-none md:shadow-none bg-transparent divide-y divide-slate-100 md:divide-y-0 border border-slate-200 rounded-xl overflow-hidden shadow-sm"
          >
            {displayedList.map((app, idx) => (
              <div key={app.slug} className="bg-white md:border md:border-slate-200 md:rounded-2xl md:shadow-xs overflow-hidden">
                <AppCard
                  app={app}
                  variant="medium"
                  rank={activeSubTab === 'trending' ? idx + 1 : undefined}
                  onSelect={onSelectApp}
                  cardStyle={settings?.cardStyle || 'default'}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-500">No applications matched filters.</span>
          </div>
        )}
      </section>

      {/* 7. Player Reviews block */}
      <section className="space-y-3 pt-3 border-t border-slate-200">
        <div className="text-center">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Player Testimonials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: "Rahul S. (Delhi)", text: "Super fast cash withdrawals. Rummy Ultra paid within 5 minutes directly to my bank UPI account. Highly recommend Yono Hub!", stars: 5 },
            { name: "Amit K. (Mumbai)", text: "Verified downloads. No spam pages or redirects. Standard and working direct links for all Teen Patti card games.", stars: 5 }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      fill="currentColor"
                      className="stroke-amber-500 fill-amber-500 transition-all duration-300 hover:scale-135 hover:rotate-[12deg] cursor-pointer"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-1.5">"{item.text}"</p>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 block mt-2">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter promo */}
      <section className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2.5">
        <h3 className="text-sm font-black text-slate-800">Subscribe to get APK promo codes</h3>
        <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
          We send verified signup bonus promo codes and details about new Rummy card apps launches weekly.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); alert("Thanks!"); }} className="flex gap-2 max-w-xs mx-auto pt-1">
          <input
            type="email"
            required
            placeholder="Your email address"
            className="flex-1 h-8 px-3 rounded-lg text-[10px] outline-none bg-white border border-slate-300 text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            className="h-8 px-4 rounded-lg bg-slate-800 text-white hover:bg-slate-900 font-extrabold text-[10px] active:scale-95 transition-all cursor-pointer border-0"
          >
            Join
          </button>
        </form>
      </section>

    </div>
  );
};
export default LandingPage;
