const scanCopy = {
  mr: {
    title: 'फोटो स्कॅन करा', uploadTitle: 'पिकाच्या पानाचा फोटो निवडा',
    uploadText: 'JPG, PNG किंवा WEBP • कमाल 8 MB', choose: 'फोटो निवडा',
    camera: 'कॅमेऱ्याने फोटो काढा', selected: 'निवडलेला फोटो', remove: 'फोटो काढा',
    crop: 'पीक निवडा', scan: 'रोग तपासा',
    note: 'Demo/Screening: पिक किंवा रोग फोटोवरून ओळखणारे AI model सध्या जोडलेले नाही. पीक निवड तपासा; हा निकाल निदान नाही.',
    invalid: 'कृपया JPG, PNG किंवा इतर image फाइल निवडा.', empty: 'निवडलेली image फाइल रिकामी आहे. दुसरा फोटो निवडा.', tooLarge: 'फोटोचा आकार 8 MB पेक्षा कमी असावा.',
    noPhoto: 'स्कॅन सुरू करण्यापूर्वी पानाचा फोटो निवडा.', loading: 'प्रतिमा आणि पीक माहिती पाठवत आहोत…',
    failed: 'फोटो तपासता आला नाही. इंटरनेट कनेक्शन तपासून पुन्हा प्रयत्न करा.',
    disease: 'संभाव्य रोग', healthy: 'निरोगी', confidence: 'विश्वास पातळी', recommendations: 'उत्पादन शिफारसी',
    healthyNotice: 'या model ने पान निरोगी म्हणून वर्गीकृत केले. औषधाची शिफारस केलेली नाही.',
    precautions: 'लक्षणे व काळजी',
    demo: 'Demo / Screening', demoNotice: 'या प्रतिमेसाठी रोग ओळखणारे model जोडलेले नाही. त्यामुळे कोणताही रोग किंवा confidence या स्कॅनने ठरवलेला नाही.',
    noModelResult: 'प्रतिमेचे निदान उपलब्ध नाही', description: 'रोगाची माहिती', symptoms: 'दिसू शकणारी लक्षणे', management: 'व्यवस्थापन',
    aiUnavailable: 'AI रोग निदान सध्या उपलब्ध नाही.',
    diagnosisUncertain: 'निश्चित निदान झाले नाही', lowConfidenceNotice: 'या model निकालाची विश्वास पातळी 0.80 पेक्षा कमी आहे. औषध किंवा कीटकनाशक शिफारस केलेले नाही.',
    providerUnavailable: 'निदान सेवा सध्या उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा.',
      modelCropMismatch: 'प्रतिमा model ने {detected} म्हणून ओळखली; निवडलेले पीक {selected} आहे. योग्य पीक निवडून पुन्हा स्कॅन करा.', cropMismatchTitle: 'पीक निवड जुळत नाही', chooseWheat: 'गहू निवडा', chooseTriticale: 'ट्रिटिकेल निवडा',
    referenceUnavailable: 'या निकालासाठी स्रोत-पडताळलेली लक्षणे किंवा व्यवस्थापन माहिती उपलब्ध नाही.',
    demoProducts: 'औषध शिफारस नाही',
    onionCheck: 'कांदा निवडले आहे. Demo mode मध्ये पीक प्रतिमेवरून ओळखता येत नाही. फोटो गहू किंवा ट्रिटिकेलचा असल्यास योग्य पीक निवडा.',
    filenameMismatch: 'फाइलच्या नावावरून {suggested} असण्याची शक्यता दिसते, पण निवडलेले पीक {selected} आहे. योग्य पीक निवडा आणि पुन्हा स्कॅन करा.',
    noProducts: 'या पीक आणि रोगासाठी स्रोत-पडताळलेली उत्पादन शिफारस उपलब्ध नाही.',
    unavailable: 'किंमत उपलब्ध नाही', usage: 'वापर आणि घटक', label: 'नोंदणी / लेबल सूचना',
    manufacturer: 'निर्माता / कंपनी', manufacturerUnavailable: 'कंपनीची स्रोत-पडताळलेली माहिती उपलब्ध नाही',
    imageUnavailable: 'स्रोत-पडताळलेली प्रतिमा उपलब्ध नाही', source: 'स्रोत',
    disclaimer: 'महत्त्वाची सूचना: AI/Screening निकाल हा निर्णय-सहाय्य आहे, निश्चित निदान नाही. रोगाची खात्री कृषी तज्ज्ञांकडून करा. कोणतेही उत्पादन वापरण्यापूर्वी पिकासाठी त्याची नोंदणी आणि सध्याचे उत्पादन-लेबल तपासा व त्यावरील सूचनांचे पालन करा.',
    preview: 'निवडलेल्या पिकाच्या पानाचा पूर्वदृश्य फोटो',
  },
  hi: {
    title: 'फोटो स्कैन करें', uploadTitle: 'फसल के पत्ते की फोटो चुनें',
    uploadText: 'JPG, PNG या WEBP • अधिकतम 8 MB', choose: 'फोटो चुनें',
    camera: 'कैमरे से फोटो लें', selected: 'चुनी गई फोटो', remove: 'फोटो हटाएं',
    crop: 'फसल चुनें', scan: 'रोग जांचें',
    note: 'Demo/Screening: फसल या रोग की पहचान करने वाला image model अभी जुड़ा नहीं है। फसल का चयन जांचें; यह निदान नहीं है।',
    invalid: 'कृपया JPG, PNG या कोई अन्य image फ़ाइल चुनें.', empty: 'चुनी गई image फ़ाइल खाली है। दूसरी फोटो चुनें.', tooLarge: 'फोटो का आकार 8 MB से कम होना चाहिए.',
    noPhoto: 'स्कैन शुरू करने से पहले पत्ते की फोटो चुनें.', loading: 'फोटो और फसल की जानकारी भेजी जा रही है…',
    failed: 'फोटो की जांच नहीं हो सकी। इंटरनेट कनेक्शन जांचकर फिर कोशिश करें.',
    disease: 'संभावित रोग', healthy: 'स्वस्थ', confidence: 'विश्वास स्तर', recommendations: 'उत्पाद सुझाव',
    healthyNotice: 'इस model ने पत्ते को स्वस्थ वर्गीकृत किया। दवा की सिफारिश नहीं की गई है।',
    precautions: 'लक्षण और सावधानियां',
    demo: 'Demo / Screening', demoNotice: 'इस फोटो के लिए कोई रोग पहचान मॉडल जुड़ा नहीं है। इस स्कैन ने रोग या confidence निर्धारित नहीं किया।',
    noModelResult: 'फोटो से निदान उपलब्ध नहीं', description: 'रोग की जानकारी', symptoms: 'दिखने वाले लक्षण', management: 'प्रबंधन',
    aiUnavailable: 'AI रोग निदान अभी उपलब्ध नहीं है।',
    diagnosisUncertain: 'निश्चित निदान नहीं हुआ', lowConfidenceNotice: 'इस model का विश्वास स्तर 0.80 से कम है। कोई दवा या कीटनाशक सुझाया नहीं गया है।',
    providerUnavailable: 'निदान सेवा अभी उपलब्ध नहीं है। कृपया बाद में फिर कोशिश करें।',
      modelCropMismatch: 'Model ने फोटो को {detected} के रूप में पहचाना; चुनी गई फसल {selected} है। सही फसल चुनकर फिर स्कैन करें।', cropMismatchTitle: 'फसल का चयन मेल नहीं खाता', chooseWheat: 'गेहूं चुनें', chooseTriticale: 'ट्रिटिकेल चुनें',
    referenceUnavailable: 'इस परिणाम के लिए स्रोत-सत्यापित लक्षण या प्रबंधन जानकारी उपलब्ध नहीं है।',
    demoProducts: 'दवा की कोई सुझाव नहीं',
    onionCheck: 'प्याज चुना गया है। Demo mode में फोटो से फसल की पहचान नहीं होती। अगर फोटो गेहूं या ट्रिटिकेल की है, तो सही फसल चुनें।',
    filenameMismatch: 'फाइल का नाम {suggested} का संकेत देता है, लेकिन चुनी गई फसल {selected} है। सही फसल चुनकर फिर स्कैन करें।',
    noProducts: 'इस फसल और रोग के लिए स्रोत-सत्यापित उत्पाद सुझाव उपलब्ध नहीं है.',
    unavailable: 'कीमत उपलब्ध नहीं', usage: 'उपयोग और घटक', label: 'पंजीकरण / लेबल सूचना',
    manufacturer: 'निर्माता / कंपनी', manufacturerUnavailable: 'कंपनी की स्रोत-सत्यापित जानकारी उपलब्ध नहीं है',
    imageUnavailable: 'स्रोत-सत्यापित चित्र उपलब्ध नहीं है', source: 'स्रोत',
    disclaimer: 'महत्वपूर्ण सूचना: AI/Screening परिणाम निर्णय-सहायता है, निश्चित निदान नहीं। रोग की पुष्टि कृषि विशेषज्ञ से करें। किसी भी उत्पाद का उपयोग करने से पहले फसल के लिए उसका पंजीकरण और वर्तमान उत्पाद लेबल जांचें तथा उसके निर्देशों का पालन करें।',
    preview: 'चुनी गई फसल के पत्ते की पूर्वावलोकन फोटो',
  },
  en: {
    title: 'Scan Crop', uploadTitle: 'Choose a crop or leaf photo',
    uploadText: 'JPG, PNG or WEBP • Max 8 MB', choose: 'Choose photo',
    camera: 'Take a camera photo', selected: 'Selected photo', remove: 'Remove photo',
    crop: 'Select crop', scan: 'Check for disease',
    note: 'Demo/Screening: no image model is connected to identify a crop or disease. Check the crop selection; this is not a diagnosis.',
    invalid: 'Choose a JPG, PNG, or other image file.', empty: 'The selected image file is empty. Choose another photo.', tooLarge: 'The photo must be smaller than 8 MB.',
    noPhoto: 'Choose a leaf photo before starting the scan.', loading: 'Sending the image and crop selection…',
    failed: 'The photo could not be checked. Check your connection and try again.',
    disease: 'Possible disease', healthy: 'Healthy leaf', confidence: 'Confidence', recommendations: 'Product recommendations',
    healthyNotice: 'The model classified this image as a healthy leaf. No medicine is recommended.',
    precautions: 'Symptoms and precautions',
    demo: 'Demo / Screening', demoNotice: 'No disease-classification model is connected for this image. This scan did not determine a disease or confidence.',
    noModelResult: 'No image diagnosis available', description: 'Disease information', symptoms: 'Possible symptoms', management: 'Management',
    aiUnavailable: 'AI crop diagnosis is currently unavailable.',
    diagnosisUncertain: 'No confirmed diagnosis', lowConfidenceNotice: 'Model confidence is below 0.80. No pesticide or medicine is recommended.',
    providerUnavailable: 'The diagnosis service is unavailable. Please try again later.',
      modelCropMismatch: 'The model identified the image as {detected}, but {selected} is selected. Choose the correct crop and scan again.', cropMismatchTitle: 'Crop selection mismatch', chooseWheat: 'Select Wheat', chooseTriticale: 'Select Triticale',
    referenceUnavailable: 'No source-verified symptom or management information is available for this result.',
    demoProducts: 'No medicine recommendation',
    onionCheck: 'Onion is selected. Demo mode cannot identify a crop from the image. If this photo is Wheat or Triticale, select the correct crop.',
    filenameMismatch: 'The filename suggests {suggested}, but {selected} is selected. Choose the correct crop and scan again.',
    noProducts: 'No source-verified product recommendation is available for this crop and disease.',
    unavailable: 'Price unavailable', usage: 'Use and ingredients', label: 'Registration / label note',
    manufacturer: 'Manufacturer / company', manufacturerUnavailable: 'No source-verified company information is available',
    imageUnavailable: 'No source-verified product image is available', source: 'Source',
    disclaimer: 'Important: AI/Screening output is decision support, not a confirmed diagnosis. Verify the disease with an agricultural expert. Before using any product, check that it is registered for the crop, read the current product label, and follow its directions.',
    preview: 'Preview of the selected crop leaf photo',
  },
};

