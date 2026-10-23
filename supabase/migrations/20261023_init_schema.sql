-- ==============================================================================
-- ABS POLYMERS — SUPABASE PRODUCTION DATABASE SCHEMA & INITIAL SEEDING
-- Target Database: PostgreSQL (Supabase)
-- ==============================================================================

-- 1. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CMS Pages & Section Content
CREATE TABLE IF NOT EXISTS public.pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  sections_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Media Assets Library
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  width INTEGER DEFAULT 0,
  height INTEGER DEFAULT 0,
  alt_text TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Machinery Catalogue Products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  series TEXT DEFAULT '',
  category TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  highlight_badge TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  gallery_images_json JSONB DEFAULT '[]'::jsonb,
  brochure_url TEXT DEFAULT '',
  compatible_materials_json JSONB DEFAULT '[]'::jsonb,
  key_benefits_json JSONB DEFAULT '[]'::jsonb,
  applications_json JSONB DEFAULT '[]'::jsonb,
  spec_columns_json JSONB DEFAULT '[]'::jsonb,
  variants_json JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Recycled Granules Catalogue
CREATE TABLE IF NOT EXISTS public.granules (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  material_type TEXT NOT NULL,
  grade TEXT NOT NULL,
  appearance TEXT DEFAULT '',
  colors_json JSONB DEFAULT '[]'::jsonb,
  mfi TEXT DEFAULT '',
  density TEXT DEFAULT '',
  tensile_strength TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  applications_json JSONB DEFAULT '[]'::jsonb,
  packaging TEXT DEFAULT '',
  min_order_quantity TEXT DEFAULT '',
  status TEXT DEFAULT 'available',
  image TEXT DEFAULT '',
  verified_specs_json JSONB DEFAULT '[]'::jsonb,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Industrial Services & Spares
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_desc TEXT DEFAULT '',
  full_desc TEXT DEFAULT '',
  icon TEXT DEFAULT 'Wrench',
  image TEXT DEFAULT '',
  process_steps_json JSONB DEFAULT '[]'::jsonb,
  deliverables_json JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Technical Blogs & Insights
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'Industry Insights',
  tags_json JSONB DEFAULT '[]'::jsonb,
  author_json JSONB DEFAULT '{}'::jsonb,
  read_time_minutes INTEGER DEFAULT 5,
  cover_image TEXT DEFAULT '',
  status TEXT DEFAULT 'published',
  seo_json JSONB DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Global Destinations & Export Corridors
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  country_name TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT DEFAULT 'target',
  flag_code TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  intro_title TEXT DEFAULT '',
  intro_content TEXT DEFAULT '',
  key_applications_json JSONB DEFAULT '[]'::jsonb,
  recommended_machinery_json JSONB DEFAULT '[]'::jsonb,
  target_materials_json JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT DEFAULT 'Request Destination Quotation',
  cta_link TEXT DEFAULT '/contact?intent=quote',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  image_alt TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Customer & Commercial Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  company_name TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  destination_country TEXT DEFAULT '',
  destination_id TEXT DEFAULT '',
  inquiry_type TEXT NOT NULL,
  product_id TEXT DEFAULT '',
  product_name TEXT DEFAULT '',
  model_selected TEXT DEFAULT '',
  estimated_capacity TEXT DEFAULT '',
  material_to_recycle TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Admin Users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Query Speed
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_granules_slug ON public.granules(slug);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.granules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public READ policies for published content
DROP POLICY IF EXISTS "Allow public read on published products" ON public.products;
CREATE POLICY "Allow public read on published products" ON public.products
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Allow public read on published granules" ON public.granules;
CREATE POLICY "Allow public read on published granules" ON public.granules
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Allow public read on active services" ON public.services;
CREATE POLICY "Allow public read on active services" ON public.services
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read on published blogs" ON public.blogs;
CREATE POLICY "Allow public read on published blogs" ON public.blogs
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Allow public read on published destinations" ON public.destinations;
CREATE POLICY "Allow public read on published destinations" ON public.destinations
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Allow public read on pages" ON public.pages;
CREATE POLICY "Allow public read on pages" ON public.pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on site_settings" ON public.site_settings;
CREATE POLICY "Allow public read on site_settings" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on media_assets" ON public.media_assets;
CREATE POLICY "Allow public read on media_assets" ON public.media_assets
  FOR SELECT USING (true);

-- Public INSERT policy for visitor enquiries
DROP POLICY IF EXISTS "Allow public inquiry submissions" ON public.enquiries;
CREATE POLICY "Allow public inquiry submissions" ON public.enquiries
  FOR INSERT WITH CHECK (true);

-- Service Role Key retains full bypass permissions across all tables automatically.

