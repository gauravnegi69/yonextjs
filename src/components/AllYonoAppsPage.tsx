"use client";

import React, { useState } from 'react';
import { AppDetail, Category } from '../types';
import { AppCard } from './AppCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface AllYonoAppsPageProps {
  apps: AppDetail[];
  categories: Category[];
  onSelectApp?: (app: AppDetail) => void;
  cardStyle?: string;
}

export const AllYonoAppsPage: React.FC<AllYonoAppsPageProps> = ({
  apps,
  categories,
  onSelectApp,
  cardStyle = 'default'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'name' | 'bonus'>('priority');

  const activeApps = apps.filter(a => a.status === 'active');

  // Filter and sort apps
  const getFilteredApps = () => {
    let list = [...activeApps];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    // Category filter
    if (selectedCategory) {
      list = list.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Sorting
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'bonus') {
      list.sort((a, b) => {
        const getNum = (str: string) => parseInt(str.replace(/[^0-9]/g, '')) || 0;
        return getNum(b.bonus) - getNum(a.bonus);
      });
    } else {
      // Default: priority descending
      list.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
    }

    return list;
  };

  const filteredList = getFilteredApps();

  return (
    <div className="space-y-5 animate-fadeIn pb-10">

      {/* 1. Header Banner */}
      <div className="text-center py-2 px-1">
        <h1 className="text-base font-black text-slate-800 uppercase tracking-wide">
          All Yono Apps Directory 🗂️
        </h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          Browse, Filter, and Download from {activeApps.length} verified packages
        </p>
      </div>

      {/* 2. Interactive Search & Sort Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-3">
        {/* Search Input Box */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search app name, categories..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10 focus:bg-white transition-all font-bold placeholder-slate-400"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Sort selector */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-extrabold uppercase pt-0.5">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={12} className="text-slate-400" />
            <span>Sort By</span>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'priority', label: 'Default' },
              { id: 'name', label: 'Alphabetical' },
              { id: 'bonus', label: 'Highest Bonus' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id as any)}
                className={`px-2.5 py-1 rounded-md border font-extrabold transition-all cursor-pointer ${sortBy === opt.id
                    ? 'bg-slate-800 border-slate-800 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Horizontal Categories Filter Chips */}
      <div className="flex flex-wrap gap-2 px-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`text-[10px] px-3 py-1.5 rounded-full border font-extrabold transition-all cursor-pointer ${selectedCategory === null
              ? 'bg-[#003a92] border-[#003a92] text-white'
              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350 hover:text-slate-800'
            }`}
        >
          All Categories
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
              className={`text-[10px] px-3 py-1.5 rounded-full border font-extrabold transition-all cursor-pointer ${isSelected
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-black'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 4. App Directory List */}
      <div className="space-y-2">
        {filteredList.length > 0 ? (
          <motion.div
            key={`${sortBy}-${selectedCategory || 'all'}-${searchQuery}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:border-none md:shadow-none bg-transparent divide-y divide-slate-100 md:divide-y-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-0"
          >
            {filteredList.map((app, index) => (
              <div key={app.slug} className="bg-white md:border md:border-slate-200 md:rounded-2xl md:shadow-xs overflow-hidden">
                <AppCard
                  app={app}
                  rank={sortBy === 'priority' ? index + 1 : undefined}
                  onSelect={onSelectApp}
                  cardStyle={cardStyle}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl py-12 px-4 text-center text-slate-400 font-bold space-y-2">
            <SlidersHorizontal size={24} className="mx-auto text-slate-300" />
            <p className="text-xs">No matching applications found</p>
            <p className="text-[10px] text-slate-400">Try clearing filters or search terms</p>
          </div>
        )}
      </div>

    </div>
  );
};
export default AllYonoAppsPage;