const byId = (id) => document.getElementById(id);
const cropLabels = {
  mr: { tomato: 'टोमॅटो', potato: 'बटाटा', pepper: 'ढोबळी मिरची', grape: 'द्राक्ष', cotton: 'कापूस', soybean: 'सोयाबीन', onion: 'कांदा', chilli: 'मिरची', wheat: 'गहू', triticale: 'ट्रिटिकेल' },
  hi: { tomato: 'टमाटर', potato: 'आलू', pepper: 'शिमला मिर्च', grape: 'अंगूर', cotton: 'कपास', soybean: 'सोयाबीन', onion: 'प्याज', chilli: 'मिर्च', wheat: 'गेहूं', triticale: 'ट्रिटिकेल' },
  en: { tomato: 'Tomato', potato: 'Potato', pepper: 'Bell Pepper', grape: 'Grape', cotton: 'Cotton', soybean: 'Soybean', onion: 'Onion', chilli: 'Chilli', wheat: 'Wheat', triticale: 'Triticale' },
};
const fileInput = byId('file');
const cameraInput = byId('cameraFile');
const scanButton = byId('scanBtn');
const resultRegion = byId('result');
let selectedFile = null;
let previewUrl = null;
let latestResult = null;

fileInput.onchange = null;
scanButton.onclick = null;

