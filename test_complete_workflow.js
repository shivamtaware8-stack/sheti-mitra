/* ============================================================================
   ShetiMitra AI — Complete end-to-end verification suite. Run: npm test
   Covers: health, crops, products, scans, scan upload (all 10 crops),
   low-confidence gating, crop mismatch, model unavailable, product
   suppression, purchase links, signup, duplicate signup, login, logout,
   user-specific scan history, legacy scan-row preservation.

   Spawns its own server instances (dedicated ports + temp files) and kills
   them when done — never touches a developer's running server.
   ============================================================================ */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, 'data/sheti-mitra.db');
const TEST_IMG = path.resolve(__dirname, 'public/img/mancozeb.svg');
const REAL_LABELS = path.resolve(__dirname, 'models/plantvillage-labels.json');

const CROPS = [
  'tomato', 'potato', 'grape', 'cotton', 'soybean',
  'onion', 'chilli', 'pepper', 'wheat', 'triticale'
];

const VALID_SCAN_STATUSES = [
  'diagnosed', 'uncertain', 'crop_mismatch',
  'model_unavailable', 'model_unconfigured', 'demo'
];

let passCount = 0;
let failCount = 0;

function check(name, condition, detail = '') {
  if (condition) {
    passCount += 1;
    console.log(`  PASS ${name}`);
  } else {
    failCount += 1;
    console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

/* ---------------- HTTP + cookie helpers ---------------- */

function extractSessionCookie(res) {
  const raw = res.headers.get('set-cookie');
  if (!raw) return null;
  const match = /sm_session=([^;]*)/.exec(raw);
  return match && match[1] ? `sm_session=${match[1]}` : null;
}

async function api(base, cookie, route, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(`${base}${route}`, { ...opts, headers });
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data, cookie: extractSessionCookie(res) };
}

async function uploadScan(base, cookie, crop) {
  const fd = new FormData();
  fd.append('image', new Blob([fs.readFileSync(TEST_IMG)], { type: 'image/svg+xml' }), `${crop}.svg`);
  fd.append('crop', crop);
  const headers = {};
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(`${base}/api/scan`, { method: 'POST', headers, body: fd });
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data };
}

/* ---------------- server lifecycle ---------------- */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth(base, timeoutMs = 90000) {
  const start = Date.now();
  for (;;) {
    try {
      const res = await fetch(`${base}/api/health`);
      if (res.ok) {
        const body = await res.json();
        if (body && body.status === 'ok') return body;
      }
    } catch { /* not up yet */ }
    if (Date.now() - start > timeoutMs) throw new Error(`server at ${base} never became healthy`);
    await sleep(1500);
  }
}

async function withServer(env, fn) {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: __dirname,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', () => {});
  child.stderr.on('data', () => {});
  const base = `http://localhost:${env.PORT}`;
  try {
    await waitForHealth(base);
    await fn(base);
  } finally {
    child.kill('SIGKILL');
    await sleep(500);
  }
}

/* ---------------- fixtures for deterministic status tests ---------------- */

function makeMismatchLabels() {
  // Every class claims crop 'potato' while the test scans crop 'tomato':
  // the provider must return status 'crop_mismatch' (no tomato classes to
  // condition on), deterministically, for any model output.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sm-mismatch-'));
  const src = JSON.parse(fs.readFileSync(REAL_LABELS, 'utf8'));
  const dest = {
    ...src,
    classes: src.classes.map((c) => ({ ...c, crop: 'potato' }))
  };
  const file = path.join(dir, 'mismatch-labels.json');
  fs.writeFileSync(file, JSON.stringify(dest));
  return file;
}

function makeCorruptModel() {
  // A file that EXISTS (so isDiagnosisConfigured passes) but cannot load —
  // loading must fail and the server must answer status 'model_unavailable'.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sm-broken-'));
  const file = path.join(dir, 'corrupt-model.onnx');
  fs.writeFileSync(file, 'this is not a valid onnx model');
  return file;
}



