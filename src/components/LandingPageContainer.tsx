"use client";

import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { AppDetail, Category, Collection, SiteSettings } from '../types';

interface LandingPageContainerProps {
  apps: AppDetail[];
  categories: Category[];
  collections: Collection[];
  settings: SiteSettings | null;
}

export const LandingPageContainer: React.FC<LandingPageContainerProps> = ({
  apps,
  categories,
  collections,
  settings
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <LandingPage
      apps={apps}
      categories={categories}
      collections={collections}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      settings={settings}
    />
  );
};
export default LandingPageContainer;
