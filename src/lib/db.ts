import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Define DB paths
const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

// Interface definitions
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

export interface AnalyticsRecord {
  appSlug: string;
  views: number;
  clicks: number;
  ctr: number;
  history: { date: string; views: number; clicks: number }[];
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  adminPasscode: string;
  footerText: string;
  featuredAppsLimit: number;
  footerAdImage?: string;
  footerAdLink?: string;
  footerAdActive?: boolean;
  backgroundType?: string;
  cardStyle?: string;
  adminEmail?: string;
  adminPasswordHash?: string;
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

// -------------------------------------------------------------
// MongoDB Mongoose Schemas
// -------------------------------------------------------------
const AppSchema = new mongoose.Schema<AppDetail>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: String,
  banner: String,
  screenshots: [String],
  description: String,
  category: String,
  tags: [String],
  features: [String],
  rating: { type: Number, default: 4.5 },
  installs: { type: String, default: '100K+' },
  bonus: String,
  minWithdrawal: String,
  downloadUrl: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  featured: { type: Boolean, default: false },
  priority: { type: Number, default: 0 },
  seoTitle: String,
  seoDescription: String,
  faqs: [{ question: String, answer: String }],
  categories: { type: [String], default: [] },
  isRecommended: { type: Boolean, default: false },
  isNewPick: { type: Boolean, default: false },
  isAllApps: { type: Boolean, default: true }
});

const CategorySchema = new mongoose.Schema<Category>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
  description: String
});

const TagSchema = new mongoose.Schema<Tag>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
});

const CollectionSchema = new mongoose.Schema<Collection>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  appSlugs: [String]
});

const AnalyticsSchema = new mongoose.Schema<AnalyticsRecord>({
  appSlug: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  history: [{ date: String, views: Number, clicks: Number }]
});

const SettingsSchema = new mongoose.Schema<SiteSettings>({
  siteName: { type: String, default: 'YonoV2' },
  siteTitle: { type: String, default: 'Yono Hub – Premium App Discovery & Play Platform' },
  siteDescription: { type: String, default: 'Discover, compare and download premium rummy and skill apps.' },
  adminPasscode: { type: String, default: 'admin123' },
  footerText: { type: String, default: '© 2026 Yono Hub. Play Responsibly. 18+ Only.' },
  featuredAppsLimit: { type: Number, default: 10 },
  footerAdImage: { type: String, default: '' },
  footerAdLink: { type: String, default: '' },
  footerAdActive: { type: Boolean, default: false },
  backgroundType: { type: String, default: 'white' },
  cardStyle: { type: String, default: 'default' },
  adminEmail: { type: String, default: 'gauravyonologin@gmail.com' },
  adminPasswordHash: { type: String },
  banner1: { type: String, default: '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner1.jpg' },
  banner2: { type: String, default: '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner2.jpg' },
  banner3: { type: String, default: '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner3.jpg' },
  banner4: { type: String, default: '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner4.jpg' },
  footerAdLogo: { type: String, default: '' },
  footerAdName: { type: String, default: '' },
  footerAdDesc: { type: String, default: '' },
  siteDomain: { type: String, default: 'https://yononewgamess.com' },
  headerLogo: { type: String, default: '' },
  headerTitle: { type: String, default: 'YONO HUB' },
  headerSubtitle: { type: String, default: 'Verified APK Lobbies' },
  telegramLink: { type: String, default: 'https://telegram.me/aaron7512' }
});