async function phaseMain(base, ctx, stamp) {
  console.log('\n--- Phase 1: main server (default config) ---\n');

  // 1. API health
  console.log('1. API health');
  const health = await api(base, null, '/api/health');
  check('GET /api/health returns 200', health.status === 200);
  check('health payload has status ok', health.data?.status === 'ok');

  // 2. Crops
  console.log('\n2. Crops');
  const cropsRes = await api(base, null, '/api/crops');
  check('GET /api/crops returns 200', cropsRes.status === 200);
  check(
    'all 10 supported crops present',
    Array.isArray(cropsRes.data) && CROPS.every((c) => cropsRes.data.includes(c)),
    JSON.stringify(cropsRes.data)
  );

  // 3. Products + purchase links
  console.log('\n3. Products & purchase links');
  const productsRes = await api(base, null, '/api/products');
  check('GET /api/products returns 200', productsRes.status === 200);
  const products = productsRes.data;
  check('11 seeded products present', Array.isArray(products) && products.length === 11, `got ${products?.length}`);
  const requiredFields = ['name', 'brand', 'activeIngredient', 'formulation', 'packSize', 'image', 'verificationStatus', 'suitableCrop', 'targetDisease'];
  check(
    'products carry all recommendation fields',
    products.every((p) => requiredFields.every((f) => p[f] !== undefined && p[f] !== null && p[f] !== ''))
  );
  const allLinks = products.flatMap((p) => (Array.isArray(p.purchaseLinks) ? p.purchaseLinks : []));
  check('33 seeded purchase links surfaced', allLinks.length === 33, `got ${allLinks.length}`);
  check('every purchase link is HTTPS (no invented URLs)', allLinks.every((l) => typeof l.url === 'string' && l.url.startsWith('https://')));
  check('no fabricated prices (all null without seller feed)', products.every((p) => p.price === null));
  check(
    'every product says Price unavailable',
    products.every((p) => typeof p.priceStatus === 'string' && p.priceStatus.toLowerCase().includes('unavailable'))
  );

  // 4. Anonymous scans stay private
  console.log('\n4. Anonymous scan history');
  const anonScans = await api(base, null, '/api/scans');
  check('GET /api/scans (anonymous) returns []', anonScans.status === 200 && Array.isArray(anonScans.data) && anonScans.data.length === 0, JSON.stringify(anonScans.data));

  // 5. Scan upload validation
  console.log('\n5. Scan upload validation');
  const missingImg = await api(base, null, '/api/scan', { method: 'POST', body: new URLSearchParams({ crop: 'tomato' }) });
  check('scan without image returns 400', missingImg.status === 400);
  const badCrop = await uploadScan(base, null, 'durian');
  check('scan with unsupported crop returns 400', badCrop.status === 400 && badCrop.data?.error === 'unsupported_crop');

  // 6. All 10 crops — every crop must return HTTP 200 + a real status

  const results = [];
  for (const crop of CROPS) {
    const r = await uploadScan(base, null, crop);
    const ok = r.status === 200 && r.data && VALID_SCAN_STATUSES.includes(r.data.status);
    check(`scan ${crop} → HTTP 200 + valid status (${r.data?.status}/${r.data?.mode})`, ok, `HTTP ${r.status}`);
    if (ok) results.push({ crop, ...r.data });
  }
  check('all 10 crops scanned', results.length === 10, `got ${results.length}`);

  const modelCrops = results.filter((r) => r.mode === 'model');
  const demoCrops = results.filter((r) => r.mode === 'demo');
  console.log(`   model-backed: ${modelCrops.length} | demo fallback: ${demoCrops.length}`);
  check('3 model-backed crops (tomato/potato/pepper)', modelCrops.length === 3, modelCrops.map((r) => r.crop).join(','));
  check('7 demo fallback crops', demoCrops.length === 7, demoCrops.map((r) => r.crop).join(','));

  // 7. Low-confidence handling on default server (tomato SVG scan < 0.80)
  console.log('\n7. Low-confidence safety gating');
  const tomato = results.find((r) => r.crop === 'tomato');
  check('tomato scan ran through the real model', Boolean(tomato) && tomato.mode === 'model');
  if (tomato && tomato.mode === 'model') {
    check('low-confidence model result returns status uncertain', tomato.status === 'uncertain', `status=${tomato.status}`);
    check('confidence below 0.80 is flagged', tomato.belowMinimumConfidence === true && Number(tomato.confidence) < Number(tomato.minimumConfidence));
    check('PRODUCT SUPPRESSION: uncertain result returns zero products', Array.isArray(tomato.products) && tomato.products.length === 0);
  }

  // 8. Demo results never recommend products
  console.log('\n8. Demo product suppression');
  check(
    'all demo results return zero products',
    demoCrops.every((r) => Array.isArray(r.products) && r.products.length === 0),
    demoCrops.filter((r) => (r.products || []).length).map((r) => r.crop).join(',')
  );

  // 9. Medicine recommendation ENGINE (data layer): a linked disease must
  //    return verified products with full fields + real purchase links.
  console.log('\n9. Medicine recommendation flow (data layer)');
  const db = await import('./db.js');
  const linked = db.getProductsForDisease('tomato', 'tomato_early_blight');
  check('tomato early_blight returns verified products', linked.length >= 2, `got ${linked.length}`);
  check(
    'recommended products have full detail + purchase links',
    linked.every((p) => p.name && p.brand && p.activeIngredient && p.manufacturer && p.verificationStatus && Array.isArray(p.purchaseLinks) && p.purchaseLinks.length > 0)
  );
  console.log(`   (info: ${linked.length} products for tomato early_blight)`);

  // 10. Signup
  console.log('\n10. Auth: signup');
  const mobileA = `98${stamp}`;
  const mobileB = `97${stamp}`;
  const emailA = `farmer.a.${stamp}@example.in`;
  const signup = await api(base, null, '/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Farmer A', mobile: mobileA, email: emailA, password: 'secret123', confirmPassword: 'secret123' })
  });
  check('signup returns 201 + user + session cookie', signup.status === 201 && signup.data?.user?.mobile === mobileA && Boolean(signup.cookie), `HTTP ${signup.status}`);
  check('signup never returns a password hash', signup.data?.user && !('password_hash' in signup.data.user));
  ctx.cookieA = signup.cookie;
  ctx.mobileA = mobileA;
  ctx.emailA = emailA;
  ctx.mobileB = mobileB;

  // 11. Duplicate signup rejections
  console.log('\n11. Auth: duplicate signup');
  const dupMobile = await api(base, null, '/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Clone', mobile: mobileA, password: 'secret123', confirmPassword: 'secret123' })
  });
  check('duplicate mobile returns 409 duplicate_mobile', dupMobile.status === 409 && dupMobile.data?.error === 'duplicate_mobile', `HTTP ${dupMobile.status}`);
  const dupEmail = await api(base, null, '/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Clone', mobile: mobileB, email: emailA, password: 'secret123', confirmPassword: 'secret123' })
  });
  check('duplicate email returns 409 duplicate_email', dupEmail.status === 409 && dupEmail.data?.error === 'duplicate_email', `HTTP ${dupEmail.status}`);

  // 12. Login / me
  console.log('\n12. Auth: login/me');
  const loginRes = await api(base, null, '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: mobileA, password: 'secret123' })
  });
  check('login with mobile returns 200 + cookie', loginRes.status === 200 && Boolean(loginRes.cookie));
  const loginEmail = await api(base, null, '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: emailA, password: 'secret123' })
  });
  check('login with email returns 200', loginEmail.status === 200 && loginEmail.data?.user?.name === 'Test Farmer A');
  const badPw = await api(base, null, '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: mobileA, password: 'wrong-pass' })
  });
  check('wrong password returns 401 invalid_credentials', badPw.status === 401 && badPw.data?.error === 'invalid_credentials');
  const me = await api(base, loginRes.cookie, '/api/auth/me');
  check('GET /api/auth/me returns the user', me.status === 200 && me.data?.user?.mobile === mobileA);
  ctx.cookieA = loginRes.cookie;

  // 13. User-specific scan history
  console.log('\n13. User-specific scan history');
  const aScan = await uploadScan(base, ctx.cookieA, 'tomato');
  check('logged-in scan returns HTTP 200', aScan.status === 200);
  const aHist = await api(base, ctx.cookieA, '/api/scans');
  check(
    "user A sees only their own scans",
    aHist.status === 200 && Array.isArray(aHist.data) && aHist.data.length >= 1 && aHist.data[0].crop === 'tomato'
  );
  const signupB = await api(base, null, '/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Farmer B', mobile: ctx.mobileB, password: 'secret123', confirmPassword: 'secret123' })
  });
  check('second user signup returns 201', signupB.status === 201);
  const bHist = await api(base, signupB.cookie, '/api/scans');
  check("user B never sees user A's scans", Array.isArray(bHist.data) && bHist.data.length === 0, JSON.stringify(bHist.data));

  // 14. Logout
  console.log('\n14. Auth: logout');
  const lo = await api(base, ctx.cookieA, '/api/auth/logout', { method: 'POST' });
  check('logout returns 200', lo.status === 200);
  const afterLo = await api(base, ctx.cookieA, '/api/auth/me');
  check('session invalid after logout', afterLo.data?.user === null);
}

