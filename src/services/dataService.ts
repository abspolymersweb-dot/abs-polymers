import {
  getAllDbProducts,
  getDbProductBySlug,
  saveDbProduct,
  deleteDbProduct,
  getAllDbGranules,
  getDbGranuleBySlug,
  saveDbGranule,
  deleteDbGranule,
  getAllDbServices,
  getDbServiceBySlug,
  saveDbService,
  deleteDbService,
  getAllDbDestinations,
  getDbDestinationBySlug,
  saveDbDestination,
  deleteDbDestination,
  getAllDbBlogs,
  getDbBlogBySlug,
  saveDbBlog,
  deleteDbBlog,
  getAllDbSettings,
  setDbSetting,
  getAllDbPages,
  getDbPage,
  saveDbPage
} from '@/lib/db';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { Destination, BlogPost } from '@/types';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { COMPANY_INFO } from '@/data/company';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { SERVICES_DATA } from '@/data/services';

function parseJsonField<T>(field: any, fallback: T): T {
  if (field === null || field === undefined) return fallback;
  if (typeof field === 'object') return field as T;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export const dataService = {
  // --------------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------------
  async getProducts(slug?: string): Promise<any> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        if (slug) {
          const { data, error } = await client
            .from('products')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

          if (!error && data) {
            return this.mapProduct(data);
          }
        } else {
          const { data, error } = await client
            .from('products')
            .select('*')
            .order('featured', { ascending: false })
            .order('name', { ascending: true });

          if (!error && Array.isArray(data)) {
            return data.map((r) => this.mapProduct(r));
          }
        }
      } catch (err) {
        console.warn('Supabase product query fallback to SQLite:', err);
      }
    }

    if (slug) return getDbProductBySlug(slug);
    return getAllDbProducts();
  },

  async saveProduct(prod: any): Promise<boolean> {
    let savedInSupabase = false;
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const payload = {
          id: prod.id,
          slug: prod.slug,
          name: prod.name,
          series: prod.series || '',
          category: prod.category,
          short_description: prod.shortDescription || prod.short_description || '',
          overview: prod.overview || '',
          featured: Boolean(prod.featured),
          highlight_badge: prod.highlightBadge || prod.highlight_badge || '',
          hero_image: prod.heroImage || prod.hero_image || '',
          gallery_images_json: prod.galleryImages || prod.gallery_images_json || [],
          brochure_url: prod.brochureUrl || prod.brochure_url || '',
          compatible_materials_json: prod.compatibleMaterials || prod.compatible_materials_json || [],
          key_benefits_json: prod.keyBenefits || prod.key_benefits_json || [],
          applications_json: prod.applications || prod.applications_json || [],
          spec_columns_json: prod.specColumns || prod.spec_columns_json || [],
          variants_json: prod.variants || prod.variants_json || [],
          published: prod.published !== false,
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('products').upsert(payload);
        if (error) {
          console.error('Supabase product upsert error:', error);
          throw new Error(error.message);
        }
        savedInSupabase = true;
      } catch (err: any) {
        console.error('Supabase product save error:', err);
        throw err;
      }
    }

    try {
      saveDbProduct(prod);
    } catch (e) {
      // Ignored if SQLite read-only in serverless lambda
    }
    return savedInSupabase || true;
  },

  async deleteProduct(idOrSlug: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const { error } = await client.from('products').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
        if (error) throw new Error(error.message);
      } catch (err: any) {
        console.error('Supabase delete product error:', err);
        throw err;
      }
    }
    try {
      deleteDbProduct(idOrSlug);
    } catch (e) {
      // Ignored
    }
    return true;
  },

  mapProduct(r: any) {
    const fallback = MACHINERY_PRODUCTS.find((p) => p.slug === r.slug || p.id === r.id);
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      series: r.series !== undefined && r.series !== null ? r.series : (fallback?.series || ''),
      category: r.category !== undefined && r.category !== null ? r.category : (fallback?.category || 'crushers'),
      shortDescription: r.short_description !== undefined && r.short_description !== null ? r.short_description : (fallback?.shortDescription || ''),
      overview: r.overview !== undefined && r.overview !== null ? r.overview : (fallback?.overview || ''),
      featured: Boolean(r.featured),
      highlightBadge: r.highlight_badge !== undefined && r.highlight_badge !== null ? r.highlight_badge : (fallback?.highlightBadge || ''),
      heroImage: r.hero_image || fallback?.heroImage || '/images/products/washing-plant-line.png',
      galleryImages: parseJsonField<string[]>(r.gallery_images_json, fallback?.galleryImages || []),
      brochureUrl: r.brochure_url !== undefined && r.brochure_url !== null ? r.brochure_url : (fallback?.brochureUrl || ''),
      compatibleMaterials: parseJsonField<string[]>(r.compatible_materials_json, fallback?.compatibleMaterials || []),
      keyBenefits: parseJsonField<string[]>(r.key_benefits_json, fallback?.keyBenefits || []),
      applications: parseJsonField<string[]>(r.applications_json, fallback?.applications || []),
      specColumns: parseJsonField<any[]>(r.spec_columns_json, fallback?.specColumns || []),
      variants: parseJsonField<any[]>(r.variants_json, fallback?.variants || []),
      verifiedSpecs: parseJsonField<any[]>(r.verified_specs_json, fallback?.verifiedSpecs || []),
      awaitingConfirmationSpecs: parseJsonField<any[]>(r.awaiting_confirmation_specs_json, fallback?.awaitingConfirmationSpecs || []),
      metaTitle: r.meta_title || `${r.name} | ABS Polymers Coimbatore`,
      metaDescription: r.meta_description || r.short_description || '',
      published: r.published !== false && r.published !== 0
    };
  },

  // --------------------------------------------------------------------------
  // GRANULES
  // --------------------------------------------------------------------------
  async getGranules(slug?: string): Promise<any> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        if (slug) {
          const { data, error } = await client
            .from('granules')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

          if (!error && data) {
            return this.mapGranule(data);
          }
        } else {
          const { data, error } = await client
            .from('granules')
            .select('*')
            .order('name', { ascending: true });

          if (!error && Array.isArray(data)) {
            return data.map((r) => this.mapGranule(r));
          }
        }
      } catch (err) {
        console.warn('Supabase granules query fallback to SQLite:', err);
      }
    }

    if (slug) return getDbGranuleBySlug(slug);
    return getAllDbGranules();
  },

  async saveGranule(g: any): Promise<boolean> {
    let savedInSupabase = false;
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const payload = {
          id: g.id,
          slug: g.slug,
          name: g.name,
          material_type: g.materialType || g.material_type,
          grade: g.grade,
          appearance: g.appearance || '',
          colors_json: g.colorsAvailable || g.colors_json || [],
          mfi: g.meltFlowIndex || g.mfi || '',
          density: g.density || '',
          tensile_strength: g.tensileStrength || g.tensile_strength || '',
          short_description: g.shortDescription || g.short_description || '',
          overview: g.overview || '',
          applications_json: g.applications || g.applications_json || [],
          packaging: g.packaging || '',
          min_order_quantity: g.minOrderQuantity || g.min_order_quantity || '',
          status: g.status || 'available',
          image: g.image || '',
          verified_specs_json: g.verifiedSpecs || g.verified_specs_json || [],
          meta_title: g.metaTitle || g.meta_title || '',
          meta_description: g.metaDescription || g.meta_description || '',
          published: g.published !== false,
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('granules').upsert(payload);
        if (error) {
          console.error('Supabase granule upsert error:', error);
          throw new Error(error.message);
        }
        savedInSupabase = true;
      } catch (err: any) {
        console.error('Supabase granule save error:', err);
        throw err;
      }
    }

    try {
      saveDbGranule(g);
    } catch (e) {
      // Ignored
    }
    return savedInSupabase || true;
  },

  async deleteGranule(idOrSlug: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const { error } = await client.from('granules').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
        if (error) throw new Error(error.message);
      } catch (err: any) {
        console.error('Supabase delete granule error:', err);
        throw err;
      }
    }
    try {
      deleteDbGranule(idOrSlug);
    } catch (e) {
      // Ignored
    }
    return true;
  },

  mapGranule(r: any) {
    const fallback = GRANULE_PRODUCTS.find((g) => g.slug === r.slug || g.id === r.id);
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      materialType: r.material_type || fallback?.materialType || 'HDPE',
      grade: r.grade || fallback?.grade || '',
      appearance: r.appearance || fallback?.appearance || '',
      colorsAvailable: parseJsonField<string[]>(r.colors_json, fallback?.colorsAvailable || []),
      meltFlowIndex: r.mfi || fallback?.meltFlowIndex || '',
      density: r.density || fallback?.density || '',
      tensileStrength: r.tensile_strength || fallback?.tensileStrength || '',
      shortDescription: r.short_description || fallback?.shortDescription || '',
      overview: r.overview || fallback?.overview || '',
      applications: parseJsonField<string[]>(r.applications_json, fallback?.applications || []),
      packaging: r.packaging || fallback?.packaging || '',
      minOrderQuantity: r.min_order_quantity || fallback?.minOrderQuantity || '',
      status: r.status || fallback?.status || 'available',
      image: r.image || fallback?.image || '/images/hero-reference.jpg',
      verifiedSpecs: parseJsonField<any[]>(r.verified_specs_json, fallback?.verifiedSpecs || []),
      metaTitle: r.meta_title || fallback?.metaTitle || `${r.name} | ABS Polymers`,
      metaDescription: r.meta_description || fallback?.metaDescription || r.short_description || '',
      published: r.published !== false && r.published !== 0
    };
  },

  // --------------------------------------------------------------------------
  // SERVICES
  // --------------------------------------------------------------------------
  async getServices(slug?: string): Promise<any> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        if (slug) {
          const { data, error } = await client
            .from('services')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

          if (!error && data) return this.mapService(data);
        } else {
          const { data, error } = await client
            .from('services')
            .select('*')
            .order('title', { ascending: true });

          if (!error && Array.isArray(data)) {
            return data.map((r) => this.mapService(r));
          }
        }
      } catch (err) {
        console.warn('Supabase services query fallback to SQLite:', err);
      }
    }

    if (slug) return getDbServiceBySlug(slug);
    return getAllDbServices();
  },

  async saveService(s: any): Promise<boolean> {
    let savedInSupabase = false;
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const payload = {
          id: s.id,
          slug: s.slug,
          title: s.title,
          short_desc: s.shortDescription || s.short_desc || '',
          full_desc: s.fullDescription || s.full_desc || '',
          icon: s.iconName || s.icon || 'Wrench',
          image: s.image || '',
          process_steps_json: s.processSteps || s.process_steps_json || [],
          deliverables_json: s.deliverables || s.deliverables_json || [],
          is_active: s.isActive !== false,
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('services').upsert(payload);
        if (error) {
          console.error('Supabase service upsert error:', error);
          throw new Error(error.message);
        }
        savedInSupabase = true;
      } catch (err: any) {
        console.error('Supabase service save error:', err);
        throw err;
      }
    }

    try {
      saveDbService(s);
    } catch (e) {
      // Ignored
    }
    return savedInSupabase || true;
  },

  async deleteService(idOrSlug: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const { error } = await client.from('services').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
        if (error) throw new Error(error.message);
      } catch (err: any) {
        console.error('Supabase delete service error:', err);
        throw err;
      }
    }
    try {
      deleteDbService(idOrSlug);
    } catch (e) {
      // Ignored
    }
    return true;
  },

  mapService(r: any) {
    const fallback = SERVICES_DATA.find((s) => s.slug === r.slug || s.id === r.id);
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      shortDescription: r.short_desc || r.shortDescription || fallback?.shortDescription || '',
      fullDescription: r.full_desc || r.fullDescription || fallback?.fullDescription || '',
      iconName: r.icon || r.iconName || fallback?.iconName || 'Wrench',
      image: r.image || fallback?.image || '',
      processSteps: parseJsonField<any[]>(r.process_steps_json, fallback?.processSteps || []),
      deliverables: parseJsonField<string[]>(r.deliverables_json, fallback?.deliverables || []),
      isActive: r.is_active !== undefined ? Boolean(r.is_active) : (r.isActive !== undefined ? Boolean(r.isActive) : true),
      leadTimeWeeks: r.lead_time_weeks || fallback?.leadTimeWeeks || '2-4 weeks',
      warrantyYears: r.warranty_years || fallback?.warrantyYears || '1 year'
    };
  },

  // --------------------------------------------------------------------------
  // DESTINATIONS
  // --------------------------------------------------------------------------
  async getDestinations(slug?: string, publishedOnly = false): Promise<any> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        if (slug) {
          let query = client.from('destinations').select('*').eq('slug', slug);
          if (publishedOnly) query = query.eq('published', true);
          const { data, error } = await query.maybeSingle();
          if (!error && data) return this.mapDestination(data);
        } else {
          let query = client
            .from('destinations')
            .select('*')
            .order('display_order', { ascending: true })
            .order('country_name', { ascending: true });

          if (publishedOnly) query = query.eq('published', true);
          const { data, error } = await query;
          if (!error && Array.isArray(data)) {
            return data.map((r) => this.mapDestination(r));
          }
        }
      } catch (err) {
        console.warn('Supabase destinations query fallback to SQLite:', err);
      }
    }

    if (slug) return getDbDestinationBySlug(slug, publishedOnly);
    return getAllDbDestinations(publishedOnly);
  },

  async saveDestination(d: any): Promise<boolean> {
    let savedInSupabase = false;
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const payload = {
          id: d.id,
          slug: d.slug,
          country_name: d.countryName || d.country_name,
          region: d.region || '',
          status: d.status || 'target',
          flag_code: d.flagCode || d.flag_code || '',
          hero_image: d.heroImage || d.hero_image || '',
          display_order: Number(d.displayOrder || d.display_order || 0),
          published: d.published !== false,
          intro_title: d.introTitle || d.intro_title || '',
          intro_content: d.introContent || d.intro_content || '',
          key_applications_json: d.keyApplications || d.key_applications_json || [],
          recommended_machinery_json: d.recommendedMachinery || d.recommended_machinery_json || [],
          target_materials_json: d.targetMaterials || d.target_materials_json || [],
          cta_text: d.ctaText || d.cta_text || 'Request Destination Quotation',
          cta_link: d.ctaLink || d.cta_link || '/contact?intent=quote',
          meta_title: d.metaTitle || d.meta_title || '',
          meta_description: d.metaDescription || d.meta_description || '',
          image_alt: d.imageAlt || d.image_alt || '',
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('destinations').upsert(payload);
        if (error) {
          console.error('Supabase destination upsert error:', error);
          throw new Error(error.message);
        }
        savedInSupabase = true;
      } catch (err: any) {
        console.error('Supabase destination save error:', err);
        throw err;
      }
    }

    try {
      saveDbDestination(d);
    } catch (e) {
      // Ignored
    }
    return savedInSupabase || true;
  },

  async deleteDestination(idOrSlug: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const { error } = await client
          .from('destinations')
          .delete()
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
        if (error) throw new Error(error.message);
      } catch (err: any) {
        console.error('Supabase delete destination error:', err);
        throw err;
      }
    }
    try {
      deleteDbDestination(idOrSlug);
    } catch (e) {
      // Ignored
    }
    return true;
  },

  mapDestination(r: any): Destination {
    return {
      id: r.id,
      slug: r.slug,
      countryName: r.country_name,
      region: r.region,
      status: r.status as 'established' | 'target',
      flagCode: r.flag_code || '',
      heroImage: r.hero_image || '',
      displayOrder: r.display_order ?? 0,
      published: Boolean(r.published),
      introTitle: r.intro_title || '',
      introContent: r.intro_content || '',
      keyApplications: parseJsonField<string[]>(r.key_applications_json, []),
      recommendedMachinery: parseJsonField<{ name: string; slug: string; role: string }[]>(r.recommended_machinery_json, []),
      targetMaterials: parseJsonField<string[]>(r.target_materials_json, []),
      ctaText: r.cta_text || 'Request Destination Quotation',
      ctaLink: r.cta_link || '/contact?intent=quote',
      metaTitle: r.meta_title || '',
      metaDescription: r.meta_description || '',
      imageAlt: r.image_alt || '',
      createdAt: r.created_at || new Date().toISOString(),
      updatedAt: r.updated_at || new Date().toISOString()
    };
  },

  // --------------------------------------------------------------------------
  // BLOGS
  // --------------------------------------------------------------------------
  async getBlogs(slug?: string, publishedOnly = false): Promise<any> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        if (slug) {
          let query = client.from('blogs').select('*').eq('slug', slug);
          if (publishedOnly) query = query.eq('status', 'published');
          const { data, error } = await query.maybeSingle();
          if (!error && data) return this.mapBlog(data);
        } else {
          let query = client
            .from('blogs')
            .select('*')
            .order('published_at', { ascending: false });

          if (publishedOnly) query = query.eq('status', 'published');
          const { data, error } = await query;
          if (!error && Array.isArray(data)) {
            return data.map((r) => this.mapBlog(r));
          }
        }
      } catch (err) {
        console.warn('Supabase blogs query fallback to SQLite:', err);
      }
    }

    if (slug) return getDbBlogBySlug(slug, publishedOnly);
    return getAllDbBlogs(publishedOnly);
  },

  async saveBlog(b: any): Promise<boolean> {
    let savedInSupabase = false;
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const payload = {
          id: b.id,
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt || '',
          content: b.content || '',
          category: b.category || 'Industry Insights',
          tags_json: b.tags || b.tags_json || [],
          author_json: b.author || b.author_json || {},
          read_time_minutes: Number(b.readingTimeMinutes || b.read_time_minutes || 5),
          cover_image: b.coverImage || b.cover_image || '',
          status: b.status || 'published',
          seo_json: b.seo || b.seo_json || {},
          published_at: b.publishedAt || b.published_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('blogs').upsert(payload);
        if (!error) savedInSupabase = true;
      } catch (err) {
        console.warn('Supabase blog save fallback to SQLite:', err);
      }
    }

    try {
      saveDbBlog(b);
    } catch (e) {
      // Ignored
    }
    return savedInSupabase || true;
  },

  async deleteBlog(idOrSlug: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        await client.from('blogs').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
      } catch (err) {
        console.warn('Supabase delete blog error:', err);
      }
    }
    try {
      deleteDbBlog(idOrSlug);
    } catch (e) {
      // Ignored
    }
    return true;
  },

  mapBlog(r: any): BlogPost {
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt || '',
      content: r.content || '',
      category: r.category || 'Industry Insights',
      tags: parseJsonField<string[]>(r.tags_json, []),
      author: parseJsonField<any>(r.author_json, {
        name: 'Technical Editorial Team',
        role: 'ABS Polymers Engineering',
        avatar: '/images/logo.png'
      }),
      readingTimeMinutes: r.read_time_minutes ?? 5,
      coverImage: r.cover_image || '/images/hero-factory.jpg',
      status: (r.status as 'draft' | 'published') || 'published',
      publishedAt: r.published_at || new Date().toISOString(),
      seo: parseJsonField<any>(r.seo_json, {
        metaTitle: r.title,
        metaDescription: r.excerpt,
        primaryKeyword: ''
      })
    };
  },

  // --------------------------------------------------------------------------
  // SITE SETTINGS
  // --------------------------------------------------------------------------
  async getSettings(): Promise<Record<string, string>> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const { data, error } = await client.from('site_settings').select('*');
        if (!error && Array.isArray(data)) {
          const dict: Record<string, string> = {};
          data.forEach((r) => {
            dict[r.key] = r.value;
          });
          return dict;
        }
      } catch (err) {
        console.warn('Supabase settings query fallback to SQLite:', err);
      }
    }

    return getAllDbSettings();
  },

  async saveSettings(settings: Record<string, string>): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const rows = Object.entries(settings).map(([key, value]) => ({
          key,
          value: String(value),
          updated_at: new Date().toISOString()
        }));
        const { error } = await client.from('site_settings').upsert(rows);
        if (error) {
          console.error('Supabase settings save error:', error);
          throw new Error(error.message);
        }
      } catch (err) {
        console.error('Supabase settings save failed:', err);
        throw err;
      }
    }

    try {
      for (const [k, v] of Object.entries(settings)) {
        setDbSetting(k, String(v));
      }
    } catch (e) {
      // Ignored
    }
    return true;
  },

  async getCompanyInfo(): Promise<typeof COMPANY_INFO & { creator: { attribution: string; url: string } }> {
    try {
      const [settings, pages] = await Promise.all([
        this.getSettings(),
        this.getPages()
      ]);

      const contactPage = pages?.contact?.sections || {};
      const contactDetails = contactPage.contactDetails || {};
      const footerPage = pages?.footer?.sections || {};

      const phone = settings.phone || contactDetails.phone || footerPage.phone || COMPANY_INFO.contact.phone;
      const phoneDisplay = phone;
      const whatsapp = settings.whatsapp || contactDetails.whatsapp || footerPage.whatsapp || COMPANY_INFO.contact.whatsapp;
      const whatsappDisplay = whatsapp;
      const email = settings.email || contactDetails.salesEmail || footerPage.salesEmail || COMPANY_INFO.contact.salesEmail;
      const address = settings.factory_address || contactDetails.address || footerPage.factoryAddress || COMPANY_INFO.location.address;
      const workingHours = contactDetails.workingHours || footerPage.workingHours || COMPANY_INFO.contact.workingHours;
      const companySummary = footerPage.companySummary || COMPANY_INFO.shortAbout;
      const name = settings.company_name || COMPANY_INFO.name;

      const creatorAttribution = footerPage.creatorText || (footerPage.sections && footerPage.sections.creatorText) || settings.creator_attribution || 'Created by dawnexus';
      const creatorUrl = footerPage.creatorUrl || (footerPage.sections && footerPage.sections.creatorUrl) || settings.creator_url || 'https://dawnexus.in';

      return {
        ...COMPANY_INFO,
        name,
        shortAbout: companySummary,
        location: {
          ...COMPANY_INFO.location,
          address
        },
        contact: {
          ...COMPANY_INFO.contact,
          phone,
          phoneDisplay,
          whatsapp,
          whatsappDisplay,
          email,
          salesEmail: email,
          supportEmail: email,
          workingHours
        },
        creator: {
          attribution: creatorAttribution,
          url: creatorUrl
        }
      };
    } catch (err) {
      console.warn('Error building dynamic company info, fallback to static:', err);
      return {
        ...COMPANY_INFO,
        creator: {
          attribution: 'Created by dawnexus',
          url: 'https://dawnexus.in'
        }
      };
    }
  },

  // --------------------------------------------------------------------------
  // PAGES & CMS STORE
  // --------------------------------------------------------------------------
  async getPages(): Promise<Record<string, any>> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const { data, error } = await client.from('pages').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          const dict: Record<string, any> = {};
          data.forEach((r) => {
            dict[r.slug] = {
              title: r.title,
              seo: {
                metaTitle: r.meta_title || '',
                metaDescription: r.meta_description || '',
                ogImage: r.og_image || ''
              },
              sections: parseJsonField<any>(r.sections_json, {})
            };
          });
          return dict;
        }
      } catch (err) {
        console.warn('Supabase pages query fallback to SQLite:', err);
      }
    }

    return getAllDbPages();
  },

  async getPage(slug: string): Promise<any | null> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const { data, error } = await client
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          return {
            title: data.title,
            seo: {
              metaTitle: data.meta_title || '',
              metaDescription: data.meta_description || '',
              ogImage: data.og_image || ''
            },
            sections: parseJsonField<any>(data.sections_json, {})
          };
        }
      } catch (err) {
        console.warn('Supabase page query fallback to SQLite:', err);
      }
    }

    return getDbPage(slug);
  },

  async savePage(slug: string, pageData: any): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseAdmin();
        const payload = {
          slug,
          title: pageData.title || slug.toUpperCase(),
          meta_title: pageData.seo?.metaTitle || '',
          meta_description: pageData.seo?.metaDescription || '',
          og_image: pageData.seo?.ogImage || '',
          sections_json: pageData.sections || {},
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('pages').upsert(payload);
        if (error) {
          console.error('Supabase page upsert error:', error);
          throw new Error(error.message);
        }
      } catch (err: any) {
        console.error('Supabase page save error:', err);
        throw err;
      }
    }

    try {
      saveDbPage(slug, pageData);
    } catch (e) {
      // Ignored
    }
    return true;
  }
};
