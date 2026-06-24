"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, X, ChevronRight } from 'lucide-react';
import { AppDetail } from '../types';

interface SearchBarProps {
  onSelectApp?: (app: AppDetail) => void;
  apps: AppDetail[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectApp, apps }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AppDetail[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const trendingSearches = ['Yono', 'Rummy Ultra', 'Spin 777', 'Teen Patti Joy', 'Bingo 101'];

  // Listen for Cmd+K keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click to close dropdown results list
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute matching search results dynamically
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const cleanQuery = query.toLowerCase().trim();
    const filtered = apps.filter(app => {
      return (
        app.name.toLowerCase().includes(cleanQuery) ||
        app.category.toLowerCase().includes(cleanQuery) ||
        app.tags.some(t => t.toLowerCase().includes(cleanQuery))
      );
    });

    setResults(filtered.slice(0, 5)); // Limit to top 5 instant matches
  }, [query, apps]);

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleAppClick = (app: AppDetail) => {
    if (onSelectApp) {
      onSelectApp(app);
    } else {
      router.push(`/app/${app.slug}`);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-xl z-30">
      {/* Search Input field */}
      <div className="relative flex items-center shadow-sm">
        <Search className="absolute left-4 text-slate-450 w-4 h-4 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search apps, tags, categories... (Press ⌘K)"
          className="w-full h-11 pl-11 pr-14 rounded-full text-xs font-semibold outline-none text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/10 transition-all placeholder-slate-400"
        />
        
        {query ? (
          <button
            onClick={handleClear}
            className="absolute right-4 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-150 cursor-pointer border-0 bg-transparent"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-4 pointer-events-none hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-[10px] font-mono font-bold text-slate-400">
            <span>⌘</span>
            <span>K</span>
          </div>
        )}
      </div>

      {/* Suggestion & Results Dropdown Box */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl z-40">
          
          {/* Instant Search matches list */}
          {query.trim() !== '' ? (
            <div>
              <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-2">
                Instant Matches ({results.length})
              </div>
              
              {results.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {results.map((app) => (
                    <div
                      key={app.slug}
                      onClick={() => handleAppClick(app)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all duration-200 text-left"
                    >
                      <img
                        src={app.logo}
                        alt={app.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-slate-800">{app.name}</span>
                          <span className="text-xs font-black text-emerald-700">{app.bonus} Bonus</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-bold">{app.category}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-bold">
                            Min Wd: {app.minWithdrawal}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 font-medium">
                  No applications found matching "{query}"
                </div>
              )}
            </div>
          ) : (
            // Default panel when query is empty: Trending searches
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-red-650 mb-3 uppercase tracking-wider text-left">
                <Sparkles size={13} className="text-red-650" />
                Trending Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleSuggestionClick(keyword)}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all cursor-pointer font-bold"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