async function phaseStatuses(mismatchFile, corruptFile) {
  // 15. Uncertain via raised threshold
  console.log('\n--- Phase 2: raised threshold (CROP_DIAGNOSIS_MIN_CONFIDENCE=1.0) ---\n');
  console.log('15. Forced low-confidence (threshold 1.0)');
  await withServer({ PORT: '3457', CROP_DIAGNOSIS_MIN_CONFIDENCE: '1.0' }, async (base) => {
    const r = await uploadScan(base, null, 'tomato');
    if (Number(r.data?.confidence) >= 1) {
      console.log('   (unexpected saturated confidence — strict check skipped)');
    }
    check('model result below threshold returns status uncertain', r.data?.status === 'uncertain', `status=${r.data?.status}`);
    check('minimumConfidence echo is 1', Number(r.data?.minimumConfidence) === 1);
    check('PRODUCT SUPPRESSION: zero products', Array.isArray(r.data?.products) && r.data.products.length === 0);
  });

  // 16. Crop mismatch via labels that claim every class is potato
  console.log('\n--- Phase 3: mismatched labels (all classes are potato) ---\n');
  console.log('16. Crop mismatch');
  await withServer({ PORT: '3458', CROP_DISEASE_LABELS_PATH: mismatchFile }, async (base) => {
    const r = await uploadScan(base, null, 'tomato');
    check('status is crop_mismatch (never a fake disease)', r.data?.status === 'crop_mismatch', `status=${r.data?.status}`);
    check('detected crop is reported', Boolean(r.data?.detectedCrop), JSON.stringify(r.data?.detectedCrop));
    check('prediction is null (no fake diagnosis)', r.data?.prediction === null);
    check('PRODUCT SUPPRESSION: zero products', Array.isArray(r.data?.products) && r.data.products.length === 0);
  });

  // 17. Model unavailable via corrupt model file
  console.log('\n--- Phase 4: corrupt model file ---\n');
  console.log('17. Model unavailable');
  await withServer({ PORT: '3459', CROP_DISEASE_MODEL_PATH: corruptFile }, async (base) => {
    const r = await uploadScan(base, null, 'tomato');
    check('status is model_unavailable (never a fake demo)', r.data?.status === 'model_unavailable', `status=${r.data?.status}`);
    check('prediction is null (no fake diagnosis)', r.data?.prediction === null);
    check('PRODUCT SUPPRESSION: zero products', Array.isArray(r.data?.products) && r.data.products.length === 0);
  });
}

