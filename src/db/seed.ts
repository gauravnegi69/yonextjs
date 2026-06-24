import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { db, connectDb, AppDetail } from '../lib/db';

// Load environment variables
dotenv.config();

const REF_INDEX_PATH = path.join(process.cwd(), '..', 'scrapperv2', 'allrummybonus_com', 'index.html');

// Helper to sanitize html text
function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function seed() {
  await connectDb();

  console.log('Starting DB seeding process...');

  if (db.isMongo()) {
    console.log('Clearing existing MongoDB collections for fresh seed...');
    try {
      await mongoose.connection.collection('apps').deleteMany({});
      await mongoose.connection.collection('analytics').deleteMany({});
      await mongoose.connection.collection('categories').deleteMany({});
      await mongoose.connection.collection('tags').deleteMany({});
      await mongoose.connection.collection('collections').deleteMany({});
      try {
        await mongoose.connection.collection('settings').deleteMany({});
      } catch (err) {}
    } catch (e) {
      console.log('Error clearing collections:', e);
    }
  }

  if (!fs.existsSync(REF_INDEX_PATH)) {
    console.error(`Reference index file not found at: ${REF_INDEX_PATH}`);
    console.log('Seeding with standard mock applications instead...');
    await seedMocks();
    return;
  }

  try {
    // Seed default categories, tags, collections
    const defaultCategories = [
      { name: 'Rummy', slug: 'rummy', icon: 'Cards', description: 'Classic skill Rummy variations' },
      { name: 'Teen Patti', slug: 'teen-patti', icon: 'Gamepad', description: 'Fast card game battles' },
      { name: 'Slots', slug: 'slots', icon: 'Dice', description: 'Fruit machine and video slots' },
      { name: 'Casinos', slug: 'casinos', icon: 'Coins', description: 'Live table games' }
    ];

    const defaultTags = [
      { name: 'Free Bonus', slug: 'free-bonus' },
      { name: 'Real Cash', slug: 'real-cash' },
      { name: 'Fast Withdrawal', slug: 'fast-withdrawal' },
      { name: 'Top Rated', slug: 'top-rated' }
    ];

    const defaultCollections = [
      { name: 'Trending Play', slug: 'trending', description: 'Most played apps this week', appSlugs: [] },
      { name: "Editor's Picks", slug: 'editors-picks', description: 'Curated list of premium games', appSlugs: [] }
    ];

    for (const cat of defaultCategories) {
      await db.categories.create(cat);
    }
    for (const tag of defaultTags) {
      await db.tags.create(tag);
    }
    if (db.isMongo()) {
      for (const coll of defaultCollections) {
        try {
          await mongoose.connection.collection('collections').insertOne(coll);
        } catch (err) {}
      }
    }

    const html = fs.readFileSync(REF_INDEX_PATH, 'utf-8');
    const articleRegex = /<article class="row"[\s\S]*?<\/article>/g;
    const matches = html.match(articleRegex);

    if (!matches || matches.length === 0) {
      console.log('No articles found in reference HTML. Seeding mock apps...');
      await seedMocks();
      return;
    }

    console.log(`Found ${matches.length} applications in reference folder. Parsing...`);

    const tagsPool = ['Free Bonus', 'Real Cash', 'Fast Withdrawal', 'Top Rated', 'New Launch', 'Trusted App'];

    const apps: AppDetail[] = [];
    const processedSlugs = new Set<string>();

    for (let i = 0; i < matches.length; i++) {
      const article = matches[i];

      // Extract Name
      const nameMatch = article.match(/<h3 class="name">([\s\S]*?)<\/h3>/);
      const name = nameMatch ? cleanText(nameMatch[1]) : `App #${i + 1}`;

      // Skip bad/empty matches
      if (name.includes('App #') && i > 10) continue;

      const slug = slugify(name);

      if (processedSlugs.has(slug)) {
        continue;
      }
      processedSlugs.add(slug);

      // Extract Rank
      const rankMatch = article.match(/<div class="rank">(\d+)<\/div>/);
      const rank = rankMatch ? parseInt(rankMatch[1], 10) : i + 1;

      // Extract Logo URL
      const logoMatch = article.match(/src="([^"]+)"/);
      let logo = logoMatch ? logoMatch[1] : '';
      if (logo.startsWith('wp-content/')) {
        // Map relative to reference folder
        logo = `/scrapperv2/allrummybonus_com/${logo}`;
      }

      // Extract Sub (Downloads & Bonus)
      const subMatch = article.match(/<p class="sub">([\s\S]*?)<\/p>/);
      const subText = subMatch ? cleanText(subMatch[1]) : '';
      
      let installs = '100K+';
      let bonus = 'Rs.51';
      if (subText) {
        // subText usually looks like: "⬇ 125K+ | Bonus Rs.71"
        const parts = subText.split('|');
        if (parts[0]) installs = parts[0].replace('⬇', '').trim();
        if (parts[1]) bonus = parts[1].replace('Bonus', '').trim();
      }

      // Extract Min Withdrawal
      const minMatch = article.match(/<p class="min">([\s\S]*?)<\/p>/);
      const minText = minMatch ? cleanText(minMatch[1]) : 'Min. Withdrawal ₹100';
      const minWithdrawal = minText.replace('Min. Withdrawal', '').trim();

      // Extract Download Redirect Link
      const dlMatch = article.match(/href="([^"]+)"/);
      const downloadUrl = dlMatch ? dlMatch[1] : 'https://www.rummyskill.com';

      // Category assignment
      let category = 'Rummy';
      if (name.toLowerCase().includes('patti') || name.toLowerCase().includes('teen')) {
        category = 'Teen Patti';
      } else if (name.toLowerCase().includes('slot') || name.toLowerCase().includes('spin')) {
        category = 'Slots';
      } else if (name.toLowerCase().includes('bet') || name.toLowerCase().includes('win') || name.toLowerCase().includes('casino')) {
        category = 'Casinos';
      } else if (i % 4 === 1) {
        category = 'Teen Patti';
      } else if (i % 4 === 2) {
        category = 'Slots';
      } else if (i % 4 === 3) {
        category = 'Casinos';
      }

      // Tag assignment
      const tags: string[] = ['Real Cash'];
      if (parseFloat(bonus.replace(/[^0-9.]/g, '')) > 50) {
        tags.push('Free Bonus');
      }
      if (parseFloat(minWithdrawal.replace(/[^0-9.]/g, '')) <= 50) {
        tags.push('Fast Withdrawal');
      }
      if (rank <= 10) {
        tags.push('Top Rated');
      } else {
        // Randomly select one more tag
        tags.push(tagsPool[Math.floor(Math.random() * tagsPool.length)]);
      }
      const uniqueTags = Array.from(new Set(tags));

      const rating = rank <= 5 ? 4.9 : rank <= 15 ? 4.7 : parseFloat((4.0 + Math.random() * 0.8).toFixed(1));

      // Build features list
      const features = [
        'Secure 256-bit encryption for cash payments',
        '24/7 dedicated online customer support chat',
        'Direct bank and UPI withdrawal interfaces',
        'Multiple variations (Points, Pool, Deals Rummy)',
        'Daily bonus wheel spins up to Rs. 500'
      ];

      // Build FAQS list
      const faqs = [
        {
          question: `Is ${name} legal to play in India?`,
          answer: `Yes, card games of skill like Rummy and Teen Patti are legally recognized in India. However, users from restricted states (such as Assam, Odisha, Sikkim) are not allowed to play cash games.`
        },
        {
          question: `What is the signup bonus for ${name}?`,
          answer: `New users registering on the app will get a signup bonus of ${bonus} which can be verified in their account wallet immediately after OTP registration.`
        },
        {
          question: `How long do withdrawals take on ${name}?`,
          answer: `Withdrawals typically execute within 5 to 15 minutes. Supported payout options include Bank Transfer and UPI.`
        }
      ];

      const appData: AppDetail = {
        name,
        slug,
        logo,
        banner: `/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner1.jpg`, // Default banner
        screenshots: [
          `/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner1.jpg`,
          `/scrapperv2/allrummybonus_com/wp-content/uploads/2025/12/all-rummy-bonus-banner2.jpg`
        ],
        description: `${name} is an elite skill-based card gaming application custom-tailored for Android players who value high speed matches, secure transactions, and instant rewards. Register with OTP to access points play, tournament lobbies, and a signup bonus of ${bonus}. The app functions smoothly on low bandwidth networks.`,
        category,
        categories: [category],
        tags: uniqueTags,
        features,
        rating,
        installs,
        bonus,
        minWithdrawal,
        downloadUrl,
        status: 'active',
        featured: rank <= 5, // Top 5 featured
        priority: 100 - rank, // Higher priority for higher ranks
        seoTitle: `${name} APK Download - Sign Up & Get ${bonus} Free Bonus`,
        seoDescription: `Download the latest ${name} APK for Android. Enjoy real cash skill gaming, safe instant withdrawals (min ${minWithdrawal}), and a signup bonus of ${bonus}.`,
        faqs,
        isRecommended: rank <= 3,
        isNewPick: rank > 3 && rank <= 8,
        isAllApps: true
      };

      apps.push(appData);
    }

    // Save apps
    for (const app of apps) {
      await db.apps.create(app);
      // Initialize zero analytics record
      await db.analytics.recordView(app.slug);
    }

    // Update Collections with references
    const allSlugs = apps.map(a => a.slug);
    await db.collections.update('trending', { appSlugs: allSlugs.slice(0, 12) });
    await db.collections.update('editors-picks', { appSlugs: allSlugs.slice(12, 24) });

    console.log(`Successfully seeded ${apps.length} applications from references.`);
  } catch (error) {
    console.error('Failed to seed from reference HTML:', error);
    await seedMocks();
  }
}

