# ShetiMitra AI

Plantix-inspired, independently branded multilingual farming web app (Marathi/Hindi/English).

## Run
1. Install Node.js 20+.
2. `npm install`
3. `npm start`
4. Open `http://localhost:3000` (or `PORT=8080 npm start` for another port)

## Test
`npm test` runs the full end-to-end suite (`test_complete_workflow.js`). It spawns its
own server instances on dedicated ports, so a running dev server is not required.

## Included
- Responsive farmer-first UI
- Marathi/Hindi/English switcher
- Crop photo upload + preview
- `/api/scan` screening endpoint with real AI statuses
- SQLite database: 10 crops, 38 diseases, 11 products, 23 disease references,
  76 disease→product links, 33 purchase links
- Low-confidence safety gating (0.80) enforced on server AND frontend
- Verified medicine/product cards with source attribution
- Live-price architecture: prices display only with a verified seller feed
  (HTTPS source + timestamp); otherwise the UI says "Price unavailable"
- Farmer accounts (signup/login/logout), bcrypt password hashing, per-user scan history
- Basic PWA shell (manifest + service worker; API calls are never cached)

## AI statuses & safety gating
`/api/scan` returns a real `status` — never a fake confident diagnosis:

| status | meaning | products | UI |
|---|---|---|---|
| `diagnosed` | real model, confidence ≥ 0.80 | verified products (unless healthy) | AI SCREENING RESULT |
| `uncertain` | real model, confidence < 0.80 | none | निश्चित निदान झाले नाही |
| `crop_mismatch` | photo identified as a different crop | none | निवडलेले पीक आणि फोटो जुळत नाहीत. |
| `model_unavailable` | configured model failed to run | none | या पिकासाठी सध्या AI model उपलब्ध नाही. |
| `model_unconfigured` | adapter without usable artifacts | none | या पिकासाठी सध्या AI model उपलब्ध नाही. |
| `demo` | crop has no integrated model (clearly labelled) | none | DEMO banner |

Key rules, enforced **both server-side and client-side**:
- Confidence below the configured minimum is shown as "निश्चित निदान झाले नाही" and
  **never** triggers pesticide/medicine recommendations.
- The minimum score is taken from the existing configuration
  (`CROP_DIAGNOSIS_MIN_CONFIDENCE`, default `0.80`); no second threshold is used.
- `uncertain` results still show reference/management guidance when available.
- Every result carries "AI screening result — not a confirmed agronomic diagnosis."
- `crop_mismatch`, `model_unavailable` and `model_unconfigured` are shown as-is;
  only the clearly-labelled demo fallback produces a demo disease result.

## Authentication & scan history
- `POST /api/auth/signup` → creates the account (name, unique mobile, optional
  unique email, bcrypt-hashed password), starts a session (HttpOnly cookie) and
  the UI signs the farmer straight into the dashboard.
- `POST /api/auth/login` accepts mobile **or** email + password.
- `POST /api/auth/logout`, `GET /api/auth/me`.
- `GET /api/scans` returns **only the logged-in user's** scans. Anonymous callers
  receive an empty list. Existing anonymous scan rows stay in the database but are
  never exposed to anyone. `user_id` (+ `status`) columns were added by migration.