async function runTests() {
  console.log('=== SHETIMITRA COMPLETE END-TO-END VERIFICATION ===');
  const stamp = String(Date.now()).slice(-8);
  const ctx = {};

  const mismatchFile = makeMismatchLabels();
  const corruptFile = makeCorruptModel();

  console.log('\n--- Phase 1: main server ---');
  await withServer({ PORT: '3456' }, async (base) => {
    await phaseMain(base, ctx, stamp);
  });

  await phaseStatuses(mismatchFile, corruptFile);

  // ---------- Legacy DB preservation: read the DB directly ----------
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const Database = require('better-sqlite3');
  const checkDb = new Database(DB_PATH, { readonly: true });
  try {
    const legacy = checkDb.prepare('SELECT COUNT(*) AS n FROM scans WHERE user_id IS NULL').get().n;
    console.log('\n18. Legacy scan-row preservation');
    check('legacy anonymous scans still in DB (never deleted)', legacy >= 70, `got ${legacy}`);
  } finally {
    checkDb.close();
  }

  console.log(`\n=== RESULT: ${passCount} passed, ${failCount} failed ===`);
  if (failCount > 0) {
    console.error('TEST SUITE FAILED');
    process.exit(1);
  }
  console.log('ALL CHECKS PASSED SUCCESSFULLY!');
}

runTests().then(() => process.exit(0)).catch((err) => {
  console.error('Test crashed:', err);
  process.exit(1);
});