export const AppModel = mongoose.models.App || mongoose.model<AppDetail>('App', AppSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model<Category>('Category', CategorySchema);
export const TagModel = mongoose.models.Tag || mongoose.model<Tag>('Tag', TagSchema);
export const CollectionModel = mongoose.models.Collection || mongoose.model<Collection>('Collection', CollectionSchema);
export const AnalyticsModel = mongoose.models.Analytics || mongoose.model<AnalyticsRecord>('Analytics', AnalyticsSchema);
export const SettingsModel = mongoose.models.Settings || mongoose.model<SiteSettings>('Settings', SettingsSchema);

// -------------------------------------------------------------
// Database Connection & Mode Control
// -------------------------------------------------------------
let useMongo = false;
let isConnected = false;

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI || '';
  if (!mongoUri || mongoUri === '//MONGO_URI') {
    useMongo = false;
    initJsonDb();
    return;
  }

  // Reuse existing active connection
  if (mongoose.connection.readyState === 1) {
    useMongo = true;
    return;
  }

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
    });
    useMongo = true;
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('MongoDB connection error, falling back to local JSON DB:', error);
    useMongo = false;
    initJsonDb();
  }
}

// -------------------------------------------------------------
// Local JSON Storage Engine
// -------------------------------------------------------------
interface LocalSchema {
  apps: AppDetail[];
  categories: Category[];
  tags: Tag[];
  collections: Collection[];
  analytics: AnalyticsRecord[];
  settings: SiteSettings;
}

const defaultSettings: SiteSettings = {
  siteName: 'YonoV2',
  siteTitle: 'Yono Hub – Premium App Discovery & Play Platform',
  siteDescription: 'Discover, compare and download premium rummy and skill apps.',
  adminPasscode: 'admin123',
  footerText: '© 2026 Yono Hub. Play Responsibly. 18+ Only.',
  featuredAppsLimit: 10,
  footerAdImage: '',
  footerAdLink: '',
  footerAdActive: false,
  backgroundType: 'white',
  cardStyle: 'default',
  adminEmail: 'gauravyonologin@gmail.com',
  adminPasswordHash: '',
  banner1: '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner1.jpg',
  banner2: '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner2.jpg',
  banner3: '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner3.jpg',
  banner4: '/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner4.jpg',
  footerAdLogo: '',
  footerAdName: '',
  footerAdDesc: '',
  siteDomain: 'https://yononewgamess.com',
  headerLogo: '',
  headerTitle: 'YONO HUB',
  headerSubtitle: 'Verified APK Lobbies',
  telegramLink: 'https://telegram.me/aaron7512'
};

function initJsonDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(JSON_DB_PATH)) {
      const defaultData: LocalSchema = {
        apps: [],
        categories: [
          { name: 'Rummy', slug: 'rummy', icon: 'Cards', description: 'Classic skill Rummy variations' },
          { name: 'Teen Patti', slug: 'teen-patti', icon: 'Gamepad', description: 'Fast card game battles' },
          { name: 'Slots', slug: 'slots', icon: 'Dice', description: 'Fruit machine and video slots' },
          { name: 'Casinos', slug: 'casinos', icon: 'Coins', description: 'Live table games' }
        ],
        tags: [
          { name: 'Free Bonus', slug: 'free-bonus' },
          { name: 'Real Cash', slug: 'real-cash' },
          { name: 'Fast Withdrawal', slug: 'fast-withdrawal' },
          { name: 'Top Rated', slug: 'top-rated' }
        ],
        collections: [
          { name: 'Trending Play', slug: 'trending', description: 'Most played apps this week', appSlugs: [] },
          { name: "Editor's Picks", slug: 'editors-picks', description: 'Curated list of premium games', appSlugs: [] }
        ],
        analytics: [],
        settings: defaultSettings
      };
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
      console.log(`Created default JSON database at ${JSON_DB_PATH}`);
    }
  } catch (err) {
    console.error('Failed to initialize local JSON DB:', err);
  }
}

function readJsonDb(): LocalSchema {
  initJsonDb();
  try {
    const dataStr = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(dataStr);
  } catch (err) {
    console.error('Error reading JSON DB', err);
    return { apps: [], categories: [], tags: [], collections: [], analytics: [], settings: defaultSettings };
  }
}

