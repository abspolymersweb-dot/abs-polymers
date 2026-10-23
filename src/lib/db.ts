import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { DEFAULT_CMS_STORE, CmsPageData } from '@/types/cms';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { SERVICES_DATA } from '@/data/services';
import { BLOG_POSTS } from '@/data/blogs';
import { GranuleProduct, ServiceItem, BlogPost, MachineryProduct, Destination } from '@/types';
import { INITIAL_DESTINATIONS } from '@/data/destinations';

const DB_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(DB_DIR, 'backups');
const DB_PATH = path.join(DB_DIR, 'abs_polymers.db');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure storage directories exist safely
try {
  if (typeof process !== 'undefined' && !process.env.VERCEL) {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  // Ignored in read-only serverless lambdas
}

// Singleton DB connection
let dbInstance: any = null;

export function getDb(): any {
  if (!dbInstance) {
    try {
      dbInstance = new Database(DB_PATH);
      dbInstance.pragma('journal_mode = WAL');
      dbInstance.pragma('synchronous = NORMAL');
      dbInstance.pragma('foreign_keys = ON');
      initSchema(dbInstance);
      seedDefaults(dbInstance);
    } catch (err) {
      console.warn('SQLite init skipped/read-only (serverless mode):', err);
      return {
        prepare: () => ({
          all: () => [],
          get: () => null,
          run: () => ({ changes: 0, lastInsertRowid: 0 })
        }),
        transaction: (fn: any) => fn,
        exec: () => {}
      };
    }
  }
  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    -- Site Settings
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- CMS Pages
    CREATE TABLE IF NOT EXISTS pages (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      meta_title TEXT,
      meta_description TEXT,
      og_image TEXT,
      sections_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Media Assets Library
    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      url TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      width INTEGER DEFAULT 0,
      height INTEGER DEFAULT 0,
      alt_text TEXT DEFAULT '',
      category TEXT DEFAULT 'general',
      created_at TEXT NOT NULL
    );

    -- Machinery Products
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      series TEXT DEFAULT '',
      category TEXT NOT NULL,
      short_description TEXT DEFAULT '',
      overview TEXT DEFAULT '',
      featured INTEGER DEFAULT 0,
      highlight_badge TEXT DEFAULT '',
      hero_image TEXT DEFAULT '',
      gallery_images_json TEXT DEFAULT '[]',
      brochure_url TEXT DEFAULT '',
      compatible_materials_json TEXT DEFAULT '[]',
      key_benefits_json TEXT DEFAULT '[]',
      applications_json TEXT DEFAULT '[]',
      spec_columns_json TEXT DEFAULT '[]',
      variants_json TEXT DEFAULT '[]',
      published INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Recycled Granules
    CREATE TABLE IF NOT EXISTS granules (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      material_type TEXT NOT NULL,
      grade TEXT NOT NULL,
      appearance TEXT DEFAULT '',
      colors_json TEXT DEFAULT '[]',
      mfi TEXT DEFAULT '',
      density TEXT DEFAULT '',
      tensile_strength TEXT DEFAULT '',
      short_description TEXT DEFAULT '',
      overview TEXT DEFAULT '',
      applications_json TEXT DEFAULT '[]',
      packaging TEXT DEFAULT '',
      min_order_quantity TEXT DEFAULT '',
      status TEXT DEFAULT 'available',
      image TEXT DEFAULT '',
      verified_specs_json TEXT DEFAULT '[]',
      meta_title TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      published INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Industrial Services & Spares
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      short_desc TEXT DEFAULT '',
      full_desc TEXT DEFAULT '',
      icon TEXT DEFAULT 'Wrench',
      image TEXT DEFAULT '',
      process_steps_json TEXT DEFAULT '[]',
      deliverables_json TEXT DEFAULT '[]',
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Technical Blogs & Insights
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      category TEXT DEFAULT 'Industry Insights',
      tags_json TEXT DEFAULT '[]',
      author_json TEXT DEFAULT '{}',
      read_time_minutes INTEGER DEFAULT 5,
      cover_image TEXT DEFAULT '',
      status TEXT DEFAULT 'published',
      seo_json TEXT DEFAULT '{}',
      published_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Customer & Commercial Enquiries
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      company_name TEXT DEFAULT '',
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      country TEXT DEFAULT 'India',
      inquiry_type TEXT NOT NULL,
      product_id TEXT DEFAULT '',
      product_name TEXT DEFAULT '',
      model_selected TEXT DEFAULT '',
      estimated_capacity TEXT DEFAULT '',
      material_to_recycle TEXT DEFAULT '',
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'new',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    -- Admin Users for Local Authentication
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT NOT NULL
    );

    -- Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      details TEXT DEFAULT '',
      ip_address TEXT DEFAULT '127.0.0.1',
      timestamp TEXT NOT NULL
    );

    -- Global Target & Export Destinations
    CREATE TABLE IF NOT EXISTS destinations (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      country_name TEXT NOT NULL,
      region TEXT NOT NULL,
      status TEXT DEFAULT 'target',
      flag_code TEXT DEFAULT '',
      hero_image TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      intro_title TEXT DEFAULT '',
      intro_content TEXT DEFAULT '',
      key_applications_json TEXT DEFAULT '[]',
      recommended_machinery_json TEXT DEFAULT '[]',
      target_materials_json TEXT DEFAULT '[]',
      cta_text TEXT DEFAULT 'Request Destination Quotation',
      cta_link TEXT DEFAULT '/contact?intent=quote',
      meta_title TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      image_alt TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Indexes for high-speed queries
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_granules_material ON granules(material_type);
    CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
    CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
    CREATE INDEX IF NOT EXISTS idx_media_category ON media_assets(category);
    CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
    CREATE INDEX IF NOT EXISTS idx_destinations_order ON destinations(display_order);
  `);

  // Safe incremental migrations for existing tables
  try {
    const enquiryCols = db.prepare('PRAGMA table_info(enquiries)').all() as any[];
    const colNames = enquiryCols.map((c) => c.name);
    if (!colNames.includes('destination_country')) {
      db.prepare("ALTER TABLE enquiries ADD COLUMN destination_country TEXT DEFAULT ''").run();
    }
    if (!colNames.includes('destination_id')) {
      db.prepare("ALTER TABLE enquiries ADD COLUMN destination_id TEXT DEFAULT ''").run();
    }
  } catch (err) {
    console.warn('Enquiries table migration notice:', err);
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function seedDefaults(db: Database.Database) {
  const now = new Date().toISOString();

  // 1. Seed Admin User if none exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (userCount.count === 0) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword('admin123', salt);
    db.prepare(`
      INSERT INTO admin_users (id, username, email, password_hash, salt, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('user-admin-default', 'admin', 'admin@abspolymers.com', hash, salt, 'superadmin', now);
  }

  // 2. Seed Pages & CMS
  const pageCount = db.prepare('SELECT COUNT(*) as count FROM pages').get() as { count: number };
  if (pageCount.count === 0) {
    const insertPage = db.prepare(`
      INSERT INTO pages (slug, title, meta_title, meta_description, og_image, sections_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const [slug, pageData] of Object.entries(DEFAULT_CMS_STORE.pages)) {
        insertPage.run(
          slug,
          slug.toUpperCase(),
          pageData.seo.metaTitle,
          pageData.seo.metaDescription,
          pageData.seo.ogImage || '/images/hero-factory.jpg',
          JSON.stringify(pageData.sections),
          now
        );
      }
    });
    transaction();
  }

  // 3. Seed Products
  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (prodCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, slug, name, series, category, short_description, overview,
        featured, highlight_badge, hero_image, gallery_images_json, brochure_url,
        compatible_materials_json, key_benefits_json, applications_json,
        spec_columns_json, variants_json, published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const p of MACHINERY_PRODUCTS) {
        insertProduct.run(
          p.id,
          p.slug,
          p.name,
          p.series || '',
          p.category,
          p.shortDescription || '',
          p.overview || '',
          p.featured ? 1 : 0,
          p.highlightBadge || '',
          p.heroImage || '/images/products/washing-plant-line.png',
          JSON.stringify(p.galleryImages || []),
          p.brochureUrl || '',
          JSON.stringify(p.compatibleMaterials || []),
          JSON.stringify(p.keyBenefits || []),
          JSON.stringify(p.applications || []),
          JSON.stringify(p.specColumns || []),
          JSON.stringify(p.variants || []),
          p.published !== false ? 1 : 0,
          now,
          now
        );
      }
    });
    transaction();
  }

  // 4. Seed Granules
  const granuleCount = db.prepare('SELECT COUNT(*) as count FROM granules').get() as { count: number };
  if (granuleCount.count === 0) {
    const insertGranule = db.prepare(`
      INSERT INTO granules (
        id, slug, name, material_type, grade, appearance, colors_json,
        mfi, density, tensile_strength, short_description, overview,
        applications_json, packaging, min_order_quantity, status,
        image, verified_specs_json, meta_title, meta_description,
        published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const g of GRANULE_PRODUCTS) {
        insertGranule.run(
          g.id,
          g.slug,
          g.name,
          g.materialType,
          g.grade,
          g.appearance || '',
          JSON.stringify(g.colorsAvailable || []),
          g.meltFlowIndex || '',
          g.density || '',
          g.tensileStrength || '',
          g.shortDescription || '',
          g.overview || '',
          JSON.stringify(g.applications || []),
          g.packaging || '',
          g.minOrderQuantity || '',
          g.status || 'available',
          g.image || '/images/hero-reference.jpg',
          JSON.stringify(g.verifiedSpecs || []),
          g.metaTitle || '',
          g.metaDescription || '',
          g.published !== false ? 1 : 0,
          now,
          now
        );
      }
    });
    transaction();
  }

  // 5. Seed Services
  const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
  if (serviceCount.count === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (
        id, slug, title, short_desc, full_desc, icon, image,
        process_steps_json, deliverables_json, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const s of SERVICES_DATA) {
        insertService.run(
          s.id,
          s.slug,
          s.title,
          s.shortDescription,
          s.fullDescription,
          s.iconName || 'Wrench',
          s.image || '/images/products/machines-collage.jpg',
          JSON.stringify(s.processSteps || []),
          JSON.stringify(s.deliverables || []),
          1,
          now,
          now
        );
      }
    });
    transaction();
  }

  // 6. Seed Blogs
  const blogCount = db.prepare('SELECT COUNT(*) as count FROM blogs').get() as { count: number };
  if (blogCount.count === 0) {
    const insertBlog = db.prepare(`
      INSERT INTO blogs (
        id, slug, title, excerpt, content, category, tags_json, author_json,
        read_time_minutes, cover_image, status, seo_json, published_at,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const b of BLOG_POSTS) {
        insertBlog.run(
          b.id,
          b.slug,
          b.title,
          b.excerpt,
          b.content,
          b.category,
          JSON.stringify(b.tags || []),
          JSON.stringify(b.author || {}),
          b.readingTimeMinutes || 5,
          b.coverImage || '/images/hero-factory.jpg',
          b.status || 'published',
          JSON.stringify(b.seo || {}),
          b.publishedAt || now,
          now,
          now
        );
      }
    });
    transaction();
  }

  // 7. Seed Initial Media Assets
  const mediaCount = db.prepare('SELECT COUNT(*) as count FROM media_assets').get() as { count: number };
  if (mediaCount.count === 0) {
    const defaultAssets = [
      { id: 'media-logo', filename: 'logo.png', original_name: 'Official ABS Polymers Logo', url: '/images/logo.png', mime_type: 'image/png', category: 'brand', alt_text: 'ABS Polymers Official Logo' },
      { id: 'media-hero-factory', filename: 'hero-factory.jpg', original_name: 'Factory Workshop & Line', url: '/images/hero-factory.jpg', mime_type: 'image/jpeg', category: 'machinery', alt_text: 'ABS Polymers Recycling Machine Fabrication Facility' },
      { id: 'media-hero-ref', filename: 'hero-reference.jpg', original_name: 'Industrial Machinery Overview', url: '/images/hero-reference.jpg', mime_type: 'image/jpeg', category: 'machinery', alt_text: 'Industrial Plastic Processing Lines' },
      { id: 'media-washing-plant', filename: 'washing-plant-line.png', original_name: '10 FT Compact Plastic Washing Plant', url: '/images/products/washing-plant-line.png', mime_type: 'image/png', category: 'machinery', alt_text: '10 FT Compact Plastic Washing Plant Line' },
      { id: 'media-crusher', filename: 'crusher-granulator.jpg', original_name: 'G Series Plastic Crusher Machine', url: '/images/products/crusher-granulator.jpg', mime_type: 'image/jpeg', category: 'machinery', alt_text: 'G Series Plastic Crusher and Granulator with EN41 Blades' },
      { id: 'media-collage', filename: 'machines-collage.jpg', original_name: 'Recycling Machinery Range Collage', url: '/images/products/machines-collage.jpg', mime_type: 'image/jpeg', category: 'machinery', alt_text: 'Full ABS Polymers Recycling Equipment Showcase' },
      { id: 'media-video-1080p', filename: 'hero-scroll-1080p.mp4', original_name: 'Flow Generated Factory Tour Video (1080p)', url: '/videos/hero-scroll-1080p.mp4', mime_type: 'video/mp4', category: 'machinery', alt_text: 'ABS Polymers Plastic Recycling Machinery Plant Flow Tour' },
      { id: 'media-video-720p', filename: 'hero-scroll-720p.mp4', original_name: 'Flow Generated Factory Tour Video (720p Mobile)', url: '/videos/hero-scroll-720p.mp4', mime_type: 'video/mp4', category: 'machinery', alt_text: 'ABS Polymers Mobile Video Stream' },
      { id: 'media-video-poster', filename: 'hero-poster.jpg', original_name: 'Factory Video Poster Frame', url: '/videos/hero-poster.jpg', mime_type: 'image/jpeg', category: 'machinery', alt_text: 'ABS Polymers Factory Video Poster' },
    ];

    const insertMedia = db.prepare(`
      INSERT INTO media_assets (id, filename, original_name, url, mime_type, size_bytes, width, height, alt_text, category, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const m of defaultAssets) {
        insertMedia.run(
          m.id,
          m.filename,
          m.original_name,
          m.url,
          m.mime_type,
          102400,
          1200,
          800,
          m.alt_text,
          m.category,
          now
        );
      }
    });
    transaction();
  }

  // 8. Seed Site Settings
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as { count: number };
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
    `);

    const defaultSettings = [
      { key: 'site_title', value: 'ABS Polymers | Plastic Recycling Machinery & Granules Coimbatore' },
      { key: 'company_name', value: 'ABS Polymers' },
      { key: 'phone', value: '+91 98422 12345' },
      { key: 'whatsapp', value: '+91 98422 12345' },
      { key: 'email', value: 'sales@abspolymers.com' },
      { key: 'factory_address', value: 'Coimbatore, Tamil Nadu, India' },
      { key: 'export_destinations', value: 'United Arab Emirates (UAE), Oman, Saudi Arabia, GCC & Pan-India' },
      { key: 'creator_attribution', value: 'Created by dawnexus.10' },
      { key: 'creator_url', value: 'https://dawnexus.com' },
      { key: 'allow_inquiries', value: 'true' },
      { key: 'database_mode', value: 'sqlite_local' },
    ];

    const transaction = db.transaction(() => {
      for (const s of defaultSettings) {
        insertSetting.run(s.key, s.value, now);
      }
    });
    transaction();
  }

  // 9. Seed Initial Inquiries if none exist
  const inqCount = db.prepare('SELECT COUNT(*) as count FROM enquiries').get() as { count: number };
  if (inqCount.count === 0) {
    const initialInquiries = [
      {
        id: 'inq-101',
        full_name: 'Ahmed Al Mansoori',
        company_name: 'Gulf Eco Plastics LLC',
        email: 'ahmed.mansoori@gulfecoplastics.ae',
        phone: '+971 50 123 4567',
        country: 'United Arab Emirates (UAE)',
        inquiry_type: 'machinery_quotation',
        product_id: 'absw-washing-plant',
        product_name: 'ABSW Series Compact Plastic Washing Plant',
        model_selected: 'W1000 (1000 kg/h)',
        estimated_capacity: '1000 kg/hr',
        material_to_recycle: 'Post-consumer HDPE bottles and PP caps',
        message: 'We are expanding our Dubai industrial zone recycling facility. We need a quotation for the ABSW W1000 compact washing plant including CIF Jebel Ali port shipping and on-site commissioning terms.',
        status: 'quotation_sent',
        notes: 'Quotation revision 1 dispatched via email. Client requested UAE electrical compliance 415V 50Hz confirmation.'
      },
      {
        id: 'inq-102',
        full_name: 'Suresh Narayanan',
        company_name: 'Kongu Polymer Industries',
        email: 'suresh@kongupolymers.in',
        phone: '+91 94433 88990',
        country: 'India',
        inquiry_type: 'machinery_quotation',
        product_id: 'g-series-crusher',
        product_name: 'G Series Plastic Crusher & Granulator',
        model_selected: 'G1000 (1000 kg/h, 50 HP)',
        estimated_capacity: '750 - 1000 kg/hr',
        material_to_recycle: 'Rigid plastic battery crates and automotive bumpers',
        message: 'Require heavy-duty crusher in Coimbatore. Need to test scrap cutting at your factory before placing purchase order. Please share pricing and lead time.',
        status: 'new',
        notes: 'Trial run requested at Coimbatore workshop.'
      },
      {
        id: 'inq-103',
        full_name: 'Mohamed Faisal',
        company_name: 'Al-Rayyan Recycling Solutions',
        email: 'faisal@alrayyanrecycling.com',
        phone: '+971 55 987 6543',
        country: 'United Arab Emirates (UAE)',
        inquiry_type: 'plant_turnkey',
        product_id: '',
        product_name: 'Turnkey 1500 kg/h Washing & Granulation Line',
        model_selected: '',
        estimated_capacity: '1500 kg/hr',
        material_to_recycle: 'LDPE agricultural film and HDPE containers',
        message: 'Looking for a complete washing and granulation line solution with closed-loop water treatment. Please provide technical layout drawings and budget estimates.',
        status: 'in_progress',
        notes: 'CAD layout shared with client engineering team.'
      }
    ];

    const insertInq = db.prepare(`
      INSERT INTO enquiries (
        id, full_name, company_name, email, phone, country, inquiry_type,
        product_id, product_name, model_selected, estimated_capacity,
        material_to_recycle, message, status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const inq of initialInquiries) {
        insertInq.run(
          inq.id,
          inq.full_name,
          inq.company_name,
          inq.email,
          inq.phone,
          inq.country,
          inq.inquiry_type,
          inq.product_id,
          inq.product_name,
          inq.model_selected,
          inq.estimated_capacity,
          inq.material_to_recycle,
          inq.message,
          inq.status,
          inq.notes,
          now
        );
      }
    });
    transaction();
  }

  // 10. Seed Destinations
  const destCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get() as { count: number };
  if (destCount.count === 0) {
    const insertDest = db.prepare(`
      INSERT INTO destinations (
        id, slug, country_name, region, status, flag_code, hero_image,
        display_order, published, intro_title, intro_content,
        key_applications_json, recommended_machinery_json, target_materials_json,
        cta_text, cta_link, meta_title, meta_description, image_alt,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const d of INITIAL_DESTINATIONS) {
        insertDest.run(
          d.id,
          d.slug,
          d.countryName,
          d.region,
          d.status,
          d.flagCode,
          d.heroImage,
          d.displayOrder,
          d.published ? 1 : 0,
          d.introTitle,
          d.introContent,
          JSON.stringify(d.keyApplications || []),
          JSON.stringify(d.recommendedMachinery || []),
          JSON.stringify(d.targetMaterials || []),
          d.ctaText,
          d.ctaLink,
          d.metaTitle,
          d.metaDescription,
          d.imageAlt,
          d.createdAt || now,
          d.updatedAt || now
        );
      }
    });
    transaction();
  }
}

// -------------------------------------------------------------
// Database Helper Methods & API
// -------------------------------------------------------------

export function backupDatabase(): { success: boolean; filename: string; path: string; sizeBytes: number; error?: string } {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `abs_polymers_backup_${timestamp}.db`;
    const destPath = path.join(BACKUP_DIR, backupFilename);

    const db = getDb();
    db.backup(destPath);

    const stats = fs.statSync(destPath);
    return {
      success: true,
      filename: backupFilename,
      path: destPath,
      sizeBytes: stats.size
    };
  } catch (err: any) {
    console.error('Database backup failed:', err);
    return {
      success: false,
      filename: '',
      path: '',
      sizeBytes: 0,
      error: err.message || 'Backup failed'
    };
  }
}

export function listBackups(): { filename: string; sizeBytes: number; createdAt: string }[] {
  try {
    if (!fs.existsSync(BACKUP_DIR)) return [];
    const files = fs.readdirSync(BACKUP_DIR);
    return files
      .filter(f => f.endsWith('.db'))
      .map(filename => {
        const filePath = path.join(BACKUP_DIR, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          sizeBytes: stats.size,
          createdAt: stats.birthtime.toISOString()
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    console.error('Failed to list backups:', err);
    return [];
  }
}

// Pages / CMS
export function getDbPage(slug: string): CmsPageData | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug) as any;
  if (!row) return null;
  return {
    seo: {
      metaTitle: row.meta_title || '',
      metaDescription: row.meta_description || '',
      ogImage: row.og_image || ''
    },
    sections: JSON.parse(row.sections_json || '{}')
  };
}

export function getAllDbPages(): Record<string, CmsPageData> {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM pages').all() as any[];
  const result: Record<string, CmsPageData> = {};
  for (const row of rows) {
    result[row.slug] = {
      seo: {
        metaTitle: row.meta_title || '',
        metaDescription: row.meta_description || '',
        ogImage: row.og_image || ''
      },
      sections: JSON.parse(row.sections_json || '{}')
    };
  }
  return result;
}

export function saveDbPage(slug: string, data: CmsPageData): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO pages (slug, title, meta_title, meta_description, og_image, sections_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      meta_title = excluded.meta_title,
      meta_description = excluded.meta_description,
      og_image = excluded.og_image,
      sections_json = excluded.sections_json,
      updated_at = excluded.updated_at
  `).run(
    slug,
    slug.toUpperCase(),
    data.seo.metaTitle,
    data.seo.metaDescription,
    data.seo.ogImage || '',
    JSON.stringify(data.sections),
    now
  );
  return true;
}