function language() {
  return byId('lang').value in scanCopy ? byId('lang').value : 'mr';
}

function copy() {
  return scanCopy[language()];
}

function setText(id, text) {
  byId(id).textContent = text;
}

function updateScanLanguage() {
  const words = copy();
  setText('scanTitle', words.title);
  setText('uploadTitle', words.uploadTitle);
  setText('uploadText', words.uploadText);
  setText('choose', words.choose);
  setText('cameraChoose', words.camera);
  setText('selectedLabel', words.selected);
  setText('removePhoto', words.remove);
  setText('cropLabel', words.crop);
  setText('scanBtn', `🔍 ${words.scan}`);
  setText('scanNote', words.note);
  document.querySelector('[data-crop-choice="wheat"]').textContent = words.chooseWheat;
  document.querySelector('[data-crop-choice="triticale"]').textContent = words.chooseTriticale;
  byId('preview').alt = words.preview;
  if (latestResult) renderResult(latestResult);
  else updateCropWarning();
}

function filenameCropHint(fileName) {
  const words = String(fileName || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/);
  if (words.includes('triticale')) return 'triticale';
  if (words.includes('wheat')) return 'wheat';
  return null;
}

function cropLabel(crop) {
  return cropLabels[language()][crop] || crop;
}

function updateCropWarning(validation) {
  const selectedCrop = byId('crop').value;
  const hintedCrop = validation?.filenameHint || filenameCropHint(selectedFile?.name);
  let message = '';
  let showSuggestions = false;

  if (validation?.status === 'model_verified') {
    message = '';
  } else if (validation?.status === 'model_mismatch' && validation.detectedCrop) {
    message = copy().modelCropMismatch
      .replace('{detected}', cropLabel(validation.detectedCrop))
      .replace('{selected}', cropLabel(selectedCrop));
    showSuggestions = validation.detectedCrop === 'wheat' || validation.detectedCrop === 'triticale';
  } else if (hintedCrop && hintedCrop !== selectedCrop) {
    message = copy().filenameMismatch
      .replace('{suggested}', cropLabel(hintedCrop))
      .replace('{selected}', cropLabel(selectedCrop));
    showSuggestions = true;
  } else if (selectedCrop === 'onion' && selectedFile) {
    message = copy().onionCheck;
    showSuggestions = true;
  }

  byId('cropWarningText').textContent = message;
  byId('cropWarning').hidden = !message;
  byId('cropSuggestions').hidden = !showSuggestions;
}