function writeJsonDb(data: LocalSchema) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON DB', err);
  }
}

// -------------------------------------------------------------
// Unified Data API (Routes and Seeder will use these methods)
// -------------------------------------------------------------
export const db = {
  isMongo: () => useMongo,

  // App Listings API
  apps: {
    find: async (query: any = {}): Promise<AppDetail[]> => {
      await connectDb();
      if (useMongo) {
        return AppModel.find(query).sort({ priority: -1, name: 1 }).lean() as any;
      } else {
        const data = readJsonDb();
        let list = [...data.apps];
        if (query.status) list = list.filter(a => a.status === query.status);
        if (query.featured !== undefined) list = list.filter(a => a.featured === query.featured);
        if (query.category) list = list.filter(a => a.category.toLowerCase() === query.category.toLowerCase());
        return list.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
      }
    },

    findOne: async (query: { slug: string }): Promise<AppDetail | null> => {
      await connectDb();
      if (useMongo) {
        return AppModel.findOne(query).lean() as any;
      } else {
        const data = readJsonDb();
        return data.apps.find(a => a.slug === query.slug) || null;
      }
    },

    create: async (appData: AppDetail): Promise<AppDetail> => {
      await connectDb();
      if (useMongo) {
        return (await AppModel.create(appData)).toObject();
      } else {
        const dbData = readJsonDb();
        const existingIndex = dbData.apps.findIndex(a => a.slug === appData.slug);
        if (existingIndex > -1) {
          dbData.apps[existingIndex] = appData;
        } else {
          dbData.apps.push(appData);
        }
        writeJsonDb(dbData);
        return appData;
      }
    },

    update: async (slug: string, appData: Partial<AppDetail>): Promise<AppDetail | null> => {
      await connectDb();
      if (useMongo) {
        return AppModel.findOneAndUpdate({ slug }, { $set: appData }, { new: true }).lean() as any;
      } else {
        const dbData = readJsonDb();
        const index = dbData.apps.findIndex(a => a.slug === slug);
        if (index > -1) {
          dbData.apps[index] = { ...dbData.apps[index], ...appData } as AppDetail;
          writeJsonDb(dbData);
          return dbData.apps[index];
        }
        return null;
      }
    },

    delete: async (slug: string): Promise<boolean> => {
      await connectDb();
      if (useMongo) {
        const res = await AppModel.deleteOne({ slug });
        return res.deletedCount > 0;
      } else {
        const dbData = readJsonDb();
        const initialLen = dbData.apps.length;
        dbData.apps = dbData.apps.filter(a => a.slug !== slug);
        writeJsonDb(dbData);
        return dbData.apps.length < initialLen;
      }
    }
  },

  // Categories API
  categories: {
    find: async (): Promise<Category[]> => {
      await connectDb();
      if (useMongo) {
        return CategoryModel.find().lean() as any;
      } else {
        return readJsonDb().categories;
      }
    },
    create: async (cat: Category): Promise<Category> => {
      await connectDb();
      if (useMongo) {
        return (await CategoryModel.create(cat)).toObject();
      } else {
        const dbData = readJsonDb();
        if (!dbData.categories.some(c => c.slug === cat.slug)) {
          dbData.categories.push(cat);
          writeJsonDb(dbData);
        }
        return cat;
      }
    },
    update: async (slug: string, catData: Partial<Category>): Promise<Category | null> => {
      await connectDb();
      if (useMongo) {
        return CategoryModel.findOneAndUpdate({ slug }, { $set: catData }, { new: true }).lean() as any;
      } else {
        const dbData = readJsonDb();
        const index = dbData.categories.findIndex(c => c.slug === slug);
        if (index > -1) {
          dbData.categories[index] = { ...dbData.categories[index], ...catData } as Category;
          writeJsonDb(dbData);
          return dbData.categories[index];
        }
        return null;
      }
    },
    delete: async (slug: string): Promise<boolean> => {
      await connectDb();
      if (useMongo) {
        const res = await CategoryModel.deleteOne({ slug });
        return res.deletedCount > 0;
      } else {
        const dbData = readJsonDb();
        const len = dbData.categories.length;
        dbData.categories = dbData.categories.filter(c => c.slug !== slug);
        writeJsonDb(dbData);
        return dbData.categories.length < len;
      }
    }
  },

  // Tags API
  tags: {
    find: async (): Promise<Tag[]> => {
      await connectDb();
      if (useMongo) {
        return TagModel.find().lean() as any;
      } else {
        return readJsonDb().tags;
      }
    },
    create: async (tag: Tag): Promise<Tag> => {
      await connectDb();
      if (useMongo) {
        return (await TagModel.create(tag)).toObject();
      } else {
        const dbData = readJsonDb();
        if (!dbData.tags.some(t => t.slug === tag.slug)) {
          dbData.tags.push(tag);
          writeJsonDb(dbData);
        }
        return tag;
      }
    },
    delete: async (slug: string): Promise<boolean> => {
      await connectDb();
      if (useMongo) {
        const res = await TagModel.deleteOne({ slug });
        return res.deletedCount > 0;
      } else {
        const dbData = readJsonDb();
        const len = dbData.tags.length;
        dbData.tags = dbData.tags.filter(t => t.slug !== slug);
        writeJsonDb(dbData);
        return dbData.tags.length < len;
      }
    }
  },

  // Collections API
  collections: {
    find: async (): Promise<Collection[]> => {
      await connectDb();
      if (useMongo) {
        return CollectionModel.find().lean() as any;
      } else {
        return readJsonDb().collections;
      }
    },
    update: async (slug: string, collData: Partial<Collection>): Promise<Collection | null> => {
      await connectDb();
      if (useMongo) {
        return CollectionModel.findOneAndUpdate({ slug }, { $set: collData }, { new: true }).lean() as any;
      } else {
        const dbData = readJsonDb();
        const index = dbData.collections.findIndex(c => c.slug === slug);
        if (index > -1) {
          dbData.collections[index] = { ...dbData.collections[index], ...collData } as Collection;
          writeJsonDb(dbData);
          return dbData.collections[index];
        }
        return null;
      }
    }
  },

  // Analytics API
  analytics: {
    find: async (): Promise<AnalyticsRecord[]> => {
      await connectDb();
      if (useMongo) {
        return AnalyticsModel.find().lean() as any;
      } else {
        return readJsonDb().analytics;
      }
    },
    recordView: async (appSlug: string): Promise<void> => {
      await connectDb();
      const today = new Date().toISOString().split('T')[0];
      if (useMongo) {
        await AnalyticsModel.findOneAndUpdate(
          { appSlug },
          { $inc: { views: 1 } },
          { upsert: true }
        );
        // Add to history
        await AnalyticsModel.updateOne(
          { appSlug, 'history.date': today },
          { $inc: { 'history.$.views': 1 } }
        ).then(async (res) => {
          if (res.modifiedCount === 0) {
            await AnalyticsModel.updateOne(
              { appSlug },
              { $push: { history: { date: today, views: 1, clicks: 0 } } }
            );
          }
        });
        // Recalculate CTR
        const record = await AnalyticsModel.findOne({ appSlug });
        if (record) {
          const ctr = record.views > 0 ? (record.clicks / record.views) * 100 : 0;
          await AnalyticsModel.updateOne({ appSlug }, { $set: { ctr } });
        }
      } else {
        const dbData = readJsonDb();
        let idx = dbData.analytics.findIndex(a => a.appSlug === appSlug);
        if (idx === -1) {
          dbData.analytics.push({ appSlug, views: 0, clicks: 0, ctr: 0, history: [] });
          idx = dbData.analytics.length - 1;
        }
        const record = dbData.analytics[idx];
        record.views += 1;

        // History
        let hIdx = record.history.findIndex(h => h.date === today);
        if (hIdx === -1) {
          record.history.push({ date: today, views: 1, clicks: 0 });
        } else {
          record.history[hIdx].views += 1;
        }

        record.ctr = record.views > 0 ? (record.clicks / record.views) * 100 : 0;
        writeJsonDb(dbData);
      }
    },
    recordClick: async (appSlug: string): Promise<void> => {
      await connectDb();
      const today = new Date().toISOString().split('T')[0];
      if (useMongo) {
        await AnalyticsModel.findOneAndUpdate(
          { appSlug },
          { $inc: { clicks: 1 } },
          { upsert: true }
        );
        // Add to history
        await AnalyticsModel.updateOne(
          { appSlug, 'history.date': today },
          { $inc: { 'history.$.clicks': 1 } }
        ).then(async (res) => {
          if (res.modifiedCount === 0) {
            await AnalyticsModel.updateOne(
              { appSlug },
              { $push: { history: { date: today, views: 0, clicks: 1 } } }
            );
          }
        });
        // Recalculate CTR
        const record = await AnalyticsModel.findOne({ appSlug });
        if (record) {
          const ctr = record.views > 0 ? (record.clicks / record.views) * 100 : 0;
          await AnalyticsModel.updateOne({ appSlug }, { $set: { ctr } });
        }
      } else {
        const dbData = readJsonDb();
        let idx = dbData.analytics.findIndex(a => a.appSlug === appSlug);
        if (idx === -1) {
          dbData.analytics.push({ appSlug, views: 0, clicks: 0, ctr: 0, history: [] });
          idx = dbData.analytics.length - 1;
        }
        const record = dbData.analytics[idx];
        record.clicks += 1;

        // History
        let hIdx = record.history.findIndex(h => h.date === today);
        if (hIdx === -1) {
          record.history.push({ date: today, views: 0, clicks: 1 });
        } else {
          record.history[hIdx].clicks += 1;
        }

        record.ctr = record.views > 0 ? (record.clicks / record.views) * 100 : 0;
        writeJsonDb(dbData);
      }
    }
  },

  // Settings API
  settings: {
    get: async (): Promise<SiteSettings> => {
      await connectDb();
      let conf: any;
      if (useMongo) {
        conf = await SettingsModel.findOne().lean();
        if (!conf) {
          conf = await SettingsModel.create(defaultSettings);
        } else {
          conf = { ...defaultSettings, ...conf };
        }
      } else {
        const dbData = readJsonDb();
        conf = { ...defaultSettings, ...(dbData.settings || {}) };
      }

      // Check if adminPasswordHash is missing or needs initialization
      if (!conf.adminPasswordHash || conf.adminEmail !== 'gauravyonologin@gmail.com') {
        const bcryptjs = require('bcryptjs');
        const hash = bcryptjs.hashSync('gaurav15557', 10);
        conf.adminEmail = 'gauravyonologin@gmail.com';
        conf.adminPasswordHash = hash;

        if (useMongo) {
          conf = await SettingsModel.findOneAndUpdate(
            {},
            { $set: { adminEmail: conf.adminEmail, adminPasswordHash: conf.adminPasswordHash } },
            { new: true }
          ).lean();
        } else {
          const dbData = readJsonDb();
          dbData.settings = conf;
          writeJsonDb(dbData);
        }
      }

      return conf as any;
    },
    update: async (settingsData: Partial<SiteSettings>): Promise<SiteSettings> => {
      await connectDb();
      if (useMongo) {
        const conf = await SettingsModel.findOneAndUpdate({}, { $set: settingsData }, { new: true, upsert: true }).lean();
        return conf as any;
      } else {
        const dbData = readJsonDb();
        dbData.settings = { ...dbData.settings, ...settingsData };
        writeJsonDb(dbData);
        return dbData.settings;
      }
    }
  }
};