## Local crop diagnosis model
The project includes a server-side ONNX export from the MIT-licensed [Rishmina Plant Disease Detection repository](https://github.com/Rishmina/plant-disease-detection-resnet50). Inference runs in Node using the ONNX Runtime Web WASM backend and Sharp; the image is never sent to a paid API and no API key is used. The model and its external tensor data are stored under `models/`, with the source license and ordered class/preprocessing manifest alongside them.

The current ONNX checkpoint covers **3 real ONNX-supported crops** — Tomato, Potato, Bell Pepper (15 PlantVillage classes). **7 crops use the clearly-labelled demo fallback**: Grape, Cotton, Soybean, Onion, Chilli, Wheat, Triticale. Total: **10 supported crops**. A crop-to-model registry keeps these adapters separate; no crop is ever routed through another crop's classifier.

The integrated model was trained on clean PlantVillage-style images; field-image performance can be lower. Its softmax score is not a guarantee or a clinically calibrated probability. Results are screening/decision support only. Healthy classes are displayed as healthy and never trigger pesticide recommendations. Confidence below `0.80` is shown as "निश्चित निदान झाले नाही" and suppresses product recommendations.

The minimum score defaults to `0.80`. To change the cutoff or point to another compatible local ONNX export, set server environment variables before `npm start`:

```powershell
$env:CROP_DIAGNOSIS_MIN_CONFIDENCE = "0.80"
# Optional paths for a compatible model, external ONNX data, and ordered labels.
$env:CROP_DISEASE_MODEL_PATH = "models/plant_disease_model_v2.onnx"
$env:CROP_DISEASE_MODEL_DATA_PATH = "models/plant_disease_model_v2.onnx.data"
$env:CROP_DISEASE_LABELS_PATH = "models/plantvillage-labels.json"
npm start
```

### Crop model audit
| Crop | Model/source checked | License and artifact | Current status |
|---|---|---|---|
| Tomato, Potato, Bell Pepper | Rishmina Plant Disease Detection | MIT; ONNX + external tensor data, included under `models/` | Integrated server-side; 15 classes across these three crops |
| Wheat | [ChashiBhAI Wheat Disease Classifier](https://huggingface.co/Shaq2/chashibhai-wheat-disease-cls) | MIT; TFLite, 11 labels | Not integrated: no documented held-out accuracy was found and the project's tested inference runtime is ONNX, not TFLite |
| Cotton | [Cotton Disease Detection](https://huggingface.co/varun2k4/Cotton_Disease_Detection) | MIT; Keras weights | Not integrated: the published card does not provide an ordered class map, preprocessing contract, or validation results |
| Grape | [IXR Grape Disease Classifier](https://huggingface.co/ixrbhii/grape-disease-convnext) | CC-BY-4.0; PyTorch safetensors | Not integrated: no ONNX export is published; reported score is from the same source domain, not field validation |
| Soybean | [IXR Soybean Disease Classifier](https://huggingface.co/ixrbhii/soybean-disease-convnext) | CC-BY-4.0; PyTorch safetensors | Not integrated: no ONNX export is published; reported score is from the same source domain, not field validation |
| Onion | [Onion Leaf Disease v2](https://huggingface.co/appdevop666/onion-leaf-disease-v2-hf) | No declared license found | Not integrated or redistributed |
| Chilli | No verifiable, openly licensed compatible checkpoint found in the checked model sources | — | Unavailable |
| Triticale | No verifiable, openly licensed compatible checkpoint found in the checked model sources | — | Unavailable |

Grape and Soybean have crop-specific adapters and a reproducible exporter at `scripts/export_crop_models.py`; it reads each repository's ordered labels and emits separate ONNX files/manifests. Export dependencies are listed in `requirements-model-export.txt` and are not Node runtime dependencies. The exporter could not run on this Windows host because PyTorch's `c10.dll` failed to initialize, so those ONNX artifacts are not present and the adapters remain safely unavailable until exported and validated. Cotton/Wheat need a supported runtime and complete validation metadata. Do not route any crop through another crop's model. Onion's model cannot be treated as open-source without a license. The registry is the extension point for adding adapters once compatible weights, class order, preprocessing, license, and validation evidence are in place.

The integrated model was trained on clean PlantVillage-style images; field-image performance can be lower. Its softmax score is not a guarantee or a clinically calibrated probability. Results are screening/decision support only. Healthy classes are displayed as healthy and never trigger pesticide recommendations. Confidence below `0.80` is shown as “निश्चित निदान झाले नाही” and suppresses product recommendations.

The minimum score defaults to `0.80`. To change the cutoff or point to another compatible local ONNX export, set server environment variables before `npm start`:

```powershell
$env:CROP_DIAGNOSIS_MIN_CONFIDENCE = "0.80"
# Optional paths for a compatible model, external ONNX data, and ordered labels.
$env:CROP_DISEASE_MODEL_PATH = "models/plant_disease_model_v2.onnx"
$env:CROP_DISEASE_MODEL_DATA_PATH = "models/plant_disease_model_v2.onnx.data"
$env:CROP_DISEASE_LABELS_PATH = "models/plantvillage-labels.json"
npm start
```

If the model or its data is missing for a crop without an adapter, the app uses the
clearly-labelled demo fallback. If a *configured* model cannot load or run, the
API answers `model_unavailable` instead of fabricating a disease; confidence
scores below the minimum are marked `uncertain` and cannot return product
recommendations.

## Verified diagnosis data
The database seeds `disease_references` (23 rows: trilingual symptom/management
text with `reference_source` and HTTPS `reference_url`), `disease_product_links`
(76 verified crop→disease→product links), `products` (11) and `purchase_links`
(33: Amazon, Flipkart and official-registry search links per product).

Product manufacturer and image fields require HTTPS `manufacturer_source` and
`image_source` values. A price is displayed only when a verified price exists
(`product_prices` row with `is_verified = 1`, HTTPS `source` and `checked_at`,
or a product row with `price_inr` + HTTPS `price_source` + `price_updated_at`);
otherwise the UI says "Price unavailable". The seeded catalog has no verified
prices by design.

The endpoint contract is provider-neutral; an adapter or gateway is required if the selected model provider uses a different request or response format. A model result is screening/decision support, not a confirmed diagnosis. Follow local expert advice and the current approved product label.

## Production price data
Connect an authorized seller/catalog feed. Store rows in `product_prices` with
`is_verified = 1`, HTTPS `source` and `checked_at`; the product payload then
shows Price, Seller, Pack size and Last checked. Do not scrape or invent
prices. Display the seller/source and timestamp.

## Where to Buy
Product cards render **only** the links that actually exist in the
`purchase_links` table (currently Amazon, Flipkart and official-registry search
links for each product). Missing sellers are simply not shown — no URLs are
invented, and no fake ₹0 placeholder prices are displayed.

## Trust sources
- ICAR crop protection/advisories
- PPQS/CIBRC registration and label references
- Authorized manufacturer/seller catalogs for product images and retail prices

This starter is not medical/agronomic advice and does not authorize pesticide use. Crop/product eligibility and dose must come from the current approved label and local expert guidance.
