"use client";

import React, { useState } from 'react';
import { Send, Mail, Copy, Check, ShieldQuestion } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'support@yonohub.com';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* 1. Page Title */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#b91c1c] to-[#991b1b] text-white p-6 shadow-md border border-white/10">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] bg-white/20 text-white font-extrabold uppercase px-2.5 py-1 rounded-full border border-white/20">
            Get In Touch
          </span>
          <h1 className="text-xl font-black uppercase tracking-wide">Contact Yono Hub Support</h1>
          <p className="text-xs text-red-100 leading-relaxed font-semibold">
            Have partnership queries, advertising requests, or questions? Send us an inquiry.
          </p>
        </div>
      </div>

      {/* 2. Primary Contact Cards */}
      <div className="space-y-3">
        {/* Telegram Card */}
        <a 
          href="https://telegram.me/aaron7512" 
          target="_blank" 
          rel="noreferrer noopener nofollow"
          className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-blue-400 hover:shadow-md transition-all group no-underline text-inherit"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <Send size={18} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Official Telegram Channel</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">@aaron7512</p>
          </div>
          <span className="text-[10px] font-black text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Chat 📲
          </span>
        </a>

        {/* Email Card */}
        <div 
          onClick={copyToClipboard}
          className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <Mail size={18} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Business Cooperation</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">{emailAddress}</p>
          </div>
          <button 
            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-1 transition-all border ${
              copied 
                ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-700'
            }`}
          >
            {copied ? (
              <>
                <Check size={10} /> Copied
              </>
            ) : (
              <>
                <Copy size={10} /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Important Notice */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2.5">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldQuestion size={15} className="text-amber-500" />
            Support Clarification
          </h2>
        </div>

        <div className="space-y-3.5 text-xs text-slate-500 leading-relaxed font-semibold text-left">
          <p>
            Please note that <strong className="text-slate-800">Yono Hub is a directory and discovery platform</strong>. We do not design, run, or handle transactions for any of the listed games.
          </p>
          <p>
            If you face issues regarding withdrawal, deposits, logins, or gameplay accounts inside any specific app, please <strong className="text-slate-800">contact customer support inside that game</strong> directly. We are unable to provide player support for third-party games.
          </p>
        </div>
      </section>

    </div>
  );
};
export default ContactPage;