// Media Assets
export function getAllMediaAssets(category?: string): any[] {
  const db = getDb();
  if (category && category !== 'all') {
    return db.prepare('SELECT * FROM media_assets WHERE category = ? ORDER BY created_at DESC').all(category);
  }
  return db.prepare('SELECT * FROM media_assets ORDER BY created_at DESC').all();
}

export function insertMediaAsset(asset: {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  alt_text?: string;
  category?: string;
}): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO media_assets (id, filename, original_name, url, mime_type, size_bytes, width, height, alt_text, category, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    asset.id,
    asset.filename,
    asset.original_name,
    asset.url,
    asset.mime_type,
    asset.size_bytes,
    asset.width || 0,
    asset.height || 0,
    asset.alt_text || '',
    asset.category || 'general',
    now
  );
  return true;
}

export function deleteMediaAsset(id: string): { success: boolean; url?: string } {
  const db = getDb();
  const row = db.prepare('SELECT url FROM media_assets WHERE id = ?').get(id) as { url: string } | undefined;
  if (!row) return { success: false };

  // If local file in /uploads/, delete file from disk
  if (row.url.startsWith('/uploads/')) {
    const filename = path.basename(row.url);
    const diskPath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err) {
        console.error('Failed to delete file from disk:', err);
      }
    }
  }

  db.prepare('DELETE FROM media_assets WHERE id = ?').run(id);
  return { success: true, url: row.url };
}

