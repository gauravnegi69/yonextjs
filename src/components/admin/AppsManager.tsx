"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Search, ShieldAlert, Sparkles, Settings } from 'lucide-react';
import { AppDetail, Category } from '../../types';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AppsManagerProps {
  apps: AppDetail[];
  categories: Category[];
  onRefresh?: () => void;
}

const defaultAppForm: AppDetail = {
  name: '',
  slug: '',
  logo: '',
  banner: '',
  screenshots: [],
  description: '',
  category: 'Rummy',
  categories: ['Rummy'],
  tags: ['Real Cash'],
  features: [],
  rating: 4.5,
  installs: '100K+',
  bonus: 'Rs.51',
  minWithdrawal: '₹100',
  downloadUrl: 'https://www.rummyskill.com',
  status: 'active',
  featured: false,
  priority: 0,
  seoTitle: '',
  seoDescription: '',
  faqs: [],
  isRecommended: false,
  isNewPick: false,
  isAllApps: true
};

export const AppsManager: React.FC<AppsManagerProps> = ({
  apps,
  categories,
  onRefresh
}) => {
  const { token } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingApp, setEditingApp] = useState<AppDetail>(defaultAppForm);
  const [isNew, setIsNew] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form lists helpers
  const [newFeature, setNewFeature] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  const handleCategoryToggle = (catName: string) => {
    const currentCats = editingApp.categories && editingApp.categories.length > 0
      ? editingApp.categories
      : [editingApp.category || 'Rummy'];
    let newCats: string[];
    if (currentCats.includes(catName)) {
      newCats = currentCats.filter(c => c !== catName);
    } else {
      newCats = [...currentCats, catName];
    }
    setEditingApp(prev => ({
      ...prev,
      categories: newCats,
      category: newCats[0] || 'Rummy'
    }));
  };

  const filtered = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (app: AppDetail) => {
    setEditingApp({ ...app });
    setIsNew(false);
    setIsEditing(true);
    setErrorMsg('');
  };

  const handleNew = () => {
    setEditingApp({ ...defaultAppForm });
    setIsNew(true);
    setIsEditing(true);
    setErrorMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp.name.trim() || !editingApp.slug.trim()) {
      setErrorMsg('Name and slug are required fields.');
      return;
    }

    // Validate Recommended Limit (max 3)
    if (editingApp.isRecommended && editingApp.status === 'active') {
      const recCount = apps.filter(a => a.isRecommended && a.status === 'active' && (isNew ? true : a.slug !== editingApp.slug)).length;
      if (recCount >= 3) {
        setErrorMsg('Maximum of 3 Recommended Top Picks apps allowed. Please disable recommended status on another app first.');
        return;
      }
    }

    // Validate New Picks Limit (max 5)
    if (editingApp.isNewPick && editingApp.status === 'active') {
      const newPicksCount = apps.filter(a => a.isNewPick && a.status === 'active' && (isNew ? true : a.slug !== editingApp.slug)).length;
      if (newPicksCount >= 5) {
        setErrorMsg('Maximum of 5 New Picks apps allowed in the 3D rotating slider. Please disable another new pick app first.');
        return;
      }
    }

    const url = isNew ? '/api/apps' : `/api/apps/${editingApp.slug}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingApp)
      });

      if (res.ok) {
        setIsEditing(false);
        if (onRefresh) onRefresh();
      } else {
        let errMsg = 'Failed to save application.';
        try {
          const err = await res.json();
          errMsg = err.message || errMsg;
        } catch (_) {
          errMsg = `Server error (${res.status}): ${res.statusText || 'Internal Server Error'}`;
        }
        setErrorMsg(errMsg);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Failed to save listings.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action is permanent.')) return;

    try {
      const res = await fetch(`/api/apps/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        if (onRefresh) onRefresh();
      } else {
        alert('Failed to delete listing.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // List arrays operations
  const addFeature = () => {
    if (!newFeature.trim()) return;
    setEditingApp(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
    setNewFeature('');
  };

  const removeFeature = (idx: number) => {
    setEditingApp(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const addFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    setEditingApp(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: faqQuestion.trim(), answer: faqAnswer.trim() }]
    }));
    setFaqQuestion('');
    setFaqAnswer('');
  };

  const removeFaq = (idx: number) => {
    setEditingApp(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));
  };

  const addTag = () => {
    if (!tagsInput.trim()) return;
    if (editingApp.tags.includes(tagsInput.trim())) return;
    setEditingApp(prev => ({ ...prev, tags: [...prev.tags, tagsInput.trim()] }));
    setTagsInput('');
  };

  const removeTag = (tag: string) => {
    setEditingApp(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-slate-800">
      
      {/* Search Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 text-left">
        <div>
          <h1 className="text-base font-black text-slate-850 uppercase tracking-wide">Database Manager</h1>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">
            Listing Control & CRUD
          </span>
        </div>

        <button
          onClick={handleNew}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-sm transition-all active:scale-98 cursor-pointer border-0"
        >
          <Plus size={14} />
          Create New Listing
        </button>
      </div>

      {/* Editor Modal Window (Render inline to avoid createPortal SSR layout errors) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-start justify-center p-4 overflow-y-auto pt-6 md:pt-16">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left"
          >
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 p-2 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer border-0"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-750 border border-blue-100">
                <Sparkles size={15} />
              </div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                {isNew ? 'Create Application Listing' : `Edit ${editingApp.name}`}
              </h2>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <ShieldAlert size={14} className="shrink-0 text-red-600" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            {/* Form Fields layout grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* App Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Application Name</label>
                <input
                  type="text"
                  value={editingApp.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = isNew ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : editingApp.slug;
                    setEditingApp(prev => ({ ...prev, name, slug }));
                  }}
                  className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-800"
                />
              </div>

              {/* App Slug */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">URL Slug</label>
                <input
                  type="text"
                  value={editingApp.slug}
                  disabled={!isNew}
                  onChange={(e) => setEditingApp(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-850 disabled:opacity-50"
                />
              </div>

              {/* Logo Link Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Logo URL Link</label>
                <input
                  type="text"
                  value={editingApp.logo}
                  onChange={(e) => setEditingApp(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="e.g., https://site.com/images/logo.png"
                  className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-800"
                />
              </div>

              {/* Banner Link Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold tracking-wider block uppercase">Banner Image URL Link</label>
                <input
                  type="text"
                  value={editingApp.banner}
                  onChange={(e) => setEditingApp(prev => ({ ...prev, banner: e.target.value }))}
                  placeholder="e.g., https://site.com/images/banner.png"
                  className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-800"
                />
              </div>

              {/* Category Checkboxes */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Categories (Select one or more)</label>
                <div className="flex flex-wrap gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  {categories.map(c => {
                    const isChecked = (editingApp.categories || [editingApp.category] || []).includes(c.name);
                    return (
                      <label key={c.slug} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryToggle(c.name)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span>{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Screenshots Input (Comma-separated text list) */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Screenshots URLs (Comma-separated list)</label>
                <textarea
                  value={editingApp.screenshots ? editingApp.screenshots.join(', ') : ''}
                  onChange={(e) => {
                    const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setEditingApp(prev => ({ ...prev, screenshots: urls }));
                  }}
                  placeholder="e.g., https://site.com/screen1.png, https://site.com/screen2.png"
                  rows={2}
                  className="w-full p-2.5 rounded-xl text-xs outline-none bg-white border border-slate-350 focus:border-blue-500/40 text-slate-800"
                />
              </div>

              {/* Redirection link */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">External Redirect URL</label>
                <input
                  type="url"
                  value={editingApp.downloadUrl}
                  onChange={(e) => setEditingApp(prev => ({ ...prev, downloadUrl: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-800"
                />
              </div>

              {/* Bonus value */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Signup Bonus Text</label>
                <input
                  type="text"
                  value={editingApp.bonus}
                  onChange={(e) => setEditingApp(prev => ({ ...prev, bonus: e.target.value }))}
                  placeholder="Rs.51"
                  className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-800"
                />
              </div>

              {/* Min Withdrawal */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Min Withdrawal Text</label>
                <input
                  type="text"
                  value={editingApp.minWithdrawal}
                  onChange={(e) => setEditingApp(prev => ({ ...prev, minWithdrawal: e.target.value }))}
                  placeholder="₹100"
                  className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-800"
                />
              </div>

              {/* Priority sorting weight */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Priority Sorting Weight</label>
                <input
                  type="number"
                  value={editingApp.priority}
                  onChange={(e) => setEditingApp(prev => ({ ...prev, priority: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-800"
                />
              </div>

              {/* Placement Mode Selection */}
              <div className="space-y-2.5 md:col-span-2 pt-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block font-header">Placement Display Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Mode 1: Recommended */}
                  <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer select-none transition-all ${
                    editingApp.isRecommended
                      ? 'border-amber-400 bg-amber-50/20 shadow-xs font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-350'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="placementMode"
                        checked={!!editingApp.isRecommended}
                        onChange={() => setEditingApp(prev => ({
                          ...prev,
                          isRecommended: true,
                          isNewPick: false,
                          featured: true,
                          isAllApps: true
                        }))}
                        className="w-4 h-4 accent-amber-600 cursor-pointer"
                      />
                      <span className="text-xs font-extrabold text-slate-850">Top 3 Recommended</span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block mt-1.5 font-semibold">
                      Shows on the top 3 gold recommended podium. (Max limit: 3)
                    </span>
                  </label>

                  {/* Mode 2: New Picks */}
                  <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer select-none transition-all ${
                    editingApp.isNewPick
                      ? 'border-blue-400 bg-blue-50/20 shadow-xs font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-350'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="placementMode"
                        checked={!!editingApp.isNewPick}
                        onChange={() => setEditingApp(prev => ({
                          ...prev,
                          isRecommended: false,
                          isNewPick: true,
                          featured: false,
                          isAllApps: true
                        }))}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-xs font-extrabold text-slate-850">New Picks</span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block mt-1.5 font-semibold">
                      Shows in the 3D rotating swiper carousel. (Max limit: 5)
                    </span>
                  </label>

                  {/* Mode 3: Normal */}
                  <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer select-none transition-all ${
                    !editingApp.isRecommended && !editingApp.isNewPick
                      ? 'border-emerald-400 bg-emerald-50/15 shadow-xs font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-350'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="placementMode"
                        checked={!editingApp.isRecommended && !editingApp.isNewPick}
                        onChange={() => setEditingApp(prev => ({
                          ...prev,
                          isRecommended: false,
                          isNewPick: false,
                          featured: false,
                          isAllApps: true
                        }))}
                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                      />
                      <span className="text-xs font-extrabold text-slate-850">Normal App</span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block mt-1.5 font-semibold">
                      Standard listing. Appears in the "All Apps" vertical grids.
                    </span>
                  </label>
                </div>
              </div>

              {/* Placements Toggle Checkboxes */}
              <div className="flex flex-wrap gap-4 items-center pt-1 md:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={editingApp.status === 'active'}
                    onChange={(e) => setEditingApp(prev => ({ ...prev, status: e.target.checked ? 'active' : 'inactive' }))}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span>Active Listing Status (Visible on Website)</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={editingApp.isAllApps !== false}
                    onChange={(e) => setEditingApp(prev => ({ ...prev, isAllApps: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span>Show in All Apps Lobbies Grid</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Description Overview</label>
              <textarea
                value={editingApp.description}
                onChange={(e) => setEditingApp(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full p-3 rounded-xl text-xs outline-none bg-white border border-slate-300 focus:border-blue-500/40 text-slate-800"
              />
            </div>

            {/* Tag Addition */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Filter tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Type tag (e.g. Free Cash)..."
                  className="flex-1 h-9 px-3 rounded-lg text-xs outline-none bg-white border border-slate-300 text-slate-800"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 rounded-lg bg-slate-800 text-xs font-bold text-white hover:bg-slate-900 cursor-pointer border-0"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {editingApp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-700 bg-transparent border-0 outline-none p-0 cursor-pointer">
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights bullet points */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Highlights Checklist</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter feature bullet point..."
                  className="flex-1 h-9 px-3 rounded-lg text-xs outline-none bg-white border border-slate-300 text-slate-800"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 rounded-lg bg-slate-800 text-xs font-bold text-white hover:bg-slate-900 cursor-pointer border-0"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
                {editingApp.features.map((feat, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-600 font-bold">{feat}</span>
                    <button type="button" onClick={() => removeFeature(idx)} className="text-red-600 hover:underline text-[9.5px] font-bold bg-transparent border-0 cursor-pointer">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-2.5">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Frequently Asked Questions (FAQs)</label>
              <div className="flex flex-col gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50">
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="FAQ Question..."
                  className="w-full h-9 px-3 rounded-lg text-xs outline-none bg-white border border-slate-300 text-slate-800"
                />
                <textarea
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="FAQ Answer..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg text-xs outline-none bg-white border border-slate-300 text-slate-800"
                />
                <button
                  type="button"
                  onClick={addFaq}
                  className="self-end px-4 py-1.5 rounded-lg text-white hover:bg-slate-900 text-xs font-bold bg-slate-800 cursor-pointer border-0"
                >
                  Add FAQ
                </button>
              </div>
              
              <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
                {editingApp.faqs && editingApp.faqs.map((faq, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 gap-3">
                    <div className="min-w-0 text-left">
                      <span className="font-extrabold text-slate-800 block truncate">{faq.question}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{faq.answer}</span>
                    </div>
                    <button type="button" onClick={() => removeFaq(idx)} className="text-red-600 hover:underline text-[9.5px] font-bold shrink-0 bg-transparent border-0 cursor-pointer">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Metadata Setup */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center gap-1 text-xs text-slate-500 font-black uppercase tracking-wide">
                <Settings size={13} />
                SEO Metadata Manager
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase block">SEO Title Tag</label>
                  <input
                    type="text"
                    value={editingApp.seoTitle || ''}
                    onChange={(e) => setEditingApp(prev => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase block">Meta Description</label>
                  <input
                    type="text"
                    value={editingApp.seoDescription || ''}
                    onChange={(e) => setEditingApp(prev => ({ ...prev, seoDescription: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg text-xs bg-white border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center gap-3 justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-extrabold text-xs shadow-sm hover:bg-slate-900 transition-all cursor-pointer border-0"
              >
                Save Listing Details
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Main Apps Table grid with controls */}
      <section className="p-4 rounded-xl border border-slate-200 bg-white space-y-4 shadow-sm text-left">
        
        {/* Table filter search bar */}
        <div className="relative max-w-xs shadow-sm">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search listings..."
            className="w-full h-9 pl-9 pr-4 rounded-xl text-xs outline-none bg-slate-50 border border-slate-300 text-slate-800 font-bold"
          />
        </div>

        {/* Datatable */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wide text-[9px]">
                <th className="py-2.5">APP NAME</th>
                <th className="py-2.5">CATEGORY</th>
                <th className="py-2.5">BONUS</th>
                <th className="py-2.5">PRIORITY</th>
                <th className="py-2.5">STATUS</th>
                <th className="py-2.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((app) => (
                  <tr key={app.slug} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 flex items-center gap-2">
                      <img src={app.logo} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-white shrink-0" />
                      <div className="min-w-0">
                        <span className="font-extrabold text-slate-800 block truncate max-w-[120px]">{app.name}</span>
                        <span className="text-[9.5px] text-slate-400 block truncate max-w-[120px]">{app.slug}</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 font-bold text-[9.5px]">
                        {app.category}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-emerald-700">{app.bonus}</td>
                    <td className="py-2.5 font-bold text-slate-400">{app.priority}</td>
                    <td className="py-2.5">
                      {app.status === 'active' ? (
                        <span className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-extrabold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full font-extrabold">
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleEdit(app)}
                          className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit3 size={11} />
                        </button>
                        <button
                          onClick={() => handleDelete(app.slug)}
                          className="p-1.5 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-bold">
                    No active listings in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
export default AppsManager;
