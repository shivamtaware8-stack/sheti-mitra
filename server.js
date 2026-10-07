import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { diagnoseImage, getDiagnosisConfig, isDiagnosisConfigured } from './diagnosis-provider.js';
import {
  db,
  getDiseaseReference,
  getProductsForDisease,
  getAllProducts,
  logScanToDb,
  getRecentScans,
  findUserByMobile,
  findUserByEmail,
  insertUser,
  getSessionUser,
  createSession,
  deleteSession,
  updateUserProfile,
  getUserCrops,
  addUserCrop,
  removeUserCrop,
  getSavedProducts,
  getSavedProductIds,
  saveProductForUser,
  removeSavedProductForUser,
  getDashboardSummary,
  getDiseaseHistory
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ============================================================================
   AUTH HELPERS: httpOnly session cookie holding a random token; only the
   SHA-256 hash of the token is stored in the sessions table.
   ============================================================================ */

const SESSION_COOKIE = 'sm_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const idx = part.indexOf('=');
    if (idx > 0) {
      acc[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
    return acc;
  }, {});
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getCurrentUser(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;
  return getSessionUser(hashToken(token));
}

function startSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  createSession(hashToken(token), userId, expiresAt);
  res.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
  ]);
}

function endSession(req, res) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (token) deleteSession(hashToken(token));
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function normalizeMobile(raw) {
  let value = String(raw || '').replace(/[\s\-().]/g, '');
  if (value.startsWith('+91')) value = value.slice(3);
  else if (value.startsWith('91') && value.length === 12) value = value.slice(2);
  return value;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;

/* ============================================================================
   SUPPORTED CROPS
   ============================================================================ */

const supportedCrops = [
  'tomato',
  'potato',
  'grape',
  'cotton',
  'soybean',
  'onion',
  'chilli',
  'pepper',
  'wheat',
  'triticale'
];

/* ============================================================================
   DEMO FALLBACK RESULTS (FOR WHEN MODEL IS MISSING OR CANNOT DIAGNOSE)
   ============================================================================ */

const demoResults = {
  tomato: {
    diseaseKey: 'tomato_early_blight',
    diseaseName: {
      mr: 'टोमॅटोवरील अर्ली ब्लाइट',
      hi: 'टमाटर अगेती झुलसा',
      en: 'Tomato Early Blight'
    },
    confidence: 0.72
  },
  potato: {
    diseaseKey: 'potato_early_blight',
    diseaseName: {
      mr: 'बटाट्यावरील अर्ली ब्लाइट',
      hi: 'आलू अगेती झुलसा',
      en: 'Potato Early Blight'
    },
    confidence: 0.70
  },
  pepper: {
    diseaseKey: 'pepper_bacterial_spot',
    diseaseName: {
      mr: 'ढोबळी मिरचीवरील जिवाणूजन्य ठिपके',
      hi: 'शिमला मिर्च का बैक्टीरियल स्पॉट',
      en: 'Bell Pepper Bacterial Spot'
    },
    confidence: 0.68
  },
  grape: {
    diseaseKey: 'grape_black_rot',
    diseaseName: {
      mr: 'द्राक्षांवरील ब्लॅक रॉट',
      hi: 'अंगूर का ब्लैक रॉट',
      en: 'Grape Black Rot'
    },
    confidence: 0.74
  },
  cotton: {
    diseaseKey: 'cotton_bacterial_blight',
    diseaseName: {
      mr: 'कापसावरील जिवाणूजन्य करपा',
      hi: 'कपास का बैक्टीरियल ब्लाइट',
      en: 'Cotton Bacterial Blight'
    },
    confidence: 0.66
  },
  soybean: {
    diseaseKey: 'soybean_frogeye_leaf_spot',
    diseaseName: {
      mr: 'सोयाबीनवरील फ्रॉगआय लीफ स्पॉट',
      hi: 'सोयाबीन फ्रॉगआई पत्ती धब्बा',
      en: 'Soybean Frogeye Leaf Spot'
    },
    confidence: 0.71
  },
  onion: {
    diseaseKey: 'onion_purple_blotch',
    diseaseName: {
      mr: 'कांद्यावरील जांभळा करपा',
      hi: 'प्याज़ का पर्पल ब्लॉच (बैंगनी धब्बा)',
      en: 'Onion Purple Blotch'
    },
    confidence: 0.69
  },
  chilli: {
    diseaseKey: 'chilli_anthracnose',
    diseaseName: {
      mr: 'मिरचीवरील फळकूज आणि डायबॅक (अँथ्रॅक्नोज)',
      hi: 'मिर्च का एन्थ्रेक्नोज (फल सड़न)',
      en: 'Chilli Anthracnose'
    },
    confidence: 0.73
  },
  wheat: {
    diseaseKey: 'wheat_leaf_rust',
    diseaseName: {
      mr: 'गव्हावरील तांबेरा (लीफ रस्ट)',
      hi: 'गेहूँ का भूरा रतुआ (लीफ रस्ट)',
      en: 'Wheat Leaf Rust'
    },
    confidence: 0.75
  },
  triticale: {
    diseaseKey: 'triticale_leaf_rust',
    diseaseName: {
      mr: 'ट्रिटिकेलवरील तांबेरा रोग',
      hi: 'ट्रिटिकेल का रतुआ रोग',
      en: 'Triticale Leaf Rust'
    },
    confidence: 0.67
  }
};

/* ============================================================================
   API: CROPS
   ============================================================================ */

app.get('/api/crops', (req, res) => {
  res.json(supportedCrops);
});

/* ============================================================================
   API: HEALTH
   ============================================================================ */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    modelConfigured: isDiagnosisConfigured(),
    uptime: process.uptime()
  });
});