async function seedMocks() {
  const mockApps: AppDetail[] = [
    {
      name: 'Yono Rummy Elite',
      slug: 'yono-rummy-elite',
      logo: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=150',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
      screenshots: [
        'https://images.unsplash.com/photo-1540747737956-37872c76d9fc?w=600',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600'
      ],
      description: 'Yono Rummy Elite is the premium destination for online card game enthusiasts. Enjoy seamless multiplayer matching, beautiful tables, zero latency, and rapid payout channels.',
      category: 'Rummy',
      categories: ['Rummy'],
      tags: ['Free Bonus', 'Real Cash', 'Top Rated'],
      features: ['Instant ₹100 signup bonus', '24/7 client live chat support', 'Instant bank card cashout'],
      rating: 4.9,
      installs: '500K+',
      bonus: 'Rs.100',
      minWithdrawal: '₹100',
      downloadUrl: 'https://www.rummyskill.com',
      status: 'active',
      featured: true,
      priority: 99,
      seoTitle: 'Yono Rummy Elite APK Download – Get Rs. 100 Signup Reward',
      seoDescription: 'Download Yono Rummy Elite and enjoy premium card tournaments. Safe, secured, and lightning fast withdrawals.',
      faqs: [],
      isRecommended: true,
      isNewPick: false,
      isAllApps: true
    },
    {
      name: 'Teen Patti Gold Premium',
      slug: 'teen-patti-gold-premium',
      logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150',
      banner: 'https://images.unsplash.com/photo-1540747737956-37872c76d9fc?w=800',
      screenshots: [],
      description: 'Join the most popular 3-card game table list. Beat opponents globally in real time with high visual assets, daily rewards, and secure payment gates.',
      category: 'Teen Patti',
      categories: ['Teen Patti'],
      tags: ['Real Cash', 'Fast Withdrawal'],
      features: ['Rs.51 registration gift', 'VIP tables available', 'Low data consumption mode'],
      rating: 4.8,
      installs: '400K+',
      bonus: 'Rs.51',
      minWithdrawal: '₹50',
      downloadUrl: 'https://www.rummyskill.com',
      status: 'active',
      featured: true,
      priority: 95,
      seoTitle: 'Teen Patti Gold Premium – Download Latest APK for Android',
      seoDescription: 'Experience online Teen Patti cash games. Signup and receive Rs. 51 bonus instantly.',
      faqs: [],
      isRecommended: true,
      isNewPick: true,
      isAllApps: true
    }
  ];

  for (const app of mockApps) {
    await db.apps.create(app);
    await db.analytics.recordView(app.slug);
  }

  await db.collections.update('trending', { appSlugs: ['yono-rummy-elite'] });
  await db.collections.update('editors-picks', { appSlugs: ['teen-patti-gold-premium'] });

  console.log('Seeded fallback mock data successfully.');
}

// Run seeder
seed()
  .then(() => {
    console.log('DB Seed complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Db Seed failed:', err);
    process.exit(1);
  });
