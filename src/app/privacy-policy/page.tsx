import React from 'react';
import { Eye, ShieldAlert, FileText } from 'lucide-react';
import { Metadata } from 'next';
import PublicShell from '../../components/PublicShell';

export const metadata: Metadata = {
  title: 'Privacy Policy | Yono Hub',
  description: 'Read our privacy policy to understand how we handle data and user privacy at Yono Hub.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PublicShell>
      <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* 1. Header Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#0f172a] to-[#1e293b] text-white p-6 shadow-md border border-white/10">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] bg-slate-800 text-slate-300 font-extrabold uppercase px-2.5 py-1 rounded-full border border-slate-700/50">
            Terms & Privacy
          </span>
          <h1 className="text-xl font-black uppercase tracking-wide">Privacy Policy & Disclaimers</h1>
          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
            Last Updated: June 2026. Understand how data and third-party links are managed on Yono Hub.
          </p>
        </div>
      </div>

      {/* 2. Structured Policy Sections */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
        
        {/* Section 1 */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <Eye size={13} className="text-blue-500" />
            1. Information Collection
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            Yono Hub is a listing directory. We do not require account registrations, deposit collections, or payments. We only track generic server metrics (such as page views and download clicks) to compute statistical rankings. No personal identity data is stored or shared.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <ShieldAlert size={13} className="text-amber-500" />
            2. Third-Party Websites & Games
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            We provide direct links to official download locations and APK files hosted by third-party game developers. Once you click a link and download or play on these apps, you are bound by their respective privacy terms and agreements. We encourage you to inspect their privacy policies directly.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <FileText size={13} className="text-[#b91c1c]" />
            3. Disclaimer & Disclosures
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            All content on Yono Hub is intended for informational and educational use only. Games of skill involve real money and financial risk. We are not responsible for any direct or indirect losses incurred by downloading or playing these apps. Please check local laws before installing or playing.
          </p>
        </div>

      </section>

      </div>
    </PublicShell>
  );
}