/* ============================================================================
   API: AUTH — SIGNUP / LOGIN / LOGOUT / ME
   ============================================================================ */

function publicUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, mobile: user.mobile, email: user.email || null };
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const mobile = normalizeMobile(req.body?.mobile);
    const emailRaw = String(req.body?.email || '').trim().toLowerCase();
    const email = emailRaw === '' ? null : emailRaw;
    const password = String(req.body?.password || '');
    const confirmPassword = String(req.body?.confirmPassword || req.body?.password || '');

    if (!name) return res.status(400).json({ error: 'name_required' });
    if (!MOBILE_PATTERN.test(mobile)) return res.status(400).json({ error: 'invalid_mobile' });
    if (email !== null && !EMAIL_PATTERN.test(email)) return res.status(400).json({ error: 'invalid_email' });
    if (password.length < 6) return res.status(400).json({ error: 'password_too_short' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'password_mismatch' });

    // One person / one account: mobile must be unique.
    if (findUserByMobile(mobile)) return res.status(409).json({ error: 'duplicate_mobile' });
    // Email must be unique when supplied.
    if (email !== null && findUserByEmail(email)) return res.status(409).json({ error: 'duplicate_email' });

    const passwordHash = await bcrypt.hash(password, 10);
    let user;
    try {
      user = insertUser({ name, mobile, email, passwordHash });
    } catch (err) {
      // Race on UNIQUE constraints
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({ error: String(err.message).includes('email') ? 'duplicate_email' : 'duplicate_mobile' });
      }
      throw err;
    }

    startSession(res, user.id);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    console.error('Signup failed:', error);
    return res.status(500).json({ error: 'internal_server_error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const identifier = String(req.body?.identifier || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!identifier || !password) return res.status(400).json({ error: 'missing_credentials' });

    const isEmail = EMAIL_PATTERN.test(identifier);
    const user = isEmail
      ? findUserByEmail(identifier)
      : findUserByMobile(normalizeMobile(identifier));

    if (!user) return res.status(401).json({ error: 'invalid_credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'invalid_credentials' });

    startSession(res, user.id);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'internal_server_error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  endSession(req, res);
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const user = getCurrentUser(req);
  res.json({ user: publicUser(user) });
});

app.patch('/api/auth/profile', (req, res) => {
  try {
    const user = getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'unauthorized' });
    const updated = updateUserProfile(user.id, { name: req.body?.name, email: req.body?.email });
    return res.json({ user: publicUser(updated) });
  } catch (error) {
    const code = String(error.message || '');
    if (code === 'name_required') return res.status(400).json({ error: 'name_required' });
    if (code === 'invalid_email') return res.status(400).json({ error: 'invalid_email' });
    if (code === 'duplicate_email') return res.status(409).json({ error: 'duplicate_email' });
    console.error('Profile update failed:', error);
    return res.status(500).json({ error: 'internal_server_error' });
  }
});

/* ============================================================================
   API: PHASE 1 FARMER DASHBOARD (all routes require login, strictly per-user)
   ============================================================================ */

function requireUser(req, res) {
  const user = getCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: 'unauthorized' });
    return null;
  }
  return user;
}