// Products
export function getAllDbProducts(): any[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM products ORDER BY featured DESC, name ASC').all() as any[];
  return rows.map(r => ({
    ...r,
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    shortDescription: r.short_description,
    highlightBadge: r.highlight_badge,
    heroImage: r.hero_image,
    galleryImages: JSON.parse(r.gallery_images_json || '[]'),
    brochureUrl: r.brochure_url,
    compatibleMaterials: JSON.parse(r.compatible_materials_json || '[]'),
    keyBenefits: JSON.parse(r.key_benefits_json || '[]'),
    applications: JSON.parse(r.applications_json || '[]'),
    specColumns: JSON.parse(r.spec_columns_json || '[]'),
    variants: JSON.parse(r.variants_json || '[]')
  }));
}

export function getDbProductBySlug(slug: string): any | null {
  const db = getDb();
  const r = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as any;
  if (!r) return null;
  return {
    ...r,
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    shortDescription: r.short_description,
    highlightBadge: r.highlight_badge,
    heroImage: r.hero_image,
    galleryImages: JSON.parse(r.gallery_images_json || '[]'),
    brochureUrl: r.brochure_url,
    compatibleMaterials: JSON.parse(r.compatible_materials_json || '[]'),
    keyBenefits: JSON.parse(r.key_benefits_json || '[]'),
    applications: JSON.parse(r.applications_json || '[]'),
    specColumns: JSON.parse(r.spec_columns_json || '[]'),
    variants: JSON.parse(r.variants_json || '[]')
  };
}

