/* Phase2-A: i18n + helpers (append-only, Phase1 untouched). */
window.P2 = window.P2 || {};
P2.$ = (id) => document.getElementById(id);
P2.lang = () => (document.getElementById('lang')?.value || 'mr');
P2.esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
P2.T = {
  mr: { camOpen: 'कॅमेऱ्याने स्कॅन करा', capture: 'फोटो काढा', retake: 'पुन्हा काढा', close: 'बंद करा', camNo: 'थेट कॅमेरा उपलब्ध नाही. फोटो अपलोड वापरा.', rescan: 'पुन्हा स्कॅन करा', searchPh: 'पीक, रोग, उत्पादन, मार्गदर्शक शोधा…', search: 'शोधा', guides: '📖 पीकनिहाय संपूर्ण मार्गदर्शक', saved: '🔖 माझे जतन केलेले', noData: 'माहिती उपलब्ध नाही.', loginNeed: 'जतन करण्यासाठी लॉगिन करा.', open: 'उघडा', save: 'जतन करा', back: '← मागे' },
  hi: { camOpen: 'कैमरे से स्कैन करें', capture: 'फोटो लें', retake: 'दोबारा लें', close: 'बंद करें', camNo: 'सीधा कैमरा उपलब्ध नहीं है। फोटो अपलोड करें।', rescan: 'पुनः स्कैन करें', searchPh: 'फसल, रोग, उत्पाद, मार्गदर्शिका खोजें…', search: 'खोजें', guides: '📖 फसलवार संपूर्ण मार्गदर्शिका', saved: '🔖 मेरे सहेजे हुए', noData: 'जानकारी उपलब्ध नहीं है।', loginNeed: 'सहेजने हेतु लॉगिन करें।', open: 'खोलें', save: 'सहेजें', back: '← वापस' },
  en: { camOpen: 'Scan with Camera', capture: 'Capture', retake: 'Retake', close: 'Close', camNo: 'Direct camera unavailable. Please use photo upload.', rescan: 'Re-scan', searchPh: 'Search crops, diseases, products, guides…', search: 'Search', guides: '📖 Crop-wise Complete Guides', saved: '🔖 My Saved Items', noData: 'Information unavailable.', loginNeed: 'Please log in to save.', open: 'Open', save: 'Save', back: '← Back' }
};
P2.t = (k) => (P2.T[P2.lang()] || P2.T.mr)[k] || P2.T.en[k] || k;
P2.noData = (v) => (v ? P2.esc(v) : '<i>' + P2.esc(P2.t('noData')) + '</i>');
P2.getJSON = async (url, opts) => {
  const r = await fetch(url, opts);
  const d = await r.json().catch(() => null);
  if (!r.ok) throw new Error((d && d.error) || ('http_' + r.status));
  return d;
};
