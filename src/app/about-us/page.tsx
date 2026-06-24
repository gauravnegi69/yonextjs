import React from 'react';
import { Shield, Sparkles, Award } from 'lucide-react';
import { Metadata } from 'next';
import PublicShell from '../../components/PublicShell';

export const metadata: Metadata = {
  title: 'About Us | Yono Hub',
  description: 'Learn more about Yono Hub, our mission, and our commitment to providing safe and verified gaming app links.',
  alternates: {
    canonical: '/about-us',
  },
};

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* 1. Header Banner Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#003a92] to-[#002868] text-white p-6 shadow-md border border-white/10">
        {/* Decorative background lights */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold uppercase px-2.5 py-1 rounded-full border border-amber-300/20">
            About Yono Hub
          </span>
          <h1 className="text-xl font-black uppercase tracking-wide">Premium APK Lobby Directory</h1>
          <p className="text-xs text-slate-200 leading-relaxed font-semibold">
            We simplify and organize verified mobile applications to help users compare, choose, and download with confidence.
          </p>
        </div>
      </div>

      {/* 2. Key Pillars Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Shield size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">100% Safe APKs</h3>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
              Every app listed is verified, security-checked, and checked against malware.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2 flex flex-col justify-between">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Award size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Top Rank Picks</h3>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
              We curate lists based on actual withdrawal speeds, rating reviews, and sign-up bonuses.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Detailed Information Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2.5">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-600" />
            Who We Are & What We Do
          </h2>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-medium">
          <p>
            Welcome to <strong className="text-slate-800">Yono Hub</strong>, an independent directory focused on providing detailed reviews and verified downloads for Rummy and skill-based gaming applications.
          </p>
          <p>
            Finding reliable Rummy apps can be difficult. We collect publicly available information, analyze the offers, and present download packages directly so users can download files without navigating multiple redirect pages.
          </p>
          <p>
            Please note that <strong className="text-slate-800">Yono Hub</strong> is an independent platform and is not partner-affiliated or linked to any of the featured app developers. All logos, names, and trademarks belong to their respective copyright holders.
          </p>
        </div>
      </section>

      {/* 4. Play Responsibly Strip */}
      <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 space-y-2 text-center">
        <div className="flex items-center gap-1.5 justify-center text-red-750 font-black text-[11px] uppercase tracking-wide">
          <span>🔞 Play Responsibly</span>
        </div>
        <p className="text-[10px] text-red-600 font-semibold leading-relaxed">
          Real money gaming carries financial risk. These games are intended for users aged 18 and above residing in permitted jurisdictions. Please play within your limits.
        </p>
      </div>
      </div>
    </PublicShell>
  );
}