export function saveDbProduct(prod: any): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO products (
      id, slug, name, series, category, short_description, overview,
      featured, highlight_badge, hero_image, gallery_images_json, brochure_url,
      compatible_materials_json, key_benefits_json, applications_json,
      spec_columns_json, variants_json, published, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      series = excluded.series,
      category = excluded.category,
      short_description = excluded.short_description,
      overview = excluded.overview,
      featured = excluded.featured,
      highlight_badge = excluded.highlight_badge,
      hero_image = excluded.hero_image,
      gallery_images_json = excluded.gallery_images_json,
      brochure_url = excluded.brochure_url,
      compatible_materials_json = excluded.compatible_materials_json,
      key_benefits_json = excluded.key_benefits_json,
      applications_json = excluded.applications_json,
      spec_columns_json = excluded.spec_columns_json,
      variants_json = excluded.variants_json,
      published = excluded.published,
      updated_at = excluded.updated_at
  `).run(
    prod.id,
    prod.slug,
    prod.name,
    prod.series || '',
    prod.category,
    prod.shortDescription || prod.short_description || '',
    prod.overview || '',
    prod.featured ? 1 : 0,
    prod.highlightBadge || prod.highlight_badge || '',
    prod.heroImage || prod.hero_image || '/images/products/washing-plant-line.png',
    JSON.stringify(prod.galleryImages || prod.gallery_images_json || []),
    prod.brochureUrl || prod.brochure_url || '',
    JSON.stringify(prod.compatibleMaterials || prod.compatible_materials_json || []),
    JSON.stringify(prod.keyBenefits || prod.key_benefits_json || []),
    JSON.stringify(prod.applications || prod.applications_json || []),
    JSON.stringify(prod.specColumns || prod.spec_columns_json || []),
    JSON.stringify(prod.variants || prod.variants_json || []),
    prod.published !== false ? 1 : 0,
    prod.created_at || now,
    now
  );
  return true;
}

// Granules
export function getAllDbGranules(): any[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM granules ORDER BY name ASC').all() as any[];
  return rows.map(r => ({
    ...r,
    materialType: r.material_type,
    colorsAvailable: JSON.parse(r.colors_json || '[]'),
    meltFlowIndex: r.mfi,
    tensileStrength: r.tensile_strength,
    shortDescription: r.short_description,
    minOrderQuantity: r.min_order_quantity,
    verifiedSpecs: JSON.parse(r.verified_specs_json || '[]'),
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    published: Boolean(r.published),
    applications: JSON.parse(r.applications_json || '[]')
  }));
}

export function getDbGranuleBySlug(slug: string): any | null {
  const db = getDb();
  const r = db.prepare('SELECT * FROM granules WHERE slug = ?').get(slug) as any;
  if (!r) return null;
  return {
    ...r,
    materialType: r.material_type,
    colorsAvailable: JSON.parse(r.colors_json || '[]'),
    meltFlowIndex: r.mfi,
    tensileStrength: r.tensile_strength,
    shortDescription: r.short_description,
    minOrderQuantity: r.min_order_quantity,
    verifiedSpecs: JSON.parse(r.verified_specs_json || '[]'),
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    published: Boolean(r.published),
    applications: JSON.parse(r.applications_json || '[]')
  };
}

export function saveDbGranule(g: any): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO granules (
      id, slug, name, material_type, grade, appearance, colors_json,
      mfi, density, tensile_strength, short_description, overview,
      applications_json, packaging, min_order_quantity, status,
      image, verified_specs_json, meta_title, meta_description,
      published, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      material_type = excluded.material_type,
      grade = excluded.grade,
      appearance = excluded.appearance,
      colors_json = excluded.colors_json,
      mfi = excluded.mfi,
      density = excluded.density,
      tensile_strength = excluded.tensile_strength,
      short_description = excluded.short_description,
      overview = excluded.overview,
      applications_json = excluded.applications_json,
      packaging = excluded.packaging,
      min_order_quantity = excluded.min_order_quantity,
      status = excluded.status,
      image = excluded.image,
      verified_specs_json = excluded.verified_specs_json,
      meta_title = excluded.meta_title,
      meta_description = excluded.meta_description,
      published = excluded.published,
      updated_at = excluded.updated_at
  `).run(
    g.id,
    g.slug,
    g.name,
    g.materialType || g.material_type,
    g.grade,
    g.appearance || '',
    JSON.stringify(g.colorsAvailable || g.colors_json || []),
    g.meltFlowIndex || g.mfi || '',
    g.density || '',
    g.tensileStrength || g.tensile_strength || '',
    g.shortDescription || g.short_description || '',
    g.overview || '',
    JSON.stringify(g.applications || g.applications_json || []),
    g.packaging || '',
    g.minOrderQuantity || g.min_order_quantity || '',
    g.status || 'available',
    g.image || '/images/hero-reference.jpg',
    JSON.stringify(g.verifiedSpecs || g.verified_specs_json || []),
    g.metaTitle || g.meta_title || '',
    g.metaDescription || g.meta_description || '',
    g.published !== false ? 1 : 0,
    g.created_at || now,
    now
  );
  return true;
}

