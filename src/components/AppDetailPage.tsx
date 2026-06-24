"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { AppDetail, SiteSettings } from '../types';
import { AppCard } from './AppCard';

interface AppDetailPageProps {
  app: AppDetail;
  apps: AppDetail[];
  settings?: SiteSettings | null;
}

export const AppDetailPage: React.FC<AppDetailPageProps> = ({
  app,
  apps,
  settings
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const downloadLink = `/go/${app.slug}`;

  // Find related apps in the same category (excluding current app)
  const relatedApps = apps
    .filter(a => a.category === app.category && a.slug !== app.slug && a.status === 'active')
    .slice(0, 5);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-5 pb-10 animate-fadeIn px-1">

      {/* Back to listings button */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-800 transition-all cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg inline-flex no-underline"
      >
        <ArrowLeft size={13} />
        <span>Home / {app.name}</span>
      </Link>

      {/* Main app title */}
      <div className="text-center">
        <h1 className="text-lg font-black text-slate-800 uppercase">{app.name} APK Download</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          Get verified signup bonus and official install link
        </p>
      </div>

      {/* App Logo Image (Replaces Horizontal Banner) */}
      <section className="flex justify-center py-2">
        <a
          href={downloadLink}
          target="_blank"
          rel="noreferrer noopener nofollow"
          className="relative group block rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white"
          style={{ width: '140px', height: '140px' }}
        >
          <img
            src={app.logo}
            alt={`${app.name} Logo`}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
          />
        </a>
      </section>

      {/* Badge Summary row (Installs, Bonus, Min Withdrawal) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200">
          <span className="text-[9px] text-slate-400 block uppercase font-extrabold tracking-wider">Installs</span>
          <span className="text-xs font-black text-slate-800 mt-1 block">{app.installs}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200">
          <span className="text-[9px] text-slate-400 block uppercase font-extrabold tracking-wider">Bonus</span>
          <span className="text-xs font-black text-emerald-700 mt-1 block">{app.bonus}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200">
          <span className="text-[9px] text-slate-400 block uppercase font-extrabold tracking-wider">Min WD</span>
          <span className="text-xs font-black text-slate-800 mt-1 block">{app.minWithdrawal}</span>
        </div>
      </div>

      {/* Pulsing "Claim Bonus" CTA Button */}
      <div className="claim flex justify-center py-1">
        <a
          href={downloadLink}
          target="_blank"
          rel="noreferrer noopener nofollow"
          className="w-full text-center px-4 py-3.5 text-xs font-black text-white uppercase tracking-wider rounded-xl border-2 border-amber-300 claim-glow-pulse flex items-center justify-center gap-1.5 cursor-pointer no-underline"
          style={{ background: 'linear-gradient(45deg, #ff4c4c, #ff9c3c)' }}
        >
          ⬇️ Claim Your FREE {app.bonus} Bonus Now!
        </a>
      </div>

      {/* App Details overview & Highlights side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* App Details overview */}
        <section className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wide text-left">
            Who Should Play {app.name}?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold text-left">
            {app.description}
          </p>
        </section>

        {/* Highlights checklist */}
        <section className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wide text-left">
            Gameplay Features
          </h3>
          <ul className="flex flex-col gap-2 text-left">
            {app.features.map((feat, idx) => (
              <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 font-semibold">
                <ShieldCheck size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Accordion FAQs */}
      {app.faqs && app.faqs.length > 0 && (
        <section className="space-y-2.5">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wide px-1 flex items-center gap-1 text-left">
            <HelpCircle size={14} className="text-[#003a92]" />
            Frequently Asked Questions
          </h3>
          <div className="flex flex-col gap-2">
            {app.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-3.5 font-bold text-[11px] text-slate-700 hover:text-slate-900 transition-all text-left cursor-pointer bg-white border-0 outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className="text-slate-450 font-extrabold text-xs ml-2">
                      {isOpen ? '–' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-3.5 pt-0 text-[11px] text-slate-500 border-t border-slate-100 leading-relaxed bg-slate-50 text-left">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Safety info disclaimer */}
      <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-[10px] text-slate-500 leading-relaxed font-semibold">
        <p>
          Disclaimer: Playing card games online involves financial risks. 18+ players only. Verify rules within your local district prior to downloading. We do not host or operate this game.
        </p>
      </section>

      {/* Similar games list */}
      {relatedApps.length > 0 && (
        <section className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wide">
              Other Popular Rummy Apps
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:border-none md:shadow-none bg-transparent divide-y divide-slate-100 md:divide-y-0 border border-slate-100 rounded-xl overflow-hidden shadow-sm p-0">
            {relatedApps.map((rel, idx) => (
              <div key={rel.slug} className="bg-white md:border md:border-slate-200 md:rounded-2xl md:shadow-xs overflow-hidden">
                <AppCard
                  app={rel}
                  variant="medium"
                  rank={idx + 1}
                  cardStyle={settings?.cardStyle || 'default'}
                />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
export default AppDetailPage;
