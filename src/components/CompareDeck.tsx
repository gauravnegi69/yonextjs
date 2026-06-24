"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare, Star, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export const CompareDeck: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, isOpen, setIsOpen } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Pinned Tray - Sticky Bottom Bar (Keep dark to contrast nicely with light mode body) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Pinned apps list preview */}
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto py-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase whitespace-nowrap">
              <GitCompare size={14} className="text-emerald-400 animate-pulse" />
              <span>Comparing ({compareList.length}/3)</span>
            </div>
            
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
 
            <div className="flex items-center gap-2">
              {compareList.map((app) => (
                <div
                  key={app.slug}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 pr-1.5"
                >
                  <img src={app.logo} alt={app.name} className="w-5 h-5 rounded-md object-cover bg-white" />
                  <span className="text-xs font-extrabold text-slate-100 max-w-[100px] truncate">{app.name}</span>
                  <button
                    onClick={() => removeFromCompare(app.slug)}
                    className="p-0.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={clearCompare}
              className="text-xs font-extrabold text-slate-400 hover:text-white transition-all cursor-pointer bg-transparent border-0 outline-none"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow transition-all active:scale-98 cursor-pointer border-0"
            >
              Compare Side-by-Side
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Grid Modal Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl relative text-left"
            >
              {/* Close buttons */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X size={15} />
              </button>

              {/* Title header */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
                  <GitCompare size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Compare Applications</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Spec check between selected top skill apps</p>
                </div>
              </div>

              {/* Comparison Matrix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compareList.map((app) => (
                  <div
                    key={app.slug}
                    className="flex flex-col p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-350 transition-all relative"
                  >
                    {/* Header */}
                    <div className="flex gap-2.5 items-center pb-3 border-b border-slate-200">
                      <img src={app.logo} alt={app.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white shrink-0" />
                      <div className="min-w-0">
                        <h3 className="text-xs font-black text-slate-800 truncate">{app.name}</h3>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-200/50 text-slate-600 font-bold inline-block mt-0.5">
                          {app.category}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCompare(app.slug)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0 outline-none"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Spec List */}
                    <div className="flex flex-col gap-3.5 py-4 flex-1">
                      {/* Rating Row */}
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-400 font-bold">RATING</span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-extrabold">
                          <Star size={11} fill="currentColor" className="stroke-amber-500" />
                          <span>{app.rating} / 5</span>
                        </div>
                      </div>

                      {/* Bonus Row */}
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-400 font-bold">BONUS</span>
                        <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                          {app.bonus}
                        </span>
                      </div>

                      {/* Withdrawal Row */}
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-400 font-bold">MIN WD</span>
                        <span className="font-extrabold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                          {app.minWithdrawal}
                        </span>
                      </div>

                      {/* Installs Row */}
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-400 font-bold">DOWNLOADS</span>
                        <span className="font-extrabold text-slate-600">{app.installs}</span>
                      </div>

                      {/* Key Features Block */}
                      <div className="pt-2.5 border-t border-slate-200">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1.5">
                          Highlights
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {app.features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-1 text-[10px] text-slate-600 font-semibold leading-relaxed">
                              <CheckCircle2 size={11} className="text-emerald-600 mt-0.5 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Download button */}
                    <a
                      href={`/go/${app.slug}`}
                      target="_blank"
                      rel="noreferrer noopener nofollow"
                      className="w-full py-2 rounded-xl btn-download-red text-center text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer mt-1 text-white no-underline"
                    >
                      <Download size={12} />
                      Download APK
                    </a>
                  </div>
                ))}

                {/* If less than 3 apps, render helper slide card */}
                {compareList.length < 3 && (
                  <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 min-h-[260px]">
                    <div className="p-2.5 rounded-full bg-white text-slate-400 border border-slate-200 mb-2">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-500">Add More Apps</span>
                    <p className="text-[9.5px] text-slate-400 text-center max-w-[150px] mt-1 leading-relaxed font-semibold">
                      Select other app listings on the discovery dashboard and click compare.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