// Services
export function getAllDbServices(): any[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM services ORDER BY title ASC').all() as any[];
  return rows.map(r => ({
    ...r,
    shortDescription: r.short_desc,
    fullDescription: r.full_desc,
    iconName: r.icon,
    processSteps: JSON.parse(r.process_steps_json || '[]'),
    deliverables: JSON.parse(r.deliverables_json || '[]'),
    isActive: Boolean(r.is_active)
  }));
}

export function getDbServiceBySlug(slug: string): any | null {
  const db = getDb();
  const r = db.prepare('SELECT * FROM services WHERE slug = ?').get(slug) as any;
  if (!r) return null;
  return {
    ...r,
    shortDescription: r.short_desc,
    fullDescription: r.full_desc,
    iconName: r.icon,
    processSteps: JSON.parse(r.process_steps_json || '[]'),
    deliverables: JSON.parse(r.deliverables_json || '[]'),
    isActive: Boolean(r.is_active)
  };
}

export function saveDbService(s: any): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO services (
      id, slug, title, short_desc, full_desc, icon, image,
      process_steps_json, deliverables_json, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      short_desc = excluded.short_desc,
      full_desc = excluded.full_desc,
      icon = excluded.icon,
      image = excluded.image,
      process_steps_json = excluded.process_steps_json,
      deliverables_json = excluded.deliverables_json,
      is_active = excluded.is_active,
      updated_at = excluded.updated_at
  `).run(
    s.id,
    s.slug,
    s.title,
    s.shortDescription || s.short_desc || '',
    s.fullDescription || s.full_desc || '',
    s.iconName || s.icon || 'Wrench',
    s.image || '/images/products/machines-collage.jpg',
    JSON.stringify(s.processSteps || s.process_steps_json || []),
    JSON.stringify(s.deliverables || s.deliverables_json || []),
    s.isActive !== false ? 1 : 0,
    s.created_at || now,
    now
  );
  return true;
}

// Destinations
export function getAllDbDestinations(publishedOnly = false): Destination[] {
  const db = getDb();
  const query = publishedOnly
    ? 'SELECT * FROM destinations WHERE published = 1 ORDER BY display_order ASC, country_name ASC'
    : 'SELECT * FROM destinations ORDER BY display_order ASC, country_name ASC';
  const rows = db.prepare(query).all() as any[];
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    countryName: r.country_name,
    region: r.region,
    status: r.status as 'established' | 'target',
    flagCode: r.flag_code,
    heroImage: r.hero_image,
    displayOrder: r.display_order,
    published: r.published === 1,
    introTitle: r.intro_title,
    introContent: r.intro_content,
    keyApplications: JSON.parse(r.key_applications_json || '[]'),
    recommendedMachinery: JSON.parse(r.recommended_machinery_json || '[]'),
    targetMaterials: JSON.parse(r.target_materials_json || '[]'),
    ctaText: r.cta_text,
    ctaLink: r.cta_link,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    imageAlt: r.image_alt,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export function getDbDestinationBySlug(slug: string, publishedOnly = false): Destination | null {
  const db = getDb();
  const query = publishedOnly
    ? 'SELECT * FROM destinations WHERE slug = ? AND published = 1'
    : 'SELECT * FROM destinations WHERE slug = ?';
  const r = db.prepare(query).get(slug) as any;
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    countryName: r.country_name,
    region: r.region,
    status: r.status as 'established' | 'target',
    flagCode: r.flag_code,
    heroImage: r.hero_image,
    displayOrder: r.display_order,
    published: r.published === 1,
    introTitle: r.intro_title,
    introContent: r.intro_content,
    keyApplications: JSON.parse(r.key_applications_json || '[]'),
    recommendedMachinery: JSON.parse(r.recommended_machinery_json || '[]'),
    targetMaterials: JSON.parse(r.target_materials_json || '[]'),
    ctaText: r.cta_text,
    ctaLink: r.cta_link,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    imageAlt: r.image_alt,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function getDbDestinationById(id: string): Destination | null {
  const db = getDb();
  const r = db.prepare('SELECT * FROM destinations WHERE id = ?').get(id) as any;
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    countryName: r.country_name,
    region: r.region,
    status: r.status as 'established' | 'target',
    flagCode: r.flag_code,
    heroImage: r.hero_image,
    displayOrder: r.display_order,
    published: r.published === 1,
    introTitle: r.intro_title,
    introContent: r.intro_content,
    keyApplications: JSON.parse(r.key_applications_json || '[]'),
    recommendedMachinery: JSON.parse(r.recommended_machinery_json || '[]'),
    targetMaterials: JSON.parse(r.target_materials_json || '[]'),
    ctaText: r.cta_text,
    ctaLink: r.cta_link,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    imageAlt: r.image_alt,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function saveDbDestination(d: Partial<Destination> & { id: string; countryName: string; slug: string }): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO destinations (
      id, slug, country_name, region, status, flag_code, hero_image,
      display_order, published, intro_title, intro_content,
      key_applications_json, recommended_machinery_json, target_materials_json,
      cta_text, cta_link, meta_title, meta_description, image_alt,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      country_name = excluded.country_name,
      region = excluded.region,
      status = excluded.status,
      flag_code = excluded.flag_code,
      hero_image = excluded.hero_image,
      display_order = excluded.display_order,
      published = excluded.published,
      intro_title = excluded.intro_title,
      intro_content = excluded.intro_content,
      key_applications_json = excluded.key_applications_json,
      recommended_machinery_json = excluded.recommended_machinery_json,
      target_materials_json = excluded.target_materials_json,
      cta_text = excluded.cta_text,
      cta_link = excluded.cta_link,
      meta_title = excluded.meta_title,
      meta_description = excluded.meta_description,
      image_alt = excluded.image_alt,
      updated_at = excluded.updated_at
  `).run(
    d.id,
    d.slug,
    d.countryName,
    d.region || 'International',
    d.status || 'target',
    d.flagCode || '🌐',
    d.heroImage || '/images/products/machines-collage.jpg',
    d.displayOrder ?? 0,
    d.published !== false ? 1 : 0,
    d.introTitle || '',
    d.introContent || '',
    JSON.stringify(d.keyApplications || []),
    JSON.stringify(d.recommendedMachinery || []),
    JSON.stringify(d.targetMaterials || []),
    d.ctaText || 'Request Destination Quotation',
    d.ctaLink || '/contact?intent=quote',
    d.metaTitle || '',
    d.metaDescription || '',
    d.imageAlt || '',
    d.createdAt || now,
    now
  );
  return true;
}