app.get('/api/dashboard/summary', (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    res.json({ user: publicUser(user), summary: getDashboardSummary(user.id) });
  } catch (error) {
    console.error('Dashboard summary failed:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

app.get('/api/dashboard/disease-history', (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    res.json(getDiseaseHistory(user.id, 50));
  } catch (error) {
    console.error('Disease history failed:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

app.get('/api/crops/mine', (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    res.json({ supported: supportedCrops, mine: getUserCrops(user.id) });
  } catch (error) {
    console.error('My crops fetch failed:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

app.post('/api/crops/mine', (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    const crop = String(req.body?.crop || '').trim().toLowerCase();
    if (!supportedCrops.includes(crop)) return res.status(400).json({ error: 'unsupported_crop' });
    res.status(201).json({ supported: supportedCrops, mine: addUserCrop(user.id, crop) });
  } catch (error) {
    console.error('Add crop failed:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

app.delete('/api/crops/mine/:crop', (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    const crop = String(req.params.crop || '').trim().toLowerCase();
    if (!supportedCrops.includes(crop)) return res.status(400).json({ error: 'unsupported_crop' });
    res.json({ supported: supportedCrops, mine: removeUserCrop(user.id, crop) });
  } catch (error) {
    console.error('Remove crop failed:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

app.get('/api/products/saved', (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    res.json({ savedIds: getSavedProductIds(user.id), saved: getSavedProducts(user.id) });
  } catch (error) {
    console.error('Saved products fetch failed:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

app.post('/api/products/saved', (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    const productId = Number(req.body?.productId);
    if (!Number.isInteger(productId) || productId <= 0) return res.status(400).json({ error: 'invalid_product' });
    try {
      const saved = saveProductForUser(user.id, productId);
      return res.status(201).json({ savedIds: getSavedProductIds(user.id), saved });
    } catch (err) {
      if (String(err.message) === 'invalid_product') return res.status(404).json({ error: 'invalid_product' });
      throw err;
    }
  } catch (error) {
    console.error('Save product failed:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

app.delete('/api/products/saved/:id', (req, res) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) return res.status(400).json({ error: 'invalid_product' });
    const saved = removeSavedProductForUser(user.id, productId);
    return res.json({ savedIds: getSavedProductIds(user.id), saved });
  } catch (error) {
    console.error('Remove saved product failed:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

/* ============================================================================
   API: PRODUCTS
   ============================================================================ */

app.get('/api/products', (req, res) => {
  try {
    const products = getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Failed to get products:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

/* ============================================================================
   API: SCAN (AI SCREENING WITH MODEL AND DEMO FALLBACK)
   ============================================================================ */

app.post(
  '/api/scan',
  (req, res, next) => {
    upload.single('image')(req, res, (error) => {
      if (error) {
        const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(status).json({
          error: error.code === 'LIMIT_FILE_SIZE' ? 'image_too_large' : 'invalid_upload'
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'image_required' });
      }

      if (!req.file.mimetype?.startsWith('image/')) {
        return res.status(400).json({ error: 'image_required' });
      }

      if (!req.file.buffer?.length) {
        return res.status(400).json({ error: 'empty_image' });
      }

      next();
    });
  },
  async (req, res) => {
    const crop = String(req.body.crop || '').trim().toLowerCase();

    if (!supportedCrops.includes(crop)) {
      return res.status(400).json({ error: 'unsupported_crop' });
    }

    const filename = req.file.originalname || 'upload.jpg';
    const config = getDiagnosisConfig(crop);
    const currentUser = getCurrentUser(req);

    let isDemo = false;
    let status = 'model_unavailable';
    let prediction = null;
    let modelVersion = config.modelVersion || 'unavailable';
    let diseaseKey = null;
    let diseaseName = null;
    let confidence = null;
    let isHealthy = false;
    let detectedCrop = null;

    // 1. Run the real model only when it is configured on disk for this crop.
    if (isDiagnosisConfigured(crop)) {
      try {
        const diagnosis = await diagnoseImage({
          buffer: req.file.buffer,
          mimetype: req.file.mimetype,
          filename,
          crop
        });

        if (diagnosis && diagnosis.status === 'diagnosed' && diagnosis.disease) {
          modelVersion = diagnosis.modelVersion || config.modelVersion || 'onnx-model-v2';
          diseaseKey = diagnosis.disease.key;
          diseaseName = diagnosis.disease.name;
          confidence = diagnosis.disease.confidence;
          isHealthy = Boolean(diagnosis.disease.healthy);
          prediction = {
            crop,
            disease: typeof diseaseName === 'object' ? (diseaseName.en || diseaseName.mr || diseaseKey) : diseaseName,
            key: diseaseKey,
            name: diseaseName,
            confidence,
            healthy: isHealthy
          };
          // SAFETY GATE: a model result below the configured minimum confidence
          // is NEVER presented as a confirmed diagnosis and never recommends products.
          status = confidence < config.minimumConfidence ? 'uncertain' : 'diagnosed';
        } else if (diagnosis && diagnosis.status === 'crop_mismatch') {
          status = 'crop_mismatch';
          detectedCrop = diagnosis.crop || null;
          modelVersion = diagnosis.modelVersion || modelVersion;
        } else if (diagnosis && (diagnosis.status === 'unconfigured' || diagnosis.status === 'unsupported_crop')) {
          status = 'model_unconfigured';
        } else {
          status = 'model_unavailable';
        }
      } catch (err) {
        // An AI failure is reported as-is — never converted into a fake disease.
        console.warn(`Model diagnosis for ${crop} failed:`, err.message);
        status = 'model_unavailable';
      }
    } else {
      // No model is configured for this crop: the existing, clearly-labelled
      // demo fallback (7 crops). Its confidence is always below the minimum,
      // so it can never trigger product recommendations.
      isDemo = true;
      status = 'demo';
      const demo = demoResults[crop];
      modelVersion = 'demo-fallback-v1';
      diseaseKey = demo.diseaseKey;
      diseaseName = demo.diseaseName;
      confidence = demo.confidence;
      isHealthy = false;
      prediction = {
        crop,
        disease: typeof diseaseName === 'object' ? (diseaseName.en || diseaseName.mr || diseaseKey) : diseaseName,
        key: diseaseKey,
        name: diseaseName,
        confidence,
        healthy: isHealthy
      };
    }

    const belowMinimumConfidence = confidence !== null && confidence < config.minimumConfidence;

    // 2. Disease reference data (symptoms, management, sources) — shown even
    //    for uncertain results as guidance only, when available.
    const reference = diseaseKey ? getDiseaseReference(crop, diseaseKey) : null;

    // 3. SAFETY GATE (server side): products are recommended ONLY for a real
    //    model diagnosis at or above the minimum confidence — never for demo
    //    results, uncertain results, crop mismatches, model failures or healthy crops.
    const products = (status === 'diagnosed' && !isHealthy && !belowMinimumConfidence)
      ? getProductsForDisease(crop, diseaseKey)
      : [];

    // 4. Save scan history for the logged-in user (anonymous scans are stored
    //    with user_id NULL and are never exposed through the API).
    const scanDiseaseLabel = prediction
      ? (typeof diseaseName === 'object' ? (diseaseName.en || diseaseName.mr || diseaseKey) : String(diseaseName || diseaseKey))
      : status;

    try {
      logScanToDb(crop, scanDiseaseLabel, confidence, filename, modelVersion, currentUser?.id ?? null, status);
    } catch (err) {
      console.error('Failed to log scan to database:', err.message);
    }

    // 5. Disclaimers per status
    let disclaimer;
    if (isDemo) {
      disclaimer = 'DEMO RESULT — This is a demonstration fallback and not a real diagnosis. For actual disease diagnosis, consult an agronomist and always follow current approved product labels.';
    } else if (status === 'uncertain') {
      disclaimer = 'AI SCREENING RESULT — not a confirmed agronomic diagnosis. The model confidence is below the minimum threshold, so no product is recommended. Consult an agricultural expert and follow the current approved product label.';
    } else if (status === 'diagnosed') {
      disclaimer = 'AI SCREENING RESULT — This is an initial AI screening aid and not a confirmed agronomic diagnosis. Always verify with an agricultural expert and read the current approved product label before applying any product.';
    } else {
      disclaimer = 'AI SCREENING RESULT — not a confirmed agronomic diagnosis. No disease conclusion is drawn for this result.';
    }

    // 6. Return the complete structured response with the REAL status
    return res.json({
      crop,
      mode: isDemo ? 'demo' : 'model',
      demo: isDemo,
      status,
      modelVersion,
      prediction,
      disease: prediction,
      confidence,
      detectedCrop,
      reference,
      symptoms: reference?.symptoms || null,
      management: reference?.management || null,
      products,
      minimumConfidence: config.minimumConfidence,
      belowMinimumConfidence,
      disclaimer
    });
  }
);

/* ============================================================================
   API: SCAN HISTORY — a logged-in user only ever sees their own scans.
   Anonymous callers receive an empty list; other users' scans are never exposed.
   ============================================================================ */

app.get('/api/scans', (req, res) => {
  try {
    const user = getCurrentUser(req);
    const scans = getRecentScans(20, user?.id ?? null);
    res.json(scans);
  } catch (error) {
    console.error('Failed to fetch scan history:', error);
    res.status(500).json({ error: 'database_error' });
  }
});

/* ============================================================================
   FRONTEND WILDCARD ROUTE
   ============================================================================ */

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ============================================================================
   GLOBAL ERROR HANDLER
   ============================================================================ */

app.use((err, req, res, next) => {
  console.error('Unhandled Express route error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'internal_server_error' });
});

/* ============================================================================
   PROCESS LIFECYCLE HANDLERS
   ============================================================================ */

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/* ============================================================================
   START SERVER
   ============================================================================ */

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`ShetiMitra running on http://localhost:${PORT}`);
});

export default server;