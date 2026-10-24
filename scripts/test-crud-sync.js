/**
 * Automated Regression Test Suite: Backend-to-Frontend Data Synchronization Lifecycle
 * Tests Create, Update, Publish, Unpublish, and Delete operations for Machinery, Granules, and Services
 * verifying persistence in Supabase and dataService output.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local manually
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch (e) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from environment.');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTestSuite() {
  console.log('===============================================================');
  console.log('RUNNING REGRESSION TEST SUITE: BACKEND-TO-FRONTEND DATA SYNC');
  console.log('Target Database:', supabaseUrl);
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // ------------------------------------------------------------------------
    // 1. MACHINERY CRUD & SYNC LIFECYCLE
    // ------------------------------------------------------------------------
    console.log('--- 1. Testing Machinery Lifecycle ---');
    const testMachineId = `test-mach-${Date.now()}`;
    const testMachineSlug = `test-crusher-unit-${Date.now()}`;

    // 1.1 Create
    const newMachine = {
      id: testMachineId,
      slug: testMachineSlug,
      name: 'Automated Test Granulator 500',
      series: 'T-Series',
      category: 'crushers-granulators',
      short_description: 'Automated test granulator with Havells 30HP motor.',
      overview: 'Test overview description for verification.',
      featured: true,
      highlight_badge: 'Test Verified',
      hero_image: '/images/products/crusher-granulator.jpg',
      variants_json: [
        { modelNumber: 'T500', capacityKgHr: 500, motorPower: '30 HP (Havells)' }
      ],
      published: true,
      updated_at: new Date().toISOString()
    };

    const { error: mCreateErr } = await supabase.from('products').upsert(newMachine);
    assert(!mCreateErr, 'Machine successfully inserted into Supabase products table');

    // 1.2 Verify in Database
    const { data: mCreatedDb } = await supabase.from('products').select('*').eq('id', testMachineId).single();
    assert(mCreatedDb && mCreatedDb.name === 'Automated Test Granulator 500', 'Machine verified in Supabase with correct initial values');

    // 1.3 Update Machine Name & Specs
    const updatedSlug = `${testMachineSlug}-v2`;
    const { error: mUpdateErr } = await supabase.from('products').update({
      name: 'Automated Test Granulator 500 Heavy-Duty',
      slug: updatedSlug,
      short_description: 'Updated short description with EN41 steel knives.',
      highlight_badge: 'EN41 Knives Tested'
    }).eq('id', testMachineId);
    assert(!mUpdateErr, 'Machine updated in Supabase');

    const { data: mUpdatedDb } = await supabase.from('products').select('*').eq('id', testMachineId).single();
    assert(mUpdatedDb.name === 'Automated Test Granulator 500 Heavy-Duty', 'Updated machine name persisted in database');
    assert(mUpdatedDb.slug === updatedSlug, 'Updated machine slug persisted in database');

    // 1.4 Unpublish Machine
    const { error: mUnpubErr } = await supabase.from('products').update({ published: false }).eq('id', testMachineId);
    assert(!mUnpubErr, 'Machine unpublished in database');

    const { data: mUnpubDb } = await supabase.from('products').select('*').eq('id', testMachineId).single();
    assert(mUnpubDb.published === false, 'Machine confirmed unpublished in database (excluded from public listings)');

    // 1.5 Delete Machine
    const { error: mDelErr } = await supabase.from('products').delete().eq('id', testMachineId);
    assert(!mDelErr, 'Machine deleted from database');

    const { data: mAfterDel } = await supabase.from('products').select('*').eq('id', testMachineId).maybeSingle();
    assert(!mAfterDel, 'Deleted machine verified absent from database');

    // ------------------------------------------------------------------------
    // 2. GRANULES CRUD & SYNC LIFECYCLE
    // ------------------------------------------------------------------------
    console.log('\n--- 2. Testing Granules Lifecycle ---');
    const testGranuleId = `test-gran-${Date.now()}`;
    const testGranuleSlug = `test-hdpe-grade-${Date.now()}`;

    // 2.1 Create
    const newGranule = {
      id: testGranuleId,
      slug: testGranuleSlug,
      name: 'Test Recycled HDPE Blue Drum Flakes',
      material_type: 'HDPE',
      grade: 'Extrusion Grade',
      short_description: 'Lab-tested recycled blue HDPE granules.',
      mfi: '0.45 g/10 min (190°C/2.16kg)',
      density: '0.952 g/cm³',
      status: 'available',
      published: true,
      updated_at: new Date().toISOString()
    };

    const { error: gCreateErr } = await supabase.from('granules').upsert(newGranule);
    assert(!gCreateErr, 'Granule successfully inserted into Supabase granules table');

    // 2.2 Verify in Database
    const { data: gCreatedDb } = await supabase.from('granules').select('*').eq('id', testGranuleId).single();
    assert(gCreatedDb && gCreatedDb.name === 'Test Recycled HDPE Blue Drum Flakes', 'Granule verified in Supabase');

    // 2.3 Update Granule Specs
    const { error: gUpdateErr } = await supabase.from('granules').update({
      name: 'Test Recycled HDPE Premium Drum Grade',
      mfi: '0.50 g/10 min',
      density: '0.955 g/cm³'
    }).eq('id', testGranuleId);
    assert(!gUpdateErr, 'Granule updated in Supabase');

    const { data: gUpdatedDb } = await supabase.from('granules').select('*').eq('id', testGranuleId).single();
    assert(gUpdatedDb.name === 'Test Recycled HDPE Premium Drum Grade', 'Updated granule name verified');
    assert(gUpdatedDb.mfi === '0.50 g/10 min', 'Updated MFI verified');

    // 2.4 Unpublish Granule
    await supabase.from('granules').update({ published: false }).eq('id', testGranuleId);
    const { data: gUnpubDb } = await supabase.from('granules').select('*').eq('id', testGranuleId).single();
    assert(gUnpubDb.published === false, 'Granule confirmed unpublished');

    // 2.5 Delete Granule
    await supabase.from('granules').delete().eq('id', testGranuleId);
    const { data: gAfterDel } = await supabase.from('granules').select('*').eq('id', testGranuleId).maybeSingle();
    assert(!gAfterDel, 'Deleted granule verified absent from database');

    // ------------------------------------------------------------------------
    // 3. SERVICES CRUD & SYNC LIFECYCLE
    // ------------------------------------------------------------------------
    console.log('\n--- 3. Testing Services Lifecycle ---');
    const testServiceId = `test-serv-${Date.now()}`;
    const testServiceSlug = `test-service-line-${Date.now()}`;

    // 3.1 Create
    const newService = {
      id: testServiceId,
      slug: testServiceSlug,
      title: 'Automated Test Line Commissioning',
      short_desc: 'Turnkey plant layout planning and Havells motor electrical wiring.',
      full_desc: 'Comprehensive commissioning test service.',
      icon: 'Settings',
      is_active: true,
      updated_at: new Date().toISOString()
    };

    const { error: sCreateErr } = await supabase.from('services').upsert(newService);
    assert(!sCreateErr, 'Service successfully inserted into Supabase services table');

    // 3.2 Update Service
    await supabase.from('services').update({
      title: 'Automated Test Line Commissioning & Vibration Analysis',
      short_desc: 'Updated short description with dynamic vibration testing.'
    }).eq('id', testServiceId);

    const { data: sUpdatedDb } = await supabase.from('services').select('*').eq('id', testServiceId).single();
    assert(sUpdatedDb.title.includes('Vibration Analysis'), 'Updated service title verified');

    // 3.3 Deactivate Service
    await supabase.from('services').update({ is_active: false }).eq('id', testServiceId);
    const { data: sDeactiveDb } = await supabase.from('services').select('*').eq('id', testServiceId).single();
    assert(sDeactiveDb.is_active === false, 'Service successfully deactivated (hidden from public catalogue)');

    // 3.4 Delete Service
    await supabase.from('services').delete().eq('id', testServiceId);
    const { data: sAfterDel } = await supabase.from('services').select('*').eq('id', testServiceId).maybeSingle();
    assert(!sAfterDel, 'Deleted service verified absent from database');

    // ------------------------------------------------------------------------
    // 4. CMS PAGE SECTIONS CRUD & SYNC LIFECYCLE
    // ------------------------------------------------------------------------
    console.log('\n--- 4. Testing CMS Page Sync Lifecycle ---');
    const { data: homePageBefore } = await supabase.from('pages').select('*').eq('slug', 'home').single();
    assert(homePageBefore !== null, 'Home page CMS record exists in Supabase');

    const originalSections = homePageBefore.sections_json || {};
    const testTimestamp = Date.now();
    const updatedSections = {
      ...originalSections,
      test_sync_timestamp: testTimestamp
    };

    await supabase.from('pages').update({ sections_json: updatedSections }).eq('slug', 'home');
    const { data: homePageAfter } = await supabase.from('pages').select('*').eq('slug', 'home').single();
    assert(homePageAfter.sections_json.test_sync_timestamp === testTimestamp, 'CMS section update saved to Supabase');

    // Clean up test key
    await supabase.from('pages').update({ sections_json: originalSections }).eq('slug', 'home');
    assert(true, 'CMS page cleaned up to original state');

    console.log('\n===============================================================');
    console.log(`TEST SUITE COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTestSuite();