export function deleteDbDestination(id: string): boolean {
  const db = getDb();
  db.prepare('DELETE FROM destinations WHERE id = ?').run(id);
  return true;
}

// Blogs
export function getAllDbBlogs(publishedOnly = false): any[] {
  const db = getDb();
  const query = publishedOnly
    ? "SELECT * FROM blogs WHERE status = 'published' ORDER BY published_at DESC"
    : 'SELECT * FROM blogs ORDER BY published_at DESC';
  const rows = db.prepare(query).all() as any[];
  return rows.map((r) => ({
    ...r,
    tags: JSON.parse(r.tags_json || '[]'),
    author: JSON.parse(r.author_json || '{}'),
    readingTimeMinutes: r.read_time_minutes,
    coverImage: r.cover_image,
    seo: JSON.parse(r.seo_json || '{}'),
    publishedAt: r.published_at,
  }));
}

export function getDbBlogBySlug(slug: string, publishedOnly = false): any | null {
  const db = getDb();
  const query = publishedOnly
    ? "SELECT * FROM blogs WHERE slug = ? AND status = 'published'"
    : 'SELECT * FROM blogs WHERE slug = ?';
  const r = db.prepare(query).get(slug) as any;
  if (!r) return null;
  return {
    ...r,
    tags: JSON.parse(r.tags_json || '[]'),
    author: JSON.parse(r.author_json || '{}'),
    readingTimeMinutes: r.read_time_minutes,
    coverImage: r.cover_image,
    seo: JSON.parse(r.seo_json || '{}'),
    publishedAt: r.published_at,
  };
}

