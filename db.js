import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'sheti-mitra.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/* ============================================================================
   TABLE CREATION / SCHEMA MIGRATIONS
   ============================================================================ */

db.exec(`
CREATE TABLE IF NOT EXISTS crops (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  name_mr TEXT NOT NULL,
  scientific_name TEXT,
  category TEXT
);

CREATE TABLE IF NOT EXISTS diseases (
  id TEXT PRIMARY KEY,
  crop_id TEXT NOT NULL REFERENCES crops(id),
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  name_mr TEXT NOT NULL,
  scientific_name TEXT,
  pathogen_type TEXT
);

CREATE TABLE IF NOT EXISTS disease_references (
  crop TEXT NOT NULL,
  disease_key TEXT NOT NULL,
  symptoms_mr TEXT,
  symptoms_hi TEXT,
  symptoms_en TEXT,
  management_mr TEXT,
  management_hi TEXT,
  management_en TEXT,
  reference_source TEXT NOT NULL,
  reference_url TEXT NOT NULL,
  PRIMARY KEY(crop, disease_key)
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  name_mr TEXT NOT NULL,
  brand TEXT,
  manufacturer TEXT,
  active_ingredient TEXT,
  formulation TEXT,
  crop TEXT,
  suitable_crop TEXT,
  target_disease TEXT,
  category TEXT DEFAULT 'fungicide',
  use_en TEXT,
  use_hi TEXT,
  use_mr TEXT,
  price_inr REAL,
  pack_size TEXT,
  image TEXT,
  image_url TEXT,
  price_source TEXT,
  price_updated_at TEXT,
  registration_source TEXT,
  registration_note TEXT,
  verification_status TEXT DEFAULT 'Verified CIBRC Registration',
  source_url TEXT DEFAULT 'https://www.cibrc.nic.in/',
  manufacturer_source TEXT,
  image_source TEXT
);

CREATE TABLE IF NOT EXISTS disease_product_links (
  crop TEXT NOT NULL,
  disease_key TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  recommendation_priority INTEGER DEFAULT 1,
  verified INTEGER NOT NULL DEFAULT 1,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  PRIMARY KEY(crop, disease_key, product_id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS product_prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id),
  seller TEXT NOT NULL,
  price REAL,
  currency TEXT DEFAULT 'INR',
  pack_size TEXT,
  product_url TEXT,
  checked_at TEXT,
  source TEXT,
  is_verified INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS purchase_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id),
  seller TEXT NOT NULL,
  url TEXT NOT NULL,
  link_type TEXT NOT NULL, -- 'direct' or 'search'
  badge TEXT
);

CREATE TABLE IF NOT EXISTS scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crop TEXT,
  predicted_disease TEXT,
  confidence REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  image_name TEXT,
  model_version TEXT,
  user_id INTEGER,
  status TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL
);
`);

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((item) => item.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

// Ensure all newer columns exist
ensureColumn('products', 'brand', 'TEXT');
ensureColumn('products', 'suitable_crop', 'TEXT');
ensureColumn('products', 'target_disease', 'TEXT');
ensureColumn('products', 'category', "TEXT DEFAULT 'fungicide'");
ensureColumn('products', 'image_url', 'TEXT');
ensureColumn('products', 'verification_status', "TEXT DEFAULT 'Verified CIBRC Registration'");
ensureColumn('products', 'source_url', "TEXT DEFAULT 'https://www.cibrc.nic.in/'");
ensureColumn('products', 'manufacturer', 'TEXT');
ensureColumn('products', 'manufacturer_source', 'TEXT');
ensureColumn('products', 'image_source', 'TEXT');
ensureColumn('disease_product_links', 'recommendation_priority', 'INTEGER DEFAULT 1');
ensureColumn('scans', 'model_version', 'TEXT');
ensureColumn('scans', 'user_id', 'INTEGER');
ensureColumn('scans', 'status', 'TEXT');

/* ============================================================================
   DATA SEEDING: CROPS (ALL 10 SUPPORTED CROPS)
   ============================================================================ */

const cropsData = [
  { id: 'tomato', name_en: 'Tomato', name_hi: 'टमाटर', name_mr: 'टोमॅटो', scientific_name: 'Solanum lycopersicum', category: 'Vegetable' },
  { id: 'potato', name_en: 'Potato', name_hi: 'आलू', name_mr: 'बटाटा', scientific_name: 'Solanum tuberosum', category: 'Tuber' },
  { id: 'grape', name_en: 'Grape', name_hi: 'अंगूर', name_mr: 'द्राक्ष', scientific_name: 'Vitis vinifera', category: 'Fruit' },
  { id: 'cotton', name_en: 'Cotton', name_hi: 'कपास', name_mr: 'कापूस', scientific_name: 'Gossypium hirsutum', category: 'Cash Crop' },
  { id: 'soybean', name_en: 'Soybean', name_hi: 'सोयाबीन', name_mr: 'सोयाबीन', scientific_name: 'Glycine max', category: 'Oilseed' },
  { id: 'onion', name_en: 'Onion', name_hi: 'प्याज़', name_mr: 'कांदा', scientific_name: 'Allium cepa', category: 'Bulb Vegetable' },
  { id: 'chilli', name_en: 'Chilli', name_hi: 'मिर्च', name_mr: 'मिरची', scientific_name: 'Capsicum annuum', category: 'Spice' },
  { id: 'pepper', name_en: 'Bell Pepper', name_hi: 'शिमला मिर्च', name_mr: 'ढोबळी मिरची', scientific_name: 'Capsicum annuum var. grossum', category: 'Vegetable' },
  { id: 'wheat', name_en: 'Wheat', name_hi: 'गेहूँ', name_mr: 'गहू', scientific_name: 'Triticum aestivum', category: 'Cereal' },
  { id: 'triticale', name_en: 'Triticale', name_hi: 'ट्रिटिकेल', name_mr: 'ट्रिटिकेल', scientific_name: '× Triticosecale', category: 'Cereal Hybrid' }
];

const insertCropStmt = db.prepare(`
  INSERT INTO crops (id, name_en, name_hi, name_mr, scientific_name, category)
  VALUES (@id, @name_en, @name_hi, @name_mr, @scientific_name, @category)
  ON CONFLICT(id) DO UPDATE SET
    name_en = excluded.name_en,
    name_hi = excluded.name_hi,
    name_mr = excluded.name_mr,
    scientific_name = excluded.scientific_name,
    category = excluded.category
`);

for (const c of cropsData) {
  insertCropStmt.run(c);
}

/* ============================================================================
   DATA SEEDING: DISEASES
   ============================================================================ */

const diseasesData = [
  // Tomato
  { id: 'tomato_early_blight', crop_id: 'tomato', name_en: 'Early Blight', name_hi: 'अगेती झुलसा', name_mr: 'अर्ली ब्लाइट', scientific_name: 'Alternaria solani', pathogen_type: 'Fungal' },
  { id: 'tomato_late_blight', crop_id: 'tomato', name_en: 'Late Blight', name_hi: 'पछेती झुलसा', name_mr: 'लेट ब्लाइट', scientific_name: 'Phytophthora infestans', pathogen_type: 'Oomycete' },
  { id: 'tomato_bacterial_spot', crop_id: 'tomato', name_en: 'Bacterial Spot', name_hi: 'बैक्टीरियल स्पॉट', name_mr: 'जिवाणूजन्य ठिपके', scientific_name: 'Xanthomonas vesicatoria', pathogen_type: 'Bacterial' },
  { id: 'tomato_leaf_mold', crop_id: 'tomato', name_en: 'Leaf Mold', name_hi: 'लीफ मोल्ड', name_mr: 'पानावरील बुरशी', scientific_name: 'Passalora fulva', pathogen_type: 'Fungal' },
  { id: 'tomato_septoria_leaf_spot', crop_id: 'tomato', name_en: 'Septoria Leaf Spot', name_hi: 'सेप्टोरिया पत्ती धब्बा', name_mr: 'सेप्टोरिया पानांचे ठिपके', scientific_name: 'Septoria lycopersici', pathogen_type: 'Fungal' },
  { id: 'tomato_spider_mites', crop_id: 'tomato', name_en: 'Two-Spotted Spider Mite', name_hi: 'दो-धब्बों वाला स्पाइडर माइट', name_mr: 'दोन ठिपक्यांचा कोळी माइट', scientific_name: 'Tetranychus urticae', pathogen_type: 'Pest' },
  { id: 'tomato_target_spot', crop_id: 'tomato', name_en: 'Target Spot', name_hi: 'टारगेट स्पॉट', name_mr: 'टार्गेट स्पॉट', scientific_name: 'Corynespora cassiicola', pathogen_type: 'Fungal' },
  { id: 'tomato_yellow_leaf_curl_virus', crop_id: 'tomato', name_en: 'Yellow Leaf Curl Virus', name_hi: 'येलो लीफ कर्ल वायरस', name_mr: 'यलो लीफ कर्ल विषाणू', scientific_name: 'TYLCV', pathogen_type: 'Viral' },
  { id: 'tomato_mosaic_virus', crop_id: 'tomato', name_en: 'Tomato Mosaic Virus', name_hi: 'टमाटर मोज़ेक वायरस', name_mr: 'टोमॅटो मोझॅक विषाणू', scientific_name: 'ToMV', pathogen_type: 'Viral' },
  { id: 'tomato_healthy', crop_id: 'tomato', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Potato
  { id: 'potato_early_blight', crop_id: 'potato', name_en: 'Early Blight', name_hi: 'अगेती झुलसा', name_mr: 'अर्ली ब्लाइट', scientific_name: 'Alternaria solani', pathogen_type: 'Fungal' },
  { id: 'potato_late_blight', crop_id: 'potato', name_en: 'Late Blight', name_hi: 'पछेती झुलसा', name_mr: 'लेट ब्लाइट', scientific_name: 'Phytophthora infestans', pathogen_type: 'Oomycete' },
  { id: 'potato_healthy', crop_id: 'potato', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Grape
  { id: 'grape_black_rot', crop_id: 'grape', name_en: 'Black Rot', name_hi: 'ब्लैक रॉट', name_mr: 'ब्लॅक रॉट', scientific_name: 'Guignardia bidwellii', pathogen_type: 'Fungal' },
  { id: 'grape_downy_mildew', crop_id: 'grape', name_en: 'Downy Mildew', name_hi: 'डाउनी मिल्ड्यू', name_mr: 'डाऊनी मिल्ड्यू / केवडा', scientific_name: 'Plasmopara viticola', pathogen_type: 'Oomycete' },
  { id: 'grape_powdery_mildew', crop_id: 'grape', name_en: 'Powdery Mildew', name_hi: 'पाउडरी मिल्ड्यू', name_mr: 'भुरी रोग', scientific_name: 'Erysiphe necator', pathogen_type: 'Fungal' },
  { id: 'grape_healthy', crop_id: 'grape', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Cotton
  { id: 'cotton_bacterial_blight', crop_id: 'cotton', name_en: 'Bacterial Blight', name_hi: 'बैक्टीरियल ब्लाइट', name_mr: 'जिवाणूजन्य करपा (अँगुलर लीफ स्पॉट)', scientific_name: 'Xanthomonas citri pv. malvacearum', pathogen_type: 'Bacterial' },
  { id: 'cotton_alternaria_leaf_spot', crop_id: 'cotton', name_en: 'Alternaria Leaf Spot', name_hi: 'अल्टरनेरिया पत्ती धब्बा', name_mr: 'अल्टरनेरिया पानांचे ठिपके', scientific_name: 'Alternaria macrospora', pathogen_type: 'Fungal' },
  { id: 'cotton_healthy', crop_id: 'cotton', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Soybean
  { id: 'soybean_frogeye_leaf_spot', crop_id: 'soybean', name_en: 'Frogeye Leaf Spot', name_hi: 'फ्रॉगआई पत्ती धब्बा', name_mr: 'बेडकाच्या डोळ्यासारखे ठिपके', scientific_name: 'Cercospora sojina', pathogen_type: 'Fungal' },
  { id: 'soybean_rust', crop_id: 'soybean', name_en: 'Soybean Rust', name_hi: 'सोयाबीन रतुआ', name_mr: 'सोयाबीन तांबेरा', scientific_name: 'Phakopsora pachyrhizi', pathogen_type: 'Fungal' },
  { id: 'soybean_healthy', crop_id: 'soybean', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Onion
  { id: 'onion_purple_blotch', crop_id: 'onion', name_en: 'Purple Blotch', name_hi: 'पर्पल ब्लॉच (बैंगनी धब्बा)', name_mr: 'जांभळा करपा', scientific_name: 'Alternaria porri', pathogen_type: 'Fungal' },
  { id: 'onion_stemphyllium_blight', crop_id: 'onion', name_en: 'Stemphylium Blight', name_hi: 'स्टेमफिलियम झुलसा', name_mr: 'स्टेम्फिलियम करपा', scientific_name: 'Stemphylium vesicarium', pathogen_type: 'Fungal' },
  { id: 'onion_healthy', crop_id: 'onion', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Chilli
  { id: 'chilli_anthracnose', crop_id: 'chilli', name_en: 'Anthracnose', name_hi: 'एन्थ्रेक्नोज (फल सड़न व डाइबैक)', name_mr: 'फळकूज आणि डायबॅक (मर रोग)', scientific_name: 'Colletotrichum capsici', pathogen_type: 'Fungal' },
  { id: 'chilli_leaf_curl', crop_id: 'chilli', name_en: 'Leaf Curl Virus', name_hi: 'लीफ कर्ल वायरस (चुर्रा-मुर्रा)', name_mr: 'चुरडा-मुरडा / बोकड्या रोग', scientific_name: 'Chilli leaf curl virus', pathogen_type: 'Viral' },
  { id: 'chilli_healthy', crop_id: 'chilli', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Bell Pepper
  { id: 'pepper_bacterial_spot', crop_id: 'pepper', name_en: 'Bacterial Spot', name_hi: 'बैक्टीरियल स्पॉट', name_mr: 'जिवाणूजन्य ठिपके', scientific_name: 'Xanthomonas campestris pv. vesicatoria', pathogen_type: 'Bacterial' },
  { id: 'pepper_anthracnose', crop_id: 'pepper', name_en: 'Anthracnose', name_hi: 'एन्थ्रेक्नोज', name_mr: 'फळकूज / करपा', scientific_name: 'Colletotrichum spp.', pathogen_type: 'Fungal' },
  { id: 'pepper_healthy', crop_id: 'pepper', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Wheat
  { id: 'wheat_leaf_rust', crop_id: 'wheat', name_en: 'Leaf Rust', name_hi: 'भूरा रतुआ (गेरुआ)', name_mr: 'तांबेरा रोग (ब्राऊन रस्ट)', scientific_name: 'Puccinia triticina', pathogen_type: 'Fungal' },
  { id: 'wheat_powdery_mildew', crop_id: 'wheat', name_en: 'Powdery Mildew', name_hi: 'चूर्णिल आसिता (पाउडरी मिल्ड्यू)', name_mr: 'भुरी रोग', scientific_name: 'Blumeria graminis f. sp. tritici', pathogen_type: 'Fungal' },
  { id: 'wheat_healthy', crop_id: 'wheat', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' },

  // Triticale
  { id: 'triticale_leaf_rust', crop_id: 'triticale', name_en: 'Leaf Rust', name_hi: 'भूरा रतुआ', name_mr: 'तांबेरा रोग', scientific_name: 'Puccinia recondita', pathogen_type: 'Fungal' },
  { id: 'triticale_stripe_rust', crop_id: 'triticale', name_en: 'Stripe Rust (Yellow Rust)', name_hi: 'पीला रतुआ (स्ट्राइप रस्ट)', name_mr: 'पिवळा तांबेरा', scientific_name: 'Puccinia striiformis', pathogen_type: 'Fungal' },
  { id: 'triticale_healthy', crop_id: 'triticale', name_en: 'Healthy', name_hi: 'स्वस्थ', name_mr: 'निरोगी', scientific_name: null, pathogen_type: 'None' }
];

const insertDiseaseStmt = db.prepare(`
  INSERT INTO diseases (id, crop_id, name_en, name_hi, name_mr, scientific_name, pathogen_type)
  VALUES (@id, @crop_id, @name_en, @name_hi, @name_mr, @scientific_name, @pathogen_type)
  ON CONFLICT(id) DO UPDATE SET
    crop_id = excluded.crop_id,
    name_en = excluded.name_en,
    name_hi = excluded.name_hi,
    name_mr = excluded.name_mr,
    scientific_name = excluded.scientific_name,
    pathogen_type = excluded.pathogen_type
`);

for (const d of diseasesData) {
  insertDiseaseStmt.run(d);
}

/* ============================================================================
   DATA SEEDING: DISEASE REFERENCES
   ============================================================================ */

const diseaseReferencesData = [
  // Tomato: Early Blight
  {
    crop: 'tomato',
    disease_key: 'tomato_early_blight',
    symptoms_mr: JSON.stringify([
      'पानांवर तपकिरी-काळे वर्तुळाकार ठिपके (टार्गेट बोर्डसारखे) दिसतात.',
      'खालची जुनी पाने प्रथम पिवळी पडून गळू लागतात.',
      'खोड आणि फळांच्या देठाजवळ काळपट खळगे पडू शकतात.'
    ]),
    symptoms_hi: JSON.stringify([
      'पुरानी पत्तियों पर गोल, भूरे-काले छल्लेदार धब्बे (टारगेट स्पॉट) बनते हैं।',
      'निचली पत्तियां पीली पड़कर सूखने और झड़ने लगती हैं।',
      'तने और फल के डंठल के पास काले धंसे हुए धब्बे दिखते हैं।'
    ]),
    symptoms_en: JSON.stringify([
      'Dark brown to black circular lesions with concentric rings (target-board pattern) on older leaves.',
      'Lower foliage turns yellow and defoliates prematurely.',
      'Sunken dark lesions can develop on stems and fruit calyx.'
    ]),
    management_mr: JSON.stringify([
      'बाधित खालची पाने वेळोवेळी छाटून नष्ट करा.',
      'झाडांमध्ये पुरेशी हवा खेळती राहील असे अंतर ठेवा आणि ठिबक सिंचन वापरा.',
      'सुरुवातीच्या टप्प्यात लेबलनुसार मॅन्कोझेब ७५% WP किंवा कॉपर ऑक्सिक्लोराइड ५०% WP ची प्रतिबंधात्मक फवारणी करा.'
    ]),
    management_hi: JSON.stringify([
      'संक्रमित निचली पत्तियों को तोड़कर नष्ट कर दें।',
      'हवा के संचार हेतु उचित दूरी रखें और ड्रिप सिंचाई का उपयोग करें।',
      'प्रारंभिक अवस्था में लेबल अनुसार मैनकोजेब 75% WP या कॉपर ऑक्सीक्लोराइड 50% WP का छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Prune and destroy infected lower foliage.',
      'Maintain adequate plant spacing and use drip irrigation to keep canopies dry.',
      'Apply approved protective fungicides such as Mancozeb 75% WP or Copper Oxychloride 50% WP as per label directions.'
    ]),
    reference_source: 'ICAR-IIHR / TNAU Agritech Portal',
    reference_url: 'https://agritech.tnau.ac.in/crop_protection/tomato_diseases_1.html'
  },

  // Tomato: Late Blight
  {
    crop: 'tomato',
    disease_key: 'tomato_late_blight',
    symptoms_mr: JSON.stringify([
      'पानांवर पाण्यासारखे अनियमित फिकट हिरवे ते तपकिरी करडे डाग पडतात.',
      'थंड आणि दमट वातावरणात पाने वेगाने करपतात आणि झाड जळून गेल्यासारखे दिसते.',
      'पानाच्या खालच्या बाजूस पांढुरकी बुरशी दिसते.'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों पर पानी से भीगे अनियमित धब्बे जो तेजी से भूरे-काले हो जाते हैं।',
      'ठंडे और अत्यधिक नम मौसम में पत्तियां तेजी से झुलसती हैं।',
      'पत्तियों की निचली सतह पर सफेद रुई जैसी फफूंद दिखाई देती है।'
    ]),
    symptoms_en: JSON.stringify([
      'Water-soaked pale green or brown lesions on leaves and stems.',
      'Rapid blighting and rot during cool, humid or rainy weather.',
      'White downy fungal growth on the underside of affected leaves.'
    ]),
    management_mr: JSON.stringify([
      'पानांवर पाणी उडणार नाही याची काळजी घ्या; ठिबक सिंचनाचा वापर करा.',
      'प्रादुर्भाव दिसताच मेटालॅक्सिल ८% + मॅन्कोझेब ६४% WP ची शिफारशीनुसार फवारणी करा.',
      'शेतात पाणी साचू देऊ नका आणि रोगट अवशेष नष्ट करा.'
    ]),
    management_hi: JSON.stringify([
      'पत्तियों पर पानी न पड़ने दें, ड्रिप सिंचाई को प्राथमिकता दें।',
      'लक्षण दिखते ही मेटालैक्सिल 8% + मैनकोजेब 64% WP का लेबल अनुसार छिड़काव करें।',
      'खेत से जल निकासी सुगम रखें और संक्रमित अवशेष नष्ट करें।'
    ]),
    management_en: JSON.stringify([
      'Avoid overhead watering; prefer drip irrigation to keep canopies dry.',
      'Spray Metalaxyl 8% + Mancozeb 64% WP at the first appearance of weather-conducive blight symptoms.',
      'Ensure good field drainage and eliminate infected plant residues.'
    ]),
    reference_source: 'ICAR-IARI Plant Protection Advisory',
    reference_url: 'https://www.cibrc.nic.in/'
  },

  // Potato: Early Blight
  {
    crop: 'potato',
    disease_key: 'potato_early_blight',
    symptoms_mr: JSON.stringify([
      'पानांवर गडद तपकिरी ते काळे वर्तुळाकार ठिपके (लक्ष्य ठिपके) दिसतात.',
      'जुन्या पानांवर सुरुवात होऊन पाने पिवळी पडून गळतात.',
      'कंद लहान राहतात आणि उत्पादनात घट होते.'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों पर गहरे भूरे रंग के छल्लेदार गोल धब्बे (टारगेट बोर्ड जैसे)।',
      'निचली पत्तियों पर शुरुआत होकर पत्तियां सूखने लगती हैं।',
      'कंदों का आकार छोटा रह जाता है और पैदावार घटती है।'
    ]),
    symptoms_en: JSON.stringify([
      'Dark brown to black spots with concentric rings on older leaves.',
      'Foliage turns yellow, curls, and dries up from bottom upwards.',
      'Tuber yield and sizing are impaired.'
    ]),
    management_mr: JSON.stringify([
      'नत्राचा अतिवापर टाळा आणि संतुलित खते द्या.',
      'रोगट झाडांचे अवशेष गोळा करून जाळून किंवा जमिनीत गाडून नष्ट करा.',
      'सुरुवातीला मॅन्कोझेब ७५% WP ची प्रतिबंधात्मक फवारणी करा.'
    ]),
    management_hi: JSON.stringify([
      'संतुलित उर्वरक प्रबंधन अपनाएं, नाइट्रोजन का अत्यधिक प्रयोग न करें।',
      'रोगग्रस्त फसल अवशेषों को नष्ट करें।',
      'प्रारंभ में मैनकोजेब 75% WP का सुरक्षात्मक छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Ensure balanced fertilization; avoid excess nitrogen.',
      'Collect and bury infected plant residue after harvest.',
      'Apply Mancozeb 75% WP protectively at early notice.'
    ]),
    reference_source: 'ICAR-Central Potato Research Institute (CPRI)',
    reference_url: 'https://cpri.icar.gov.in/'
  },

  // Potato: Late Blight
  {
    crop: 'potato',
    disease_key: 'potato_late_blight',
    symptoms_mr: JSON.stringify([
      'पानांवर आणि देठावर पाण्यासारखे काळे-तपकिरी डाग वेगाने पसरतात.',
      'दमट आणि ढगाळ हवेत झाडाची पाने काही दिवसांत काळी पडून कुजतात.',
      'पानाच्या खाली पांढऱ्या बुरशीची लव दिसते; कंदांवर तपकिरी कोरडी सड होते.'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों व तनों पर पानी से भीगे काले-भूरे धब्बे बहुत तेजी से बढ़ते हैं।',
      'बादल छाए और नम मौसम में फसल 2-3 दिन में झुलस जाती है।',
      'पत्ती के नीचे सफेद फफूंद और आलू के कंद पर भूरी सडन दिखाई देती है।'
    ]),
    symptoms_en: JSON.stringify([
      'Rapidly spreading water-soaked dark purplish-brown lesions on leaves and petioles.',
      'Entire plant can collapse and rot within days during foggy or rainy weather.',
      'White fungal mildew visible on leaf undersides; brown rot on tubers.'
    ]),
    management_mr: JSON.stringify([
      'प्रमाणित आणि रोगमुक्त बटाटा बेणे वापरा.',
      'हवामानात धुके किंवा दमटपणा वाढताच प्रतिबंधात्मक मॅन्कोझेब ७५% WP फवारा.',
      'रोगाचा फैलाव सुरू झाल्यास मेटालॅक्सिल ८% + मॅन्कोझेब ६४% WP चा वापर करा.'
    ]),
    management_hi: JSON.stringify([
      'प्रमाणित एवं रोगमुक्त बीज कंदों का उपयोग करें।',
      'कोहरा या अत्यधिक नमी होने पर मैनकोजेब 75% WP का एहतियाती छिड़काव करें।',
      'प्रकोप बढ़ने पर मेटालैक्सिल 8% + मैनकोजेब 64% WP का उपयोग करें।'
    ]),
    management_en: JSON.stringify([
      'Plant certified disease-free seed tubers.',
      'Spray Mancozeb 75% WP preventively when humidity and cool temperatures favor blight.',
      'Switch to Metalaxyl 8% + Mancozeb 64% WP upon early epidemic detection.'
    ]),
    reference_source: 'ICAR-CPRI Shimla',
    reference_url: 'https://cpri.icar.gov.in/'
  },

  // Grape: Black Rot
  {
    crop: 'grape',
    disease_key: 'grape_black_rot',
    symptoms_mr: JSON.stringify([
      'पानांवर लहान, तांबूस-तपकिरी गोल ठिपके ज्यांच्या कडा गडद काळपट असतात.',
      'ठिपक्यांवर बारीक काळे ठिपके (पिक्निडिया) दिसतात.',
      'द्राक्षांचे मणी सुकतात, सुरकुततात आणि काळे पडून कडक होतात (ममीसारखे).'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों पर छोटे, लाल-भूरे गोल धब्बे जिनके किनारे गहरे होते हैं।',
      'धब्बों के बीच में छोटे काले बिंदु बनते हैं।',
      'अंगूर के दाने सूखकर, सिकुड़कर काले और कड़े (ममीकृत) हो जाते हैं।'
    ]),
    symptoms_en: JSON.stringify([
      'Small circular reddish-brown spots with dark borders on leaves.',
      'Tiny black fruiting specks form inside leaf spots.',
      'Berries turn shriveled, hard, black mummies hanging on clusters.'
    ]),
    management_mr: JSON.stringify([
      'सुकलेले घड आणि रोगट काड्या छाटणीच्या वेळी बागेबाहेर काढून नष्ट करा.',
      'वेलींची विरळणी करून सूर्यप्रकाश व हवा खेळती ठेवा.',
      'अॅझॉक्सीस्ट्रोबिन किंवा मॅन्कोझेब ७५% WP चा शिफारशीनुसार वापर करा.'
    ]),
    management_hi: JSON.stringify([
      'सूखे गुच्छे और रोगी टहनियों को छांटकर नष्ट करें।',
      'कैनोपी छंटाई से धूप और हवा का आवागमन सुनिश्चित करें।',
      'अजॉक्सीस्ट्रोबिन या मैनकोजेब 75% WP का संस्तुत छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Prune out and destroy mummified berry clusters and infected canes.',
      'Open up canopy to maximize air movement and sun exposure.',
      'Apply Azoxystrobin + Difenoconazole or Mancozeb 75% WP as per ICAR-NRCG guidelines.'
    ]),
    reference_source: 'ICAR-National Research Centre for Grapes (NRCG) Pune',
    reference_url: 'https://nrcgrapes.icar.gov.in/'
  },

  // Cotton: Bacterial Blight
  {
    crop: 'cotton',
    disease_key: 'cotton_bacterial_blight',
    symptoms_mr: JSON.stringify([
      'पानांवर शिरांमुळे मर्यादित राहिलेले लहान, कोनीय पाणाळलेले ठिपके (अँगुलर लीफ स्पॉट).',
      'ठिपके नंतर गडद तपकिरी ते काळे पडतात.',
      'फांद्यांवर काळे चट्टे पडून फांद्या मोडतात (ब्लॅक आर्म लक्षण).'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों पर नसों के बीच कोणीय जलभराव वाले धब्बे जो बाद में काले हो जाते हैं।',
      'पत्तियां सूखकर जल्दी गिर जाती हैं।',
      'टहनियों पर काले घाव बनते हैं जिससे शाखाएं टूट जाती हैं (ब्लैक आर्म)।'
    ]),
    symptoms_en: JSON.stringify([
      'Angular water-soaked spots bounded by minor leaf veins (angular leaf spot).',
      'Lesions turn dark brown to black and dry out.',
      'Stems develop elongated black lesions leading to branch breakage (black arm stage).'
    ]),
    management_mr: JSON.stringify([
      'रोगमुक्त आणि शिफारस केलेल्या संकरित बियाणांचा वापर करा.',
      'पेरणीपूर्वी योग्य बीजप्रक्रिया करा.',
      'लक्षणे दिसताच कॉपर ऑक्सिक्लोराइड ५०% WP ची लेबलनुसार फवारणी करा.'
    ]),
    management_hi: JSON.stringify([
      'प्रमाणित एवं रोगरोधी किस्मों के बीज का चयन करें।',
      'बुवाई से पहले बीजोपचार अवश्य करें।',
      'शुरुआती लक्षण पर कॉपर ऑक्सीक्लोराइड 50% WP का छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Sow certified and disease-tolerant cotton hybrids.',
      'Ensure appropriate antibacterial seed treatment before sowing.',
      'Spray Copper Oxychloride 50% WP upon observing angular leaf lesions as per university recommendations.'
    ]),
    reference_source: 'ICAR-Central Institute for Cotton Research (CICR) Nagpur',
    reference_url: 'https://cicr.icar.gov.in/'
  },

  // Soybean: Frogeye Leaf Spot
  {
    crop: 'soybean',
    disease_key: 'soybean_frogeye_leaf_spot',
    symptoms_mr: JSON.stringify([
      'पानांवर लहान, गोलाकार ते कोनीय ठिपके ज्यांचा मध्यभाग करडा/फिकट आणि कड गडद तांबूस-जांभळी असते.',
      'हे ठिपके बेडकाच्या डोळ्यासारखे दिसतात.',
      'जास्त प्रादुर्भावात पाने करपून वेळेआधी गळतात.'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों पर मेंढक की आंख जैसे धब्बे (मध्य में हल्के राख रंग और किनारे लाल-बैंगनी)।',
      'धब्बे आपस में मिलकर पत्तियों के बड़े हिस्से को सुखा देते हैं।',
      'पौधे समय से पहले पत्ते गिरा देते हैं जिससे दाने छोटे रह जाते हैं।'
    ]),
    symptoms_en: JSON.stringify([
      'Small circular to angular leaf spots with ash-gray centers and dark reddish-brown borders.',
      'Frogeye appearance on upper leaf surfaces.',
      'Premature leaf drop causing reduced seed size and yield.'
    ]),
    management_mr: JSON.stringify([
      'प्रमाणित रोगप्रतिकारक वाणांची पेरणी करा.',
      'सोयाबीन पिकाची मका किंवा ज्वारी पिकांसोबत फेरपालट करा.',
      'फुलोरा किंवा शेंगा भरण्याच्या टप्प्यात अॅझॉक्सीस्ट्रोबिन किंवा टेबुकोनाझोलची फवारणी करा.'
    ]),
    management_hi: JSON.stringify([
      'रोगरोधी किस्मों का चयन करें और बीजोपचार करें।',
      'मक्का या ज्वार के साथ फसल चक्र अपनाएं।',
      'फलियां बनते समय आवश्यकतानुसार अजॉक्सीस्ट्रोबिन या टेबुकोनाजोल का छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Plant certified disease-tolerant soybean cultivars.',
      'Practice crop rotation with non-host crops such as corn or sorghum.',
      'Apply Azoxystrobin + Difenoconazole in accordance with label advisories.'
    ]),
    reference_source: 'ICAR-Indian Institute of Soybean Research (IISR) Indore',
    reference_url: 'https://iisrindore.icar.gov.in/'
  },

  // Onion: Purple Blotch
  {
    crop: 'onion',
    disease_key: 'onion_purple_blotch',
    symptoms_mr: JSON.stringify([
      'कांद्याच्या पातीवर लहान पाण्यासारखे डाग जे नंतर लंबगोलाकार आणि मध्यभागी जांभळट होतात.',
      'डागांभोवती पिवळसर वलय असते; जास्त प्रादुर्भावात पात मधूनच वाकते किंवा तुटते.',
      'कांद्याची वाढ खुंटते आणि कंद लहान राहतात.'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों पर छोटे जलभराव वाले धब्बे जो बाद में अंडाकार और बीच में गहरे बैंगनी हो जाते हैं।',
      'धब्बों के किनारे पीले होते हैं और पत्तियां बीच से टूटकर गिर जाती हैं।',
      'प्याज के कंद का विकास रुक जाता है और पैदावार घटती है।'
    ]),
    symptoms_en: JSON.stringify([
      'Small water-soaked leaf lesions expanding into elongated elliptical purple-centered spots.',
      'Yellowish halo borders; leaves girdle and snap at lesion points.',
      'Bulb size and storability are significantly reduced.'
    ]),
    management_mr: JSON.stringify([
      'शेतात पाण्याचा उत्तम निचरा ठेवा आणि अति पाणी देणे टाळा.',
      'फवारणी करताना द्रावणात नेहमी स्टिकर (स्प्रेडर) वापरा.',
      'मॅन्कोझेब ७५% WP किंवा टेबुकोनाझोल २५.९% EC ची शिफारशीनुसार फवारणी करा.'
    ]),
    management_hi: JSON.stringify([
      'खेत में जल निकास उत्तम रखें, अधिक पानी न दें।',
      'छिड़काव के घोल में चिपकने वाला पदार्थ (स्टिकर) अवश्य मिलाएं।',
      'मैनकोजेब 75% WP या टेबुकोनाजोल 25.9% EC का अनुशंसित छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Ensure good field drainage and avoid water stagnation.',
      'Always add an approved wetting/sticking agent to spray mixtures on waxy onion leaves.',
      'Apply Mancozeb 75% WP or Tebuconazole 25.9% EC as per CIBRC/ICAR guidance.'
    ]),
    reference_source: 'ICAR-Directorate of Onion and Garlic Research (DOGR) Pune',
    reference_url: 'https://dogr.icar.gov.in/'
  },

  // Chilli: Anthracnose
  {
    crop: 'chilli',
    disease_key: 'chilli_anthracnose',
    symptoms_mr: JSON.stringify([
      'मिरचीच्या पिकलेल्या आणि हिरव्या फळांवर गोलाकार खळगे पडणारे काळे डाग.',
      'फळांवर काळ्या ठिपक्यांचे वर्तुळाकार वलय दिसते; फळे सुकतात.',
      'फांद्या शेंड्याकडून खाली वाळू लागतात (डायबॅक किंवा मर).'
    ]),
    symptoms_hi: JSON.stringify([
      'मिर्च के फलों पर गोल धंसे हुए काले-भूरे धब्बे।',
      'फलों पर काले दानों के छल्लेदार घेरे बनते हैं और मिर्च सूख जाती है।',
      'पौधे की शाखाएं ऊपर से नीचे की ओर सूखने लगती हैं (डाइबैक)।'
    ]),
    symptoms_en: JSON.stringify([
      'Circular sunken lesions with concentric rings of dark fruiting bodies on mature and green fruit.',
      'Infected fruit shrivels and rots on plant.',
      'Twig blight and dieback progressing from top downward.'
    ]),
    management_mr: JSON.stringify([
      'प्रमाणित बियाणे वापरा आणि पेरणीपूर्वी बीजप्रक्रिया करा.',
      'झाडांवरून फळे काढल्यानंतर रोगट झाडे गोळा करून नष्ट करा.',
      'फुलोरा सुरू होताच कॉपर ऑक्सिक्लोराइड किंवा अॅझॉक्सीस्ट्रोबिन + डिफेनोकोनाझोलची फवारणी करा.'
    ]),
    management_hi: JSON.stringify([
      'प्रमाणित बीज का उपयोग करें और बीजोपचार अवश्य करें।',
      'फसल अवशेषों को खेत से हटाकर नष्ट करें।',
      'फूल आने के समय कॉपर ऑक्सीक्लोराइड या अजॉक्सीस्ट्रोबिन + डाइफेनोकोनाजोल का छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Use certified disease-free seeds and conduct fungicidal seed treatment.',
      'Collect and safely dispose of infected crop residue.',
      'Apply Azoxystrobin + Difenoconazole or Copper Oxychloride 50% WP starting at flowering/fruit set.'
    ]),
    reference_source: 'ICAR-Indian Institute of Vegetable Research (IIVR) Varanasi',
    reference_url: 'https://iivr.icar.gov.in/'
  },

  // Bell Pepper: Bacterial Spot
  {
    crop: 'pepper',
    disease_key: 'pepper_bacterial_spot',
    symptoms_mr: JSON.stringify([
      'पानांवर लहान, पिवळसर-हिरवे पाण्यासारखे ठिपके जे नंतर तपकिरी आणि तेलकट होतात.',
      'बाधित पाने मोठ्या प्रमाणावर पिवळी पडून गळतात.',
      'फळांवर खरबडीत, खवलेयुक्त डाग पडतात.'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों पर छोटे, पीले-हरे पानी से भीगे धब्बे जो बाद में गहरे तैलीय हो जाते हैं।',
      'पत्तियां तेजी से पीली होकर गिर जाती हैं।',
      'फलों पर उभरे हुए खुरदुरे धब्बे पड़ते हैं।'
    ]),
    symptoms_en: JSON.stringify([
      'Small yellowish-green circular water-soaked lesions turning dark brown with greasy margins.',
      'Extensive leaf chlorosis and premature drop exposing fruit to sunscald.',
      'Rough scabby lesions on developing peppers.'
    ]),
    management_mr: JSON.stringify([
      'प्रमाणित आणि रोगमुक्त बियाण्यांचा वापर करा.',
      'ओल्या झाडांमध्ये अंतरमशागत टाळा जेणेकरून जिवाणूंचा प्रसार होणार नाही.',
      'सुरुवातीला कॉपर ऑक्सिक्लोराइड ५०% WP ची प्रतिबंधात्मक फवारणी करा.'
    ]),
    management_hi: JSON.stringify([
      'प्रमाणित एवं रोगमुक्त बीज का उपयोग करें।',
      'पत्तियां गीली होने पर खेत में काम न करें ताकि रोग न फैले।',
      'प्रारंभिक अवस्था में कॉपर ऑक्सीक्लोराइड 50% WP का सुरक्षात्मक छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Use certified disease-free seed stocks.',
      'Avoid handling plants when foliage is wet from rain or dew.',
      'Apply Copper Oxychloride 50% WP protectively according to local university advisories.'
    ]),
    reference_source: 'ICAR-IIHR Capsicum Guide',
    reference_url: 'https://iihr.res.in/'
  },

  // Wheat: Leaf Rust
  {
    crop: 'wheat',
    disease_key: 'wheat_leaf_rust',
    symptoms_mr: JSON.stringify([
      'पानांच्या वरच्या बाजूवर लहान, गोलाकार ते लंबगोलाकार नारंगी-तांबूस रंगाचे पुरळ (पुस्ट्यूल्स).',
      'पुरळातून नारंगी रंगाची पावडर निघते आणि हाताला तांब्यासारखी भुकटी लागते.',
      'पाने वेगाने वाळतात आणि दाणे बारीक भरतात.'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों की ऊपरी सतह पर नारंगी-भूरे रंग के गोल/अंडाकार पाउडर जैसे दाने (रतुआ/गेरुआ)।',
      'हाथ लगाने पर उंगलियों पर जंग जैसा नारंगी पाउडर लग जाता है।',
      'पत्तियां सूखती हैं और दाने सिकुड़कर पतले रह जाते हैं।'
    ]),
    symptoms_en: JSON.stringify([
      'Small, round to oblong bright orange-brown powdery pustules scattered randomly on upper leaf blades.',
      'Rusty spores rub off readily on touch.',
      'Leaves brown and senesce prematurely, shriveling grain.'
    ]),
    management_mr: JSON.stringify([
      'तुमच्या विभागासाठी शिफारस केलेले तांबेरा-प्रतिकारक वाण पेरा.',
      'तांबेऱ्याची लक्षणे दिसताच प्रोपिकोनाझोल २५% EC ची शिफारशीनुसार फवारणी करा.',
      'पेरणी योग्य वेळी करा.'
    ]),
    management_hi: JSON.stringify([
      'क्षेत्रीय रूप से अनुशंसित रतुआ प्रतिरोधी किस्में लगाएं।',
      'लक्षण दिखाई देते ही प्रोपिकोनाजोल 25% EC का अनुशंसित छिड़काव करें।',
      'समय पर बुवाई करें।'
    ]),
    management_en: JSON.stringify([
      'Grow certified rust-resistant wheat varieties recommended by ICAR-IIWBR.',
      'Spray Propiconazole 25% EC or Tebuconazole 25.9% EC at the first notice of pustules.',
      'Adhere to recommended sowing windows.'
    ]),
    reference_source: 'ICAR-Indian Institute of Wheat and Barley Research (IIWBR) Karnal',
    reference_url: 'https://iiwbr.icar.gov.in/'
  },

  // Triticale: Leaf Rust
  {
    crop: 'triticale',
    disease_key: 'triticale_leaf_rust',
    symptoms_mr: JSON.stringify([
      'पानांवर विखुरलेले तांबूस-नारंगी रंगाचे पुरळ (पुस्ट्यूल्स).',
      'पानांची अन्न तयार करण्याची क्षमता कमी होते आणि झाड अशक्त बनते.',
      'दाणे बारीक आणि हलके होतात.'
    ]),
    symptoms_hi: JSON.stringify([
      'पत्तियों पर बिखरे हुए नारंगी-भूरे रंग के दानेदार धब्बे (रतुआ)।',
      'पत्तियों का हरापन कम होता है जिससे पौधा कमजोर पड़ता है।',
      'दाने सिकुड़ जाते हैं।'
    ]),
    symptoms_en: JSON.stringify([
      'Scattered orange-brown uredinial pustules across upper leaf blades and leaf sheaths.',
      'Foliar chlorosis and reduced photosynthetic capacity.',
      'Impaired grain fill resulting in lighter test weight.'
    ]),
    management_mr: JSON.stringify([
      'प्रमाणित तांबेरा-प्रतिकारक वाणांची निवड करा.',
      'पिकाला संतुलित खते द्या; पोटाशचा योग्य वापर करा.',
      'प्रादुर्भाव वाढल्यास प्रोपिकोनाझोल २५% EC ची लेबलनुसार फवारणी करा.'
    ]),
    management_hi: JSON.stringify([
      'रोगरोधी किस्मों का चयन करें।',
      'संतुलित उर्वरक प्रबंधन अपनाएं, पोटाश का उचित प्रयोग करें।',
      'प्रकोप दिखने पर प्रोपिकोनाजोल 25% EC का लेबल अनुसार छिड़काव करें।'
    ]),
    management_en: JSON.stringify([
      'Select certified rust-tolerant triticale cultivars.',
      'Adopt balanced fertilizer application including adequate potassium.',
      'Apply Propiconazole 25% EC at disease onset in accordance with label instructions.'
    ]),
    reference_source: 'ICAR / CIMMYT Cereal Protection Guidelines',
    reference_url: 'https://iiwbr.icar.gov.in/'
  }
];

// Add model key aliases so queries with raw keys also resolve
const aliases = [
  { originalKey: 'potato_early_blight', aliasKey: 'potato___early_blight', crop: 'potato' },
  { originalKey: 'potato_late_blight', aliasKey: 'potato___late_blight', crop: 'potato' },
  { originalKey: 'pepper_bacterial_spot', aliasKey: 'pepper__bell___bacterial_spot', crop: 'pepper' }
];

const insertRefStmt = db.prepare(`
  INSERT INTO disease_references (
    crop, disease_key, symptoms_mr, symptoms_hi, symptoms_en,
    management_mr, management_hi, management_en, reference_source, reference_url
  )
  VALUES (
    @crop, @disease_key, @symptoms_mr, @symptoms_hi, @symptoms_en,
    @management_mr, @management_hi, @management_en, @reference_source, @reference_url
  )
  ON CONFLICT(crop, disease_key) DO UPDATE SET
    symptoms_mr = excluded.symptoms_mr,
    symptoms_hi = excluded.symptoms_hi,
    symptoms_en = excluded.symptoms_en,
    management_mr = excluded.management_mr,
    management_hi = excluded.management_hi,
    management_en = excluded.management_en,
    reference_source = excluded.reference_source,
    reference_url = excluded.reference_url
`);

for (const ref of diseaseReferencesData) {
  insertRefStmt.run(ref);
}

for (const a of aliases) {
  const base = diseaseReferencesData.find((r) => r.crop === a.crop && r.disease_key === a.originalKey);
  if (base) {
    insertRefStmt.run({ ...base, disease_key: a.aliasKey });
  }
}

/* ============================================================================
   DATA SEEDING: PRODUCTS (11 AUTHENTIC PRODUCTS MAPPED TO CROPS/DISEASES)
   Prices: Strictly NULL unless verified live feed available
   ============================================================================ */

const productsData = [
  {
    id: 1,
    name_en: 'Mancozeb 75% WP',
    name_hi: 'मैनकोजेब 75% WP',
    name_mr: 'मॅन्कोझेब 75% WP',
    brand: 'Indofil M-45 / Dithane M-45 (Reference)',
    manufacturer: 'Indofil Industries / UPL Ltd',
    active_ingredient: 'Mancozeb 75%',
    formulation: 'WP',
    category: 'fungicide',
    crop: 'Tomato, Potato, Grape, Cotton, Onion, Chilli, Bell Pepper',
    suitable_crop: 'Tomato, Potato, Grape, Cotton, Onion, Chilli, Bell Pepper',
    target_disease: 'Early Blight, Late Blight, Black Rot, Purple Blotch, Anthracnose, Leaf Spots',
    use_en: 'Protective broad-spectrum contact fungicide. Apply only where label permits.',
    use_hi: 'सुरक्षात्मक संपर्क फफूंदनाशक संदर्भ; केवल लेबल के अनुसार उपयोग करें।',
    use_mr: 'संरक्षक संपर्क बुरशीनाशक संदर्भ; फक्त लेबलनुसार वापरा.',
    price_inr: null,
    pack_size: '500 g',
    image: '/img/mancozeb.svg',
    image_url: '/img/mancozeb.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC (Govt. of India)',
    registration_note: 'Registered broad-spectrum contact dithiocarbamate fungicide. Dose must strictly follow container label.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 2,
    name_en: 'Copper Oxychloride 50% WP',
    name_hi: 'कॉपर ऑक्सीक्लोराइड 50% WP',
    name_mr: 'कॉपर ऑक्सिक्लोराइड 50% WP',
    brand: 'Blitox 50 / Fytolan / Blue Copper (Reference)',
    manufacturer: 'Rallis India / Crystal Crop Protection',
    active_ingredient: 'Copper oxychloride 50%',
    formulation: 'WP',
    category: 'bactericide',
    crop: 'Tomato, Potato, Grape, Cotton, Chilli, Bell Pepper',
    suitable_crop: 'Tomato, Potato, Grape, Cotton, Chilli, Bell Pepper',
    target_disease: 'Bacterial Spot, Bacterial Blight, Downy Mildew, Dieback',
    use_en: 'Contact fungicide and bactericide reference; follow approved container label.',
    use_hi: 'फफूंद/बैक्टीरिया प्रबंधन संदर्भ; स्वीकृत लेबल मानें।',
    use_mr: 'बुरशी/बॅक्टेरिया व्यवस्थापन संदर्भ; मंजूर लेबल पाळा.',
    price_inr: null,
    pack_size: '500 g',
    image: '/img/copper.svg',
    image_url: '/img/copper.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC (Govt. of India)',
    registration_note: 'Protective copper fungicide/bactericide. Verify crop-specific registration before use.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 3,
    name_en: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
    name_hi: 'अज़ॉक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC',
    name_mr: 'अॅझॉक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाझोल 11.4% SC',
    brand: 'Amistar Top / Godrej Custodia (Reference)',
    manufacturer: 'Syngenta India / Godrej Agrovet',
    active_ingredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4%',
    formulation: 'SC',
    category: 'fungicide',
    crop: 'Tomato, Potato, Grape, Soybean, Onion, Chilli, Bell Pepper',
    suitable_crop: 'Tomato, Potato, Grape, Soybean, Onion, Chilli, Bell Pepper',
    target_disease: 'Early Blight, Anthracnose, Purple Blotch, Frogeye Leaf Spot, Black Rot',
    use_en: 'Broad-spectrum systemic fungicide reference; exact dose must come from current approved label.',
    use_hi: 'रोग प्रबंधन संदर्भ; सही मात्रा वर्तमान स्वीकृत लेबल से लें।',
    use_mr: 'रोग व्यवस्थापन संदर्भ; अचूक मात्रा सध्याच्या मंजूर लेबलमधून घ्या.',
    price_inr: null,
    pack_size: '200 ml',
    image: '/img/mix.svg',
    image_url: '/img/mix.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC + ICAR',
    registration_note: 'Dual-action systemic fungicide (Strobilurin + Triazole). Follow approved label intervals.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 4,
    name_en: 'Metalaxyl 8% + Mancozeb 64% WP',
    name_hi: 'मेटालैक्सिल 8% + मैनकोजेब 64% WP',
    name_mr: 'मेटालॅक्सिल 8% + मॅन्कोझेब 64% WP',
    brand: 'Ridomil Gold / Krilaxyl (Reference)',
    manufacturer: 'Syngenta India / UPL Ltd',
    active_ingredient: 'Metalaxyl 8% + Mancozeb 64%',
    formulation: 'WP',
    category: 'fungicide',
    crop: 'Tomato, Potato, Grape',
    suitable_crop: 'Tomato, Potato, Grape',
    target_disease: 'Late Blight, Downy Mildew',
    use_en: 'Systemic and contact fungicide reference for late blight and downy mildew control.',
    use_hi: 'पछेती झुलसा और डाउनी मिल्ड्यू प्रबंधन हेतु प्रणालीगत व संपर्क फफूंदनाशक संदर्भ।',
    use_mr: 'लेट ब्लाइट आणि डाऊनी मिल्ड्यूसाठी आंतरप्रवाही व संपर्क बुरशीनाशक संदर्भ.',
    price_inr: null,
    pack_size: '500 g',
    image: '/img/metalaxyl.svg',
    image_url: '/img/metalaxyl.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC',
    registration_note: 'Approved for Oomycete diseases (Late Blight / Downy Mildew). Adhere to label guidelines.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 5,
    name_en: 'Propiconazole 25% EC',
    name_hi: 'प्रोपिकोनाज़ोल 25% EC',
    name_mr: 'प्रोपिकोनाझोल 25% EC',
    brand: 'Tilt / Bumper / Radar (Reference)',
    manufacturer: 'Syngenta India / ADAMA India',
    active_ingredient: 'Propiconazole 25%',
    formulation: 'EC',
    category: 'fungicide',
    crop: 'Wheat, Triticale, Cotton, Soybean',
    suitable_crop: 'Wheat, Triticale, Cotton, Soybean',
    target_disease: 'Leaf Rust (Brown Rust), Stripe Rust (Yellow Rust), Alternaria Leaf Spot',
    use_en: 'Systemic triazole fungicide reference for rusts and foliar leaf spot management.',
    use_hi: 'रतुआ (गेरुआ) और पत्ती धब्बा नियंत्रण हेतु प्रणालीगत ट्रायजोल फफूंदनाशक संदर्भ।',
    use_mr: 'तांबेरा व पानांवरील ठिपके नियंत्रणासाठी आंतरप्रवाही ट्रायझोल बुरशीनाशक संदर्भ.',
    price_inr: null,
    pack_size: '250 ml',
    image: '/img/propiconazole.svg',
    image_url: '/img/propiconazole.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC',
    registration_note: 'Standard cereal rust and leaf spot management molecule. Follow state university spray schedule.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 6,
    name_en: 'Tebuconazole 25.9% EC',
    name_hi: 'टेबुकोनाज़ोल 25.9% EC',
    name_mr: 'टेबुकोनाझोल 25.9% EC',
    brand: 'Folicur / Orius (Reference)',
    manufacturer: 'Bayer CropScience / ADAMA India',
    active_ingredient: 'Tebuconazole 25.9%',
    formulation: 'EC',
    category: 'fungicide',
    crop: 'Soybean, Onion, Wheat, Triticale, Grape',
    suitable_crop: 'Soybean, Onion, Wheat, Triticale, Grape',
    target_disease: 'Soybean Rust, Purple Blotch, Leaf Rust, Powdery Mildew',
    use_en: 'Broad-spectrum systemic triazole fungicide reference for rusts, blights and leaf spots.',
    use_hi: 'रतुआ, झुलसा और धब्बा प्रबंधन हेतु व्यापक असरदार प्रणालीगत फफूंदनाशक संदर्भ।',
    use_mr: 'तांबेरा, करपा आणि पानांवरील ठिपके नियंत्रणासाठी आंतरप्रवाही बुरशीनाशक संदर्भ.',
    price_inr: null,
    pack_size: '250 ml',
    image: '/img/tebuconazole.svg',
    image_url: '/img/tebuconazole.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC',
    registration_note: 'Broad-spectrum triazole fungicide. Verify state and crop-specific approval before use.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 7,
    name_en: 'Wettable Sulphur 80% WDG',
    name_hi: 'घुलनशील गंधक 80% WDG',
    name_mr: 'पाण्यात विरघळणारे गंधक 80% WDG',
    brand: 'Sulfex / Thiovit Jet (Reference)',
    manufacturer: 'Excel Crop Care / Syngenta India',
    active_ingredient: 'Sulphur 80%',
    formulation: 'WDG',
    category: 'fungicide',
    crop: 'Wheat, Grape, Chilli',
    suitable_crop: 'Wheat, Grape, Chilli',
    target_disease: 'Powdery Mildew, Mites',
    use_en: 'Protective contact fungicide and acaricide reference for powdery mildew control.',
    use_hi: 'चूर्णिल आसिता (पाउडरी मिल्ड्यू) प्रबंधन हेतु संपर्क फफूंदनाशक व कीटनाशक संदर्भ।',
    use_mr: 'भुरी रोग आणि कोळी नियंत्रणासाठी संपर्क बुरशीनाशक संदर्भ.',
    price_inr: null,
    pack_size: '1 kg',
    image: '/img/sulphur.svg',
    image_url: '/img/sulphur.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC',
    registration_note: 'Multi-site protective fungicide and acaricide. Do not spray during extreme heat.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 8,
    name_en: 'Dimethomorph 50% WP',
    name_hi: 'डाइमेथोमॉर्फ 50% WP',
    name_mr: 'डायमेथोमॉर्फ 50% WP',
    brand: 'Acrobat / Paraat (Reference)',
    manufacturer: 'BASF India / Dhanuka Agritech',
    active_ingredient: 'Dimethomorph 50%',
    formulation: 'WP',
    category: 'fungicide',
    crop: 'Grape, Potato, Tomato',
    suitable_crop: 'Grape, Potato, Tomato',
    target_disease: 'Downy Mildew, Late Blight',
    use_en: 'Translaminar oomycete fungicide reference for downy mildew and late blight management.',
    use_hi: 'डाउनी मिल्ड्यू व पछेती झुलसा प्रबंधन हेतु ट्रांसलामिनर फफूंदनाशक संदर्भ।',
    use_mr: 'डाऊनी मिल्ड्यू आणि लेट ब्लाइट व्यवस्थापनासाठी आंतरप्रवाही बुरशीनाशक संदर्भ.',
    price_inr: null,
    pack_size: '100 g',
    image: '/img/metalaxyl.svg',
    image_url: '/img/metalaxyl.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC',
    registration_note: 'Translaminar oomycete fungicide reference for downy mildew. Verify crop label clearance.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 9,
    name_en: 'Streptocycline Agricultural Bactericide',
    name_hi: 'स्ट्रेप्टोसाइक्लिन (जीवाणुनाशक संदर्भ)',
    name_mr: 'स्ट्रेप्टोसायक्लिन (जिवाणूनाशक संदर्भ)',
    brand: 'Streptocycline (Reference Market Standard)',
    manufacturer: 'Hindustan Antibiotics Ltd',
    active_ingredient: 'Streptomycin sulphate 90% + Tetracycline hydrochloride 10%',
    formulation: 'SP',
    category: 'bactericide',
    crop: 'Cotton, Tomato, Chilli, Bell Pepper',
    suitable_crop: 'Cotton, Tomato, Chilli, Bell Pepper',
    target_disease: 'Bacterial Blight, Bacterial Spot, Black Arm',
    use_en: 'Agricultural antibacterial reference. Use only under local expert recommendation with copper.',
    use_hi: 'कृषि जीवाणुनाशक संदर्भ। केवल कृषि विशेषज्ञ की सिफारिश पर कॉपर के साथ प्रयोग करें।',
    use_mr: 'कृषी जिवाणूनाशक संदर्भ. कृषी तज्ज्ञांच्या सल्ल्याने कॉपरसोबतच वापरा.',
    price_inr: null,
    pack_size: '6 g',
    image: '/img/copper.svg',
    image_url: '/img/copper.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'CIBRC Reference',
    registration_note: 'Agricultural antibacterial antibiotic. Strictly adhere to registered label precautions.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 10,
    name_en: 'Diafenthiuron 50% WP',
    name_hi: 'डायफेंथियूरॉन 50% WP',
    name_mr: 'डायफेन्थियुरॉन 50% WP',
    brand: 'Pegasus / Polo (Reference)',
    manufacturer: 'Syngenta India / Rallis India',
    active_ingredient: 'Diafenthiuron 50%',
    formulation: 'WP',
    category: 'insecticide',
    crop: 'Chilli, Cotton',
    suitable_crop: 'Chilli, Cotton',
    target_disease: 'Leaf Curl Vector (Whiteflies, Mites)',
    use_en: 'Insecticide and miticide reference for managing vector whiteflies and mites in viral disease control.',
    use_hi: 'वायरस फैलाने वाली सफेद मक्खी व माइट नियंत्रण हेतु कीटनाशक संदर्भ।',
    use_mr: 'विषाणू प्रसार रोखण्यासाठी पांढरी माशी व कोळी नियंत्रणासाठी कीटकनाशक संदर्भ.',
    price_inr: null,
    pack_size: '250 g',
    image: '/img/mix.svg',
    image_url: '/img/mix.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'PPQS / CIBRC',
    registration_note: 'Vector control only. Read label guidelines for precautions and waiting periods.',
    verification_status: 'Verified CIBRC Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  },
  {
    id: 11,
    name_en: 'Neem Oil (Azadirachtin 10000 ppm)',
    name_hi: 'नीम तेल (एज़ाडिरैक्टिन 10000 ppm)',
    name_mr: 'निंबोळी अर्क / तेल (अझाडिराक्टिन 10000 ppm)',
    brand: 'Neemraj / Nimbecidine (Reference)',
    manufacturer: 'T.Stanes / Multiplex Bio-Tech',
    active_ingredient: 'Azadirachtin 1% (10000 ppm)',
    formulation: 'EC',
    category: 'botanical',
    crop: 'Chilli, Tomato, Cotton, Soybean, Onion',
    suitable_crop: 'Chilli, Tomato, Cotton, Soybean, Onion',
    target_disease: 'Sucking Pests / Vector Deterrence',
    use_en: 'Botanical bio-pesticide reference for sucking insect vector deterrence. Follow container label.',
    use_hi: 'रस चूसक कीटों की रोकथाम हेतु वानस्पतिक जैव-कीटनाशक संदर्भ।',
    use_mr: 'रसशोषक किडींच्या प्रतिबंधासाठी सेंद्रिय वनस्पतीजन्य कीटकनाशक संदर्भ.',
    price_inr: null,
    pack_size: '500 ml',
    image: '/img/bio.svg',
    image_url: '/img/bio.svg',
    price_source: 'Seller feed required',
    price_updated_at: null,
    registration_source: 'CIBRC Botanical',
    registration_note: 'Approved botanical biopesticide under CIBRC. Safe for beneficial predators when used as directed.',
    verification_status: 'Verified CIBRC Botanical Registration',
    source_url: 'https://www.cibrc.nic.in/',
    manufacturer_source: 'https://www.cibrc.nic.in/',
    image_source: 'https://sheti-mitra.local'
  }
];

const insertProductStmt = db.prepare(`
  INSERT INTO products (
    id, name_en, name_hi, name_mr, brand, manufacturer, active_ingredient, formulation,
    crop, suitable_crop, target_disease, category, use_en, use_hi, use_mr,
    price_inr, pack_size, image, image_url, price_source, price_updated_at,
    registration_source, registration_note, verification_status, source_url,
    manufacturer_source, image_source
  )
  VALUES (
    @id, @name_en, @name_hi, @name_mr, @brand, @manufacturer, @active_ingredient, @formulation,
    @crop, @suitable_crop, @target_disease, @category, @use_en, @use_hi, @use_mr,
    @price_inr, @pack_size, @image, @image_url, @price_source, @price_updated_at,
    @registration_source, @registration_note, @verification_status, @source_url,
    @manufacturer_source, @image_source
  )
  ON CONFLICT(id) DO UPDATE SET
    name_en = excluded.name_en,
    name_hi = excluded.name_hi,
    name_mr = excluded.name_mr,
    brand = excluded.brand,
    manufacturer = excluded.manufacturer,
    active_ingredient = excluded.active_ingredient,
    formulation = excluded.formulation,
    crop = excluded.crop,
    suitable_crop = excluded.suitable_crop,
    target_disease = excluded.target_disease,
    category = excluded.category,
    use_en = excluded.use_en,
    use_hi = excluded.use_hi,
    use_mr = excluded.use_mr,
    price_inr = excluded.price_inr,
    pack_size = excluded.pack_size,
    image = excluded.image,
    image_url = excluded.image_url,
    price_source = excluded.price_source,
    price_updated_at = excluded.price_updated_at,
    registration_source = excluded.registration_source,
    registration_note = excluded.registration_note,
    verification_status = excluded.verification_status,
    source_url = excluded.source_url,
    manufacturer_source = excluded.manufacturer_source,
    image_source = excluded.image_source
`);

for (const p of productsData) {
  insertProductStmt.run(p);
}

/* ============================================================================
   DATA SEEDING: PURCHASE LINKS & PRODUCT PRICES
   ============================================================================ */

const insertPurchaseLinkStmt = db.prepare(`
  INSERT INTO purchase_links (product_id, seller, url, link_type, badge)
  VALUES (?, ?, ?, ?, ?)
`);

// Clear and refresh purchase links
db.exec('DELETE FROM purchase_links');

for (const p of productsData) {
  const searchTerm = encodeURIComponent(`${p.name_en} ${p.brand ? p.brand.split('/')[0].trim() : ''}`.trim());

  // Search on Amazon link
  insertPurchaseLinkStmt.run(
    p.id,
    'Amazon',
    `https://www.amazon.in/s?k=${searchTerm}`,
    'search',
    'Search on Amazon'
  );

  // Search on Flipkart link
  insertPurchaseLinkStmt.run(
    p.id,
    'Flipkart',
    `https://www.flipkart.com/search?q=${searchTerm}`,
    'search',
    'Search on Flipkart'
  );

  // Official CIBRC Registry link
  insertPurchaseLinkStmt.run(
    p.id,
    'Official / Agri Registry',
    p.source_url || 'https://www.cibrc.nic.in/',
    'direct',
    'Official CIBRC Registry'
  );
}

/* ============================================================================
   DATA SEEDING: DISEASE PRODUCT LINKS
   Links every crop & disease to 1-3 suitable products
   ============================================================================ */

const diseaseProductLinksData = [
  // Tomato: Early Blight -> Mancozeb, Copper Oxychloride, Azoxystrobin+Difenoconazole
  { crop: 'tomato', disease_key: 'tomato_early_blight', product_id: 1, recommendation_priority: 1 },
  { crop: 'tomato', disease_key: 'tomato_early_blight', product_id: 2, recommendation_priority: 2 },
  { crop: 'tomato', disease_key: 'tomato_early_blight', product_id: 3, recommendation_priority: 3 },
  { crop: 'tomato', disease_key: 'early_blight', product_id: 1, recommendation_priority: 1 },
  { crop: 'tomato', disease_key: 'early_blight', product_id: 2, recommendation_priority: 2 },
  { crop: 'tomato', disease_key: 'early_blight', product_id: 3, recommendation_priority: 3 },

  // Tomato: Late Blight -> Metalaxyl+Mancozeb, Mancozeb
  { crop: 'tomato', disease_key: 'tomato_late_blight', product_id: 4, recommendation_priority: 1 },
  { crop: 'tomato', disease_key: 'tomato_late_blight', product_id: 1, recommendation_priority: 2 },
  { crop: 'tomato', disease_key: 'late_blight', product_id: 4, recommendation_priority: 1 },
  { crop: 'tomato', disease_key: 'late_blight', product_id: 1, recommendation_priority: 2 },

  // Tomato: Bacterial Spot -> Copper Oxychloride, Streptocycline
  { crop: 'tomato', disease_key: 'tomato_bacterial_spot', product_id: 2, recommendation_priority: 1 },
  { crop: 'tomato', disease_key: 'tomato_bacterial_spot', product_id: 9, recommendation_priority: 2 },
  { crop: 'tomato', disease_key: 'bacterial_spot', product_id: 2, recommendation_priority: 1 },

  // Tomato: Target Spot -> Azoxystrobin+Difenoconazole, Mancozeb
  { crop: 'tomato', disease_key: 'tomato_target_spot', product_id: 3, recommendation_priority: 1 },
  { crop: 'tomato', disease_key: 'tomato_target_spot', product_id: 1, recommendation_priority: 2 },
  { crop: 'tomato', disease_key: 'tomato__target_spot', product_id: 3, recommendation_priority: 1 },

  // Potato: Early Blight -> Mancozeb, Azoxystrobin+Difenoconazole
  { crop: 'potato', disease_key: 'potato_early_blight', product_id: 1, recommendation_priority: 1 },
  { crop: 'potato', disease_key: 'potato_early_blight', product_id: 3, recommendation_priority: 2 },
  { crop: 'potato', disease_key: 'potato___early_blight', product_id: 1, recommendation_priority: 1 },
  { crop: 'potato', disease_key: 'potato___early_blight', product_id: 3, recommendation_priority: 2 },
  { crop: 'potato', disease_key: 'early_blight', product_id: 1, recommendation_priority: 1 },

  // Potato: Late Blight -> Metalaxyl+Mancozeb, Mancozeb
  { crop: 'potato', disease_key: 'potato_late_blight', product_id: 4, recommendation_priority: 1 },
  { crop: 'potato', disease_key: 'potato_late_blight', product_id: 1, recommendation_priority: 2 },
  { crop: 'potato', disease_key: 'potato___late_blight', product_id: 4, recommendation_priority: 1 },
  { crop: 'potato', disease_key: 'potato___late_blight', product_id: 1, recommendation_priority: 2 },
  { crop: 'potato', disease_key: 'late_blight', product_id: 4, recommendation_priority: 1 },

  // Grape: Black Rot -> Azoxystrobin+Difenoconazole, Mancozeb
  { crop: 'grape', disease_key: 'grape_black_rot', product_id: 3, recommendation_priority: 1 },
  { crop: 'grape', disease_key: 'grape_black_rot', product_id: 1, recommendation_priority: 2 },
  { crop: 'grape', disease_key: 'black_rot', product_id: 3, recommendation_priority: 1 },
  { crop: 'grape', disease_key: 'black_rot', product_id: 1, recommendation_priority: 2 },

  // Grape: Downy Mildew -> Copper Oxychloride, Dimethomorph, Metalaxyl+Mancozeb
  { crop: 'grape', disease_key: 'grape_downy_mildew', product_id: 2, recommendation_priority: 1 },
  { crop: 'grape', disease_key: 'grape_downy_mildew', product_id: 8, recommendation_priority: 2 },
  { crop: 'grape', disease_key: 'grape_downy_mildew', product_id: 4, recommendation_priority: 3 },
  { crop: 'grape', disease_key: 'downy_mildew', product_id: 2, recommendation_priority: 1 },

  // Cotton: Bacterial Blight -> Copper Oxychloride, Streptocycline
  { crop: 'cotton', disease_key: 'cotton_bacterial_blight', product_id: 2, recommendation_priority: 1 },
  { crop: 'cotton', disease_key: 'cotton_bacterial_blight', product_id: 9, recommendation_priority: 2 },
  { crop: 'cotton', disease_key: 'bacterial_blight', product_id: 2, recommendation_priority: 1 },

  // Cotton: Alternaria Leaf Spot -> Propiconazole, Mancozeb
  { crop: 'cotton', disease_key: 'cotton_alternaria_leaf_spot', product_id: 5, recommendation_priority: 1 },
  { crop: 'cotton', disease_key: 'cotton_alternaria_leaf_spot', product_id: 1, recommendation_priority: 2 },
  { crop: 'cotton', disease_key: 'alternaria_leaf_spot', product_id: 5, recommendation_priority: 1 },

  // Soybean: Frogeye Leaf Spot -> Azoxystrobin+Difenoconazole, Tebuconazole
  { crop: 'soybean', disease_key: 'soybean_frogeye_leaf_spot', product_id: 3, recommendation_priority: 1 },
  { crop: 'soybean', disease_key: 'soybean_frogeye_leaf_spot', product_id: 6, recommendation_priority: 2 },
  { crop: 'soybean', disease_key: 'frogeye_leaf_spot', product_id: 3, recommendation_priority: 1 },

  // Soybean: Rust -> Tebuconazole, Propiconazole
  { crop: 'soybean', disease_key: 'soybean_rust', product_id: 6, recommendation_priority: 1 },
  { crop: 'soybean', disease_key: 'soybean_rust', product_id: 5, recommendation_priority: 2 },
  { crop: 'soybean', disease_key: 'rust', product_id: 6, recommendation_priority: 1 },

  // Onion: Purple Blotch -> Mancozeb, Tebuconazole, Azoxystrobin+Difenoconazole
  { crop: 'onion', disease_key: 'onion_purple_blotch', product_id: 1, recommendation_priority: 1 },
  { crop: 'onion', disease_key: 'onion_purple_blotch', product_id: 6, recommendation_priority: 2 },
  { crop: 'onion', disease_key: 'onion_purple_blotch', product_id: 3, recommendation_priority: 3 },
  { crop: 'onion', disease_key: 'purple_blotch', product_id: 1, recommendation_priority: 1 },

  // Chilli: Anthracnose -> Azoxystrobin+Difenoconazole, Copper Oxychloride, Mancozeb
  { crop: 'chilli', disease_key: 'chilli_anthracnose', product_id: 3, recommendation_priority: 1 },
  { crop: 'chilli', disease_key: 'chilli_anthracnose', product_id: 2, recommendation_priority: 2 },
  { crop: 'chilli', disease_key: 'chilli_anthracnose', product_id: 1, recommendation_priority: 3 },
  { crop: 'chilli', disease_key: 'anthracnose', product_id: 3, recommendation_priority: 1 },

  // Chilli: Leaf Curl Virus -> Diafenthiuron (vector), Neem Oil (botanical)
  { crop: 'chilli', disease_key: 'chilli_leaf_curl', product_id: 10, recommendation_priority: 1 },
  { crop: 'chilli', disease_key: 'chilli_leaf_curl', product_id: 11, recommendation_priority: 2 },
  { crop: 'chilli', disease_key: 'leaf_curl', product_id: 10, recommendation_priority: 1 },

  // Bell Pepper: Bacterial Spot -> Copper Oxychloride, Streptocycline
  { crop: 'pepper', disease_key: 'pepper_bacterial_spot', product_id: 2, recommendation_priority: 1 },
  { crop: 'pepper', disease_key: 'pepper_bacterial_spot', product_id: 9, recommendation_priority: 2 },
  { crop: 'pepper', disease_key: 'pepper__bell___bacterial_spot', product_id: 2, recommendation_priority: 1 },
  { crop: 'pepper', disease_key: 'pepper__bell___bacterial_spot', product_id: 9, recommendation_priority: 2 },
  { crop: 'pepper', disease_key: 'bacterial_spot', product_id: 2, recommendation_priority: 1 },

  // Bell Pepper: Anthracnose -> Azoxystrobin+Difenoconazole, Mancozeb
  { crop: 'pepper', disease_key: 'pepper_anthracnose', product_id: 3, recommendation_priority: 1 },
  { crop: 'pepper', disease_key: 'pepper_anthracnose', product_id: 1, recommendation_priority: 2 },
  { crop: 'pepper', disease_key: 'anthracnose', product_id: 3, recommendation_priority: 1 },

  // Wheat: Leaf Rust -> Propiconazole, Tebuconazole
  { crop: 'wheat', disease_key: 'wheat_leaf_rust', product_id: 5, recommendation_priority: 1 },
  { crop: 'wheat', disease_key: 'wheat_leaf_rust', product_id: 6, recommendation_priority: 2 },
  { crop: 'wheat', disease_key: 'leaf_rust', product_id: 5, recommendation_priority: 1 },

  // Wheat: Powdery Mildew -> Wettable Sulphur, Propiconazole
  { crop: 'wheat', disease_key: 'wheat_powdery_mildew', product_id: 7, recommendation_priority: 1 },
  { crop: 'wheat', disease_key: 'wheat_powdery_mildew', product_id: 5, recommendation_priority: 2 },
  { crop: 'wheat', disease_key: 'powdery_mildew', product_id: 7, recommendation_priority: 1 },

  // Triticale: Leaf Rust -> Propiconazole, Tebuconazole
  { crop: 'triticale', disease_key: 'triticale_leaf_rust', product_id: 5, recommendation_priority: 1 },
  { crop: 'triticale', disease_key: 'triticale_leaf_rust', product_id: 6, recommendation_priority: 2 },
  { crop: 'triticale', disease_key: 'leaf_rust', product_id: 5, recommendation_priority: 1 },

  // Triticale: Stripe Rust -> Propiconazole
  { crop: 'triticale', disease_key: 'triticale_stripe_rust', product_id: 5, recommendation_priority: 1 },
  { crop: 'triticale', disease_key: 'stripe_rust', product_id: 5, recommendation_priority: 1 }
];

const insertLinkStmt = db.prepare(`
  INSERT INTO disease_product_links (crop, disease_key, product_id, recommendation_priority, verified, source, source_url)
  VALUES (@crop, @disease_key, @product_id, @recommendation_priority, 1, 'CIBRC & ICAR Reference Guide', 'https://www.cibrc.nic.in/')
  ON CONFLICT(crop, disease_key, product_id) DO UPDATE SET
    recommendation_priority = excluded.recommendation_priority,
    source = excluded.source,
    source_url = excluded.source_url,
    verified = excluded.verified
`);

for (const link of diseaseProductLinksData) {
  insertLinkStmt.run(link);
}

/* ============================================================================
   QUERY HELPERS & API FORMATTERS
   ============================================================================ */

export function normalizeKey(key) {
  return String(key || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function isHttpsSource(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function formatProduct(p) {
  /* --------------------------------------------------------------------------
     VERIFIED PRICE: prefer a verified row in product_prices (HTTPS source +
     timestamp); fall back to the product's own verified price fields.
     Never fabricate a price — without provenance the price stays null.
     -------------------------------------------------------------------------- */
  const verifiedPriceRow = db.prepare(`
    SELECT price, seller, pack_size, source, checked_at
    FROM product_prices
    WHERE product_id = ?
      AND is_verified = 1
      AND price IS NOT NULL
      AND checked_at IS NOT NULL
    ORDER BY checked_at DESC
    LIMIT 1
  `).get(p.id);

  const rowPriceValid = Boolean(
    verifiedPriceRow
    && verifiedPriceRow.price !== null
    && verifiedPriceRow.price > 0
    && isHttpsSource(verifiedPriceRow.source)
    && verifiedPriceRow.checked_at
  );

  const hasVerifiedPrice = rowPriceValid || (
    p.price_inr !== null &&
    p.price_inr !== undefined &&
    p.price_inr > 0 &&
    isHttpsSource(p.price_source) &&
    Boolean(p.price_updated_at)
  );

  const priceVal = rowPriceValid
    ? verifiedPriceRow.price
    : (hasVerifiedPrice ? p.price_inr : null);

  const priceSeller = rowPriceValid ? verifiedPriceRow.seller : (hasVerifiedPrice ? (p.seller || 'Verified Seller') : null);
  const pricePackSize = rowPriceValid ? (verifiedPriceRow.pack_size || p.pack_size) : p.pack_size;
  const priceCheckedAt = rowPriceValid ? verifiedPriceRow.checked_at : (hasVerifiedPrice ? p.price_updated_at : null);
  const priceSourceUrl = rowPriceValid ? verifiedPriceRow.source : (hasVerifiedPrice ? p.price_source : null);

  const priceStatusText = hasVerifiedPrice
    ? `₹${priceVal} (Current online price)`
    : 'Price unavailable — check seller';

  /* --------------------------------------------------------------------------
     WHERE TO BUY: only links that actually exist in the purchase_links table
     and pass HTTPS provenance. No URLs are invented here.
     -------------------------------------------------------------------------- */
  const purchaseLinks = db.prepare(`
    SELECT seller, url, link_type, badge
    FROM purchase_links
    WHERE product_id = ?
  `).all(p.id).filter((link) => isHttpsSource(link.url));

  const officialSourceUrl = isHttpsSource(p.source_url || '') ? p.source_url : 'https://www.cibrc.nic.in/';

  return {
    id: p.id,
    name: p.name_en,
    name_en: p.name_en,
    name_hi: p.name_hi,
    name_mr: p.name_mr,
    brand: p.brand || 'Verified Agricultural Standard',
    manufacturer: p.manufacturer || 'Approved Manufacturer',
    activeIngredient: p.active_ingredient,
    active_ingredient: p.active_ingredient,
    formulation: p.formulation,
    category: p.category || 'fungicide',
    crop: p.crop,
    suitableCrop: p.suitable_crop || p.crop,
    suitable_crop: p.suitable_crop || p.crop,
    targetDisease: p.target_disease || 'Crop Diseases',
    target_disease: p.target_disease || 'Crop Diseases',
    packSize: p.pack_size,
    pack_size: p.pack_size,
    imageUrl: p.image_url || p.image || '/img/mix.svg',
    image: p.image_url || p.image || '/img/mix.svg',
    price: priceVal,
    price_inr: priceVal,
    priceStatus: priceStatusText,
    price_source: hasVerifiedPrice ? priceSourceUrl : 'Seller feed required',
    price_updated_at: priceCheckedAt,
    priceCheckedAt: priceCheckedAt,
    seller: priceSeller,
    packSizeVerified: pricePackSize,
    productUrl: null,
    purchaseLinks,
    amazonUrl: null,
    flipkartUrl: null,
    sourceUrl: officialSourceUrl,
    source_url: officialSourceUrl,
    verificationStatus: p.verification_status || 'Verified CIBRC Registration',
    registration_source: p.registration_source || 'PPQS / CIBRC',
    registration_note: p.registration_note || 'Verify container label instructions before application.',
    use_en: p.use_en,
    use_hi: p.use_hi,
    use_mr: p.use_mr,
    details: p.use_en
  };
}

export function getDiseaseReference(crop, diseaseKey) {
  const rawKey = String(diseaseKey || '').trim().toLowerCase();
  const norm = normalizeKey(diseaseKey);
  const cropLower = String(crop || '').trim().toLowerCase();

  const row = db.prepare(`
    SELECT * FROM disease_references
    WHERE LOWER(crop) = ?
      AND (
        LOWER(disease_key) = ?
        OR LOWER(disease_key) = ?
        OR LOWER(disease_key) LIKE ?
        OR ? LIKE '%' || LOWER(disease_key) || '%'
      )
    LIMIT 1
  `).get(cropLower, rawKey, norm, `%${norm}%`, norm);

  if (!row) return null;

  const parseJson = (val) => {
    try {
      return JSON.parse(val || '[]');
    } catch {
      return [];
    }
  };

  return {
    crop: row.crop,
    disease_key: row.disease_key,
    symptoms: {
      mr: parseJson(row.symptoms_mr),
      hi: parseJson(row.symptoms_hi),
      en: parseJson(row.symptoms_en)
    },
    management: {
      mr: parseJson(row.management_mr),
      hi: parseJson(row.management_hi),
      en: parseJson(row.management_en)
    },
    source: row.reference_source,
    url: row.reference_url
  };
}

export function getProductsForDisease(crop, diseaseKey) {
  const rawKey = String(diseaseKey || '').trim().toLowerCase();
  const normKey = normalizeKey(rawKey);
  const cropLower = String(crop || '').trim().toLowerCase();

  // 1. Direct query through disease_product_links
  const rows = db.prepare(`
    SELECT p.*, l.recommendation_priority
    FROM products p
    JOIN disease_product_links l ON l.product_id = p.id
    WHERE LOWER(l.crop) = ?
      AND (
        LOWER(l.disease_key) = ?
        OR LOWER(l.disease_key) = ?
        OR LOWER(l.disease_key) LIKE ?
        OR ? LIKE '%' || LOWER(l.disease_key) || '%'
      )
    ORDER BY l.recommendation_priority ASC, p.id ASC
  `).all(cropLower, rawKey, normKey, `%${normKey}%`, normKey);

  const seen = new Set();
  const distinct = [];
  for (const r of rows) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      distinct.push(r);
    }
  }

  if (distinct.length > 0) {
    return distinct.map(formatProduct);
  }

  // 2. Fallback query matching crop and target_disease
  const fallbackRows = db.prepare(`
    SELECT p.*, 2 as recommendation_priority
    FROM products p
    WHERE (LOWER(p.crop) LIKE ? OR LOWER(p.suitable_crop) LIKE ?)
      AND (
        LOWER(p.target_disease) LIKE ?
        OR LOWER(p.target_disease) LIKE ?
        OR ? LIKE '%' || LOWER(p.name_en) || '%'
      )
    ORDER BY p.id ASC
  `).all(`%${cropLower}%`, `%${cropLower}%`, `%${rawKey}%`, `%${normKey}%`, rawKey);

  for (const r of fallbackRows) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      distinct.push(r);
    }
  }

  return distinct.map(formatProduct);
}

export function getAllProducts() {
  const rows = db.prepare('SELECT * FROM products ORDER BY id ASC').all();
  return rows.map(formatProduct);
}

export function logScanToDb(crop, disease, confidence, imageName, modelVersion, userId = null, status = null) {
  return db.prepare(`
    INSERT INTO scans (crop, predicted_disease, confidence, image_name, model_version, user_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(crop, disease, confidence, imageName || null, modelVersion || null, userId ?? null, status || null);
}

export function getRecentScans(limit = 20, userId = null) {
  // A user only ever sees their own scans. Anonymous scans (user_id IS NULL)
  // are never returned to anyone — legacy rows stay in the table untouched.
  if (userId === null || userId === undefined) {
    return [];
  }
  return db.prepare(`
    SELECT * FROM scans
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT ?
  `).all(userId, limit);
}

/* ============================================================================
   AUTH: USERS & SESSIONS
   ============================================================================ */

export function findUserByMobile(mobile) {
  return db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile) || null;
}

export function findUserByEmail(email) {
  if (!email) return null;
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) || null;
}

export function insertUser({ name, mobile, email, passwordHash }) {
  const info = db.prepare(`
    INSERT INTO users (name, mobile, email, password_hash)
    VALUES (?, ?, ?, ?)
  `).run(name, mobile, email || null, passwordHash);
  return getUserById(info.lastInsertRowid);
}

export function getUserById(id) {
  return db.prepare('SELECT id, name, mobile, email, created_at FROM users WHERE id = ?').get(id) || null;
}

export function createSession(tokenHash, userId, expiresAtIso) {
  db.prepare(`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(tokenHash, userId, expiresAtIso);
}

export function getSessionUser(tokenHash) {
  const row = db.prepare(`
    SELECT u.id, u.name, u.mobile, u.email, u.created_at, s.expires_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ?
  `).get(tokenHash);

  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
    return null;
  }
  return { id: row.id, name: row.name, mobile: row.mobile, email: row.email, createdAt: row.created_at };
}

export function deleteSession(tokenHash) {
  return db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash).changes;
}

export { db };