function clearResult() {
  latestResult = null;
  resultRegion.replaceChildren();
  byId('scanStatus').hidden = true;
  byId('scanStatus').replaceChildren();
  resultRegion.setAttribute('aria-busy', 'false');
}

function showUploadError(message) {
  const error = byId('uploadError');
  error.textContent = message;
  error.hidden = !message;
}

function resetPreview() {
  selectedFile = null;
  fileInput.value = '';
  cameraInput.value = '';
  byId('fileDetails').hidden = true;
  byId('preview').removeAttribute('src');
  byId('fileName').textContent = '';
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  updateCropWarning();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  showUploadError('');
  clearResult();

  if (!file.type.startsWith('image/')) {
    resetPreview();
    showUploadError(copy().invalid);
    return;
  }
  if (file.size === 0) {
    resetPreview();
    showUploadError(copy().empty);
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    resetPreview();
    showUploadError(copy().tooLarge);
    return;
  }

  selectedFile = file;
  if (event.target === fileInput) cameraInput.value = '';
  else fileInput.value = '';
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  byId('preview').src = previewUrl;
  byId('fileName').textContent = file.name;
  byId('fileDetails').hidden = false;
  updateCropWarning();
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function addResultSection(parent, title, content) {
  const section = makeElement('section', 'resultSection');
  section.append(makeElement('h4', '', title));
  section.append(content);
  parent.append(section);
}

function renderProduct(product) {
  const words = copy();
  const locale = language();
  const card = makeElement('article', 'scanProduct');
  const top = makeElement('div', 'scanProductTop');
  const imageBox = makeElement('div', 'scanProductImage', words.imageUnavailable);
  const hasVerifiedImage = Boolean(product.image && product.image_source);
  if (hasVerifiedImage) {
    const image = makeElement('img');
    image.alt = product[`name_${locale}`] || product.name_en || '';
    image.loading = 'lazy';
    image.addEventListener('error', () => imageBox.replaceChildren(makeElement('span', '', words.imageUnavailable)), { once: true });
    imageBox.replaceChildren(image);
    image.src = product.image;
  } else {
    imageBox.classList.add('imageUnavailable');
  }

  const details = makeElement('div');
  const name = product[`name_${locale}`] || product.name_en || words.recommendations;
  details.append(makeElement('h5', '', name));
  const hasVerifiedPrice = product.price_inr != null && product.price_source && product.price_updated_at;
  details.append(makeElement('p', 'scanProductPrice', hasVerifiedPrice ? `₹${product.price_inr}` : words.unavailable));
  if (hasVerifiedPrice) details.append(makeElement('p', 'scanProductNote', `${product.price_source} · ${product.price_updated_at}`));
  top.append(imageBox, details);
  card.append(top);

  const ingredients = [product.active_ingredient, product.formulation].filter(Boolean).join(' · ');
  const use = product[`use_${locale}`] || product.use_en || '';
  const usage = [ingredients, use].filter(Boolean).join(' — ');
  if (usage) card.append(makeElement('p', 'scanProductDetails', `${words.usage}: ${usage}`));
  card.append(makeElement('p', 'scanProductDetails', `${words.manufacturer}: ${product.manufacturer || words.manufacturerUnavailable}`));
  if (product.registration_note || product.registration_source) {
    const labelNote = [product.registration_source, product.registration_note].filter(Boolean).join(' — ');
    card.append(makeElement('p', 'scanProductNote', `${words.label}: ${labelNote}`));
  }
  if (product.recommendation_source) {
    card.append(makeElement('p', 'scanProductNote', `${words.source}: ${product.recommendation_source}`));
  }
  return card;
}

function renderLocalizedList(parent, title, items, emptyMessage) {
  if (!Array.isArray(items) || !items.length) {
    addResultSection(parent, title, makeElement('p', '', emptyMessage));
    return;
  }
  const list = makeElement('ul', 'symptomList');
  items.forEach((item) => list.append(makeElement('li', '', item)));
  addResultSection(parent, title, list);
}

function renderResult(data) {
  const words = copy();
  const isModelResult = data.mode === 'model' && data.prediction && typeof data.prediction === 'object';
  byId('medicines').hidden = true;
  byId('medNavLink').hidden = true;
  if (!isModelResult) {
    resultRegion.replaceChildren(makeElement('p', 'diagnosisUnavailable', words.aiUnavailable));
    resultRegion.setAttribute('aria-busy', 'false');
    return;
  }
  const prediction = isModelResult ? data.prediction : null;
  const uncertain = isModelResult && data.status === 'uncertain';
  const healthy = isModelResult && prediction.healthy === true;
  const cropMismatch = data.status === 'crop_mismatch';
  const locale = language();
  updateCropWarning(data.cropValidation);

  const card = makeElement('article', 'scanResult');
  const header = makeElement('div', 'scanResultHeader');
  const titleGroup = makeElement('div');
  titleGroup.append(makeElement('span', 'eyebrow', isModelResult ? (healthy ? words.healthy : words.disease).toUpperCase() : words.demo.toUpperCase()));
  if (isModelResult) {
    const diseaseName = prediction.name?.[locale] || prediction.name?.en || prediction.name?.mr || prediction.name?.hi || words.disease;
    titleGroup.append(makeElement('h3', '', diseaseName));
  } else {
    titleGroup.append(makeElement('h3', '', cropMismatch ? words.cropMismatchTitle : words.noModelResult));
  }
  header.append(titleGroup);
  if (uncertain) header.append(makeElement('span', 'uncertainBadge', words.diagnosisUncertain));
  else if (healthy) header.append(makeElement('span', 'healthyBadge', words.healthy));
  else if (!isModelResult) header.append(makeElement('span', 'demoBadge', words.demo));

  const confidenceValue = prediction?.confidence;
  const confidence = confidenceValue !== null && confidenceValue !== undefined && Number.isFinite(confidenceValue)
    ? Math.round(Math.max(0, Math.min(1, confidenceValue)) * 100)
    : null;
  if (isModelResult && confidence !== null) header.append(makeElement('span', 'confidenceBadge', `${words.confidence}: ${confidence}%`));
  card.append(header);

  if (!isModelResult) {
    const message = data.status === 'provider_unavailable'
      ? words.providerUnavailable
      : cropMismatch
        ? words.modelCropMismatch.replace('{detected}', cropLabel(data.cropValidation?.detectedCrop || '')).replace('{selected}', cropLabel(data.crop || ''))
        : words.demoNotice;
    card.append(makeElement('p', cropMismatch ? 'cropMismatchNotice' : 'demoNotice', message));
  } else if (healthy) {
    card.append(makeElement('p', 'healthyNotice', words.healthyNotice));
  } else if (uncertain) {
    card.append(makeElement('p', 'lowConfidenceNotice', words.lowConfidenceNotice));
  }

  if (isModelResult && confidence !== null) {
    const track = makeElement('div', 'confidenceTrack');
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-label', words.confidence);
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    track.setAttribute('aria-valuenow', String(confidence));
    const fill = makeElement('span');
    fill.style.width = `${confidence}%`;
    track.append(fill);
    card.append(track);
  }

  if (isModelResult) {
    const reference = data.reference;
    renderLocalizedList(card, words.symptoms, reference?.symptoms?.[locale], words.referenceUnavailable);
    renderLocalizedList(card, words.precautions, reference?.management?.[locale], words.referenceUnavailable);
    if (reference?.source) {
      const sourceRow = makeElement('p', 'scanProductNote', `${words.source}: ${reference.source}`);
      if (reference.url && reference.url.startsWith('https://')) {
        const link = makeElement('a', '', reference.url);
        link.href = reference.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        sourceRow.append(document.createTextNode(' · '), link);
      }
      card.append(sourceRow);
    }

    if (!uncertain && !healthy) {
      const products = Array.isArray(data.products) ? data.products : [];
      const productSection = makeElement('section', 'resultSection');
      productSection.append(makeElement('h4', '', words.recommendations));
      if (products.length) {
        const list = makeElement('div', 'recommendedProducts');
        products.forEach((product) => list.append(renderProduct(product)));
        productSection.append(list);
      } else {
        productSection.append(makeElement('p', '', words.noProducts));
      }
      card.append(productSection);
    }
  }

  card.append(makeElement('p', 'scanDisclaimer', words.disclaimer));
  resultRegion.replaceChildren(card);
  resultRegion.setAttribute('aria-busy', 'false');
}

async function runScan() {
  showUploadError('');
  if (!selectedFile) {
    showUploadError(copy().noPhoto);
    fileInput.focus();
    return;
  }

  const words = copy();
  latestResult = null;
  const formData = new FormData();
  formData.append('image', selectedFile);
  formData.append('crop', byId('crop').value);
  const status = byId('scanStatus');
  const spinner = makeElement('span', 'scanSpinner');
  spinner.setAttribute('aria-hidden', 'true');
  status.replaceChildren(spinner, document.createTextNode(words.loading));
  status.hidden = false;
  resultRegion.replaceChildren();
  resultRegion.setAttribute('aria-busy', 'true');
  scanButton.disabled = true;
  fileInput.disabled = true;
  cameraInput.disabled = true;
  byId('crop').disabled = true;
  byId('removePhoto').disabled = true;

  try {
    const response = await fetch('/api/scan', { method: 'POST', body: formData });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 503 && data?.status === 'provider_unavailable') {
        latestResult = data;
        renderResult(data);
        status.hidden = true;
        status.replaceChildren();
        return;
      }
      throw new Error('scan-failed');
    }
    if (!data || (data.mode !== 'demo' && data.status !== 'crop_mismatch' && !data.prediction)) throw new Error('scan-failed');
    latestResult = data;
    renderResult(data);
    status.hidden = true;
    status.replaceChildren();
    resultRegion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch {
    status.hidden = true;
    status.replaceChildren();
    latestResult = null;
    resultRegion.setAttribute('aria-busy', 'false');
    resultRegion.replaceChildren(makeElement('p', 'diagnosisUnavailable', words.aiUnavailable));
  } finally {
    scanButton.disabled = false;
    fileInput.disabled = false;
    cameraInput.disabled = false;
    byId('crop').disabled = false;
    byId('removePhoto').disabled = false;
  }
}

fileInput.addEventListener('change', handleFileChange);
cameraInput.addEventListener('change', handleFileChange);
byId('removePhoto').addEventListener('click', () => {
  resetPreview();
  showUploadError('');
  clearResult();
});
byId('crop').addEventListener('change', clearResult);
byId('crop').addEventListener('change', () => updateCropWarning());
document.querySelectorAll('[data-crop-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    byId('crop').value = button.dataset.cropChoice;
    byId('crop').dispatchEvent(new Event('change', { bubbles: true }));
  });
});
scanButton.addEventListener('click', runScan);
byId('lang').addEventListener('change', updateScanLanguage);
updateScanLanguage();