export function saveDbBlog(b: any): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO blogs (
      id, slug, title, excerpt, content, category, tags_json, author_json,
      read_time_minutes, cover_image, status, seo_json, published_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      excerpt = excluded.excerpt,
      content = excluded.content,
      category = excluded.category,
      tags_json = excluded.tags_json,
      author_json = excluded.author_json,
      read_time_minutes = excluded.read_time_minutes,
      cover_image = excluded.cover_image,
      status = excluded.status,
      seo_json = excluded.seo_json,
      published_at = excluded.published_at,
      updated_at = excluded.updated_at
  `).run(
    b.id,
    b.slug,
    b.title,
    b.excerpt || '',
    b.content || '',
    b.category || 'Industry Insights',
    JSON.stringify(b.tags || b.tags_json || []),
    JSON.stringify(b.author || b.author_json || {}),
    b.readingTimeMinutes || b.read_time_minutes || 5,
    b.coverImage || b.cover_image || '/images/hero-factory.jpg',
    b.status || 'published',
    JSON.stringify(b.seo || b.seo_json || {}),
    b.publishedAt || b.published_at || now,
    b.created_at || now,
    now
  );
  return true;
}

export function deleteDbBlog(id: string): boolean {
  const db = getDb();
  db.prepare('DELETE FROM blogs WHERE id = ?').run(id);
  return true;
}

// Enquiries
export function getAllDbEnquiries(): any[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all() as any[];
  return rows.map((r) => ({
    id: r.id,
    fullName: r.full_name,
    companyName: r.company_name,
    email: r.email,
    phone: r.phone,
    country: r.country,
    destinationCountry: r.destination_country || '',
    destinationId: r.destination_id || '',
    inquiryType: r.inquiry_type,
    productId: r.product_id,
    productName: r.product_name,
    modelSelected: r.model_selected,
    estimatedCapacityNeeded: r.estimated_capacity,
    materialToRecycle: r.material_to_recycle,
    message: r.message,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
  }));
}

export function insertDbEnquiry(enquiry: {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  country?: string;
  destinationCountry?: string;
  destinationId?: string;
  inquiryType: string;
  productId?: string;
  productName?: string;
  modelSelected?: string;
  estimatedCapacityNeeded?: string;
  materialToRecycle?: string;
  message?: string;
}): any {
  const db = getDb();
  const id = `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO enquiries (
      id, full_name, company_name, email, phone, country,
      destination_country, destination_id,
      inquiry_type, product_id, product_name, model_selected,
      estimated_capacity, material_to_recycle, message, status, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    enquiry.fullName,
    enquiry.companyName || '',
    enquiry.email,
    enquiry.phone,
    enquiry.country || 'India',
    enquiry.destinationCountry || '',
    enquiry.destinationId || '',
    enquiry.inquiryType,
    enquiry.productId || '',
    enquiry.productName || '',
    enquiry.modelSelected || '',
    enquiry.estimatedCapacityNeeded || '',
    enquiry.materialToRecycle || '',
    enquiry.message || '',
    'new',
    '',
    now
  );

  return { id, ...enquiry, status: 'new', createdAt: now };
}

export function updateDbEnquiryStatus(id: string, status: string, notes?: string): boolean {
  const db = getDb();
  if (notes !== undefined) {
    db.prepare('UPDATE enquiries SET status = ?, notes = ? WHERE id = ?').run(status, notes, id);
  } else {
    db.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, id);
  }
  return true;
}

export function deleteDbEnquiry(id: string): boolean {
  const db = getDb();
  db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);
  return true;
}

// Site Settings
export function getAllDbSettings(): Record<string, string> {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM site_settings').all() as any[];
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return map;
}

export function setDbSetting(key: string, value: string): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, value, now);
  return true;
}

// Admin Users & Auth
export function verifyAdminCredentials(username: string, passwordPlain: string): { valid: boolean; user?: any } {
  const db = getDb();
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as any;
  if (!user) return { valid: false };

  const testHash = hashPassword(passwordPlain, user.salt);
  if (testHash === user.password_hash) {
    return {
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }
  return { valid: false };
}

export function updateAdminPassword(username: string, newPasswordPlain: string): boolean {
  const db = getDb();
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(newPasswordPlain, salt);
  const result = db.prepare('UPDATE admin_users SET password_hash = ?, salt = ? WHERE username = ?').run(hash, salt, username);
  return result.changes > 0;
}
