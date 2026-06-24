"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppDetail } from '../types';

interface CompareContextType {
  compareList: AppDetail[];
  addToCompare: (app: AppDetail) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isComparing: (slug: string) => boolean;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<AppDetail[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load initial list from session
  useEffect(() => {
    const saved = sessionStorage.getItem('yono-compare');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const addToCompare = (app: AppDetail) => {
    if (compareList.some(item => item.slug === app.slug)) return;
    if (compareList.length >= 3) {
      alert("You can compare a maximum of 3 applications at the same time.");
      return;
    }
    const updated = [...compareList, app];
    setCompareList(updated);
    sessionStorage.setItem('yono-compare', JSON.stringify(updated));
    setIsOpen(true); // Open comparison tray automatically when adding
  };

  const removeFromCompare = (slug: string) => {
    const updated = compareList.filter(item => item.slug !== slug);
    setCompareList(updated);
    sessionStorage.setItem('yono-compare', JSON.stringify(updated));
  };

  const clearCompare = () => {
    setCompareList([]);
    sessionStorage.removeItem('yono-compare');
    setIsOpen(false);
  };

  const isComparing = (slug: string) => {
    return compareList.some(item => item.slug === slug);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isComparing,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
