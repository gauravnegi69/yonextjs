export interface AppDetail {
  name: string;
  slug: string;
  logo: string;
  banner: string;
  screenshots: string[];
  description: string;
  category: string;
  tags: string[];
  features: string[];
  rating: number;
  installs: string;
  bonus: string;
  minWithdrawal: string;
  downloadUrl: string;
  status: 'active' | 'inactive';
  featured: boolean;
  priority: number;
  seoTitle: string;
  seoDescription: string;
  faqs: { question: string; answer: string }[];
  categories?: string[];
  isRecommended?: boolean;
  isNewPick?: boolean;
  isAllApps?: boolean;
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Collection {
  name: string;
  slug: string;
  description: string;
  appSlugs: string[];
}

export interface AppAnalytics {
  name: string;
  slug: string;
  views: number;
  clicks: number;
  ctr: number;
  history: { date: string; views: number; clicks: number }[];
}

export interface DashboardAnalytics {
  totalViews: number;
  totalClicks: number;
  averageCtr: number;
  appsAnalytics: AppAnalytics[];
  topAppsByViews: AppAnalytics[];
  topAppsByClicks: AppAnalytics[];
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  footerText: string;
  featuredAppsLimit: number;
  footerAdImage?: string;
  footerAdLink?: string;
  footerAdActive?: boolean;
  backgroundType?: string;
  cardStyle?: string;
  banner1?: string;
  banner2?: string;
  banner3?: string;
  banner4?: string;
  footerAdLogo?: string;
  footerAdName?: string;
  footerAdDesc?: string;
  siteDomain?: string;
  headerLogo?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  telegramLink?: string;
}
