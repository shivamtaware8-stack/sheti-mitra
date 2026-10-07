/* Phase2-C part 1: disease + product details, guides, search, saved. */
window.closeDiseaseModal = () => { P2.$('diseaseModal').style.display = 'none'; };
window.p2OpenDisease = async (crop, key) => {
  try {
    const d = await P2.getJSON('/api/diseases/' + encodeURIComponent(crop) + '/' + encodeURIComponent(key));
    const L = P2.lang();
    const ref = d.reference || {};
    const pick = (obj) => (obj ? (obj[L] || obj.en || obj.mr || obj.hi) : null);
    const sym = pick(ref.symptoms);
    const man = pick(ref.management);
    const symTxt = Array.isArray(sym) ? sym.join('\n• ') : sym;
    const manTxt = Array.isArray(man) ? man.join('\n• ') : man;
    P2.$('diseaseModalTitle').textContent = (d.diseaseRow ? (d.diseaseRow['name_' + L] || d.diseaseRow.name_en) : key) || key;
    P2.$('diseaseModalBody').innerHTML =
      '<p><b>' + P2.esc(crop) + '</b></p>' +
      '<p><b>Symptoms:</b><br>' + P2.noData(symTxt) + '</p>' +
      '<p><b>Management / Prevention:</b><br>' + P2.noData(manTxt) + '</p>' +
      (ref.source ? '<p><b>Source:</b> ' + P2.esc(ref.source) + '</p>' : '<p><i>' + P2.esc(P2.t('noData')) + '</i></p>') +
      '<button class="btn secondary" data-p2-save-disease="' + P2.esc(crop) + '|' + P2.esc(d.diseaseKey || key) + '">🔖 ' + P2.esc(P2.t('save')) + '</button>';
    P2.$('diseaseModal').style.display = 'flex';
  } catch { alert(P2.t('noData')); }
};
window.openProductDetails = async (id) => {
  try {
    const p = await P2.getJSON('/api/products/' + encodeURIComponent(id));
    const L = P2.lang();
    document.getElementById('modalProductName').textContent = p['name_' + L] || p.name_en;
    document.getElementById('modalBody').innerHTML =
      '<p>' + P2.noData(p['use_' + L] || p.use_en) + '</p>' +
      '<p><b>Crop:</b> ' + P2.noData(p.crop || p.suitable_crop) + '<br><b>Disease:</b> ' + P2.noData(p.target_disease) + '</p>' +
      '<p><b>Manufacturer:</b> ' + P2.noData(p.manufacturer) + '<br><b>Price:</b> ' + (p.price_inr ? P2.esc('Rs.' + p.price_inr) : '<i>' + P2.esc(P2.t('noData')) + '</i>') + '</p>';
    document.getElementById('productModal').style.display = 'flex';
  } catch { alert(P2.t('noData')); }
};
/* Phase2-C part 2: guides list + detail. */
window.p2OpenGuide = async (crop) => {
  try {
    const g = await P2.getJSON('/api/guides/' + encodeURIComponent(crop));
    const L = P2.lang();
    const sec = (k, label) => '<p><b>' + label + ':</b><br>' + P2.noData(g[k + '_' + L] || g[k + '_en']) + '</p>';
    const d = P2.$('p2GuideDetail');
    d.style.display = 'grid';
    d.innerHTML = '<h3>' + P2.esc(g['title_' + L] || g.title_en) + '</h3>' +
      sec('overview', 'Overview') + sec('conditions', 'Conditions') + sec('sowing', 'Sowing') +
      sec('stages', 'Stages') + sec('irrigation', 'Irrigation') + sec('diseases', 'Diseases') +
      sec('prevention', 'Prevention') + sec('harvest', 'Harvest') +
      '<p><b>Source:</b> ' + P2.esc(g.source || '') + '</p>' +
      '<div><button class="btn secondary" data-p2-save-guide="' + P2.esc(g.crop) + '">🔖 ' + P2.esc(P2.t('save')) + '</button> ' +
      '<button class="btn secondary" id="p2GuideBack">' + P2.esc(P2.t('back')) + '</button></div>';
    P2.$('p2GuideBack').onclick = () => { d.style.display = 'none'; d.innerHTML = ''; };
    d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch { alert(P2.t('noData')); }
};
window.p2LoadGuides = async () => {
  const list = P2.$('p2GuideList'); if (!list) return;
  try {
    const g = await P2.getJSON('/api/guides');
    const L = P2.lang();
    list.innerHTML = g.map((x) => '<div class="p2Card"><span class="p2Cat">guide</span><h4>' + P2.esc(x['title_' + L] || x.title_en) + '</h4><button class="btn secondary" data-p2-guide="' + P2.esc(x.crop) + '">' + P2.esc(P2.t('open')) + '</button></div>').join('') || '<p>' + P2.esc(P2.t('noData')) + '</p>';
  } catch { list.innerHTML = '<p>' + P2.esc(P2.t('noData')) + '</p>'; }
};
window.p2RunSearch = async () => {
  const q = P2.$('p2SearchInput').value.trim();
  const st = P2.$('p2SearchStatus'), box = P2.$('p2SearchResults');
  if (q.length < 2) { st.textContent = '…'; box.innerHTML = ''; return; }
  st.textContent = '…';
  try {
    const r = await P2.getJSON('/api/search?q=' + encodeURIComponent(q));
    const L = P2.lang();
    let html = '';
    (r.crops || []).forEach((c) => { html += '<div class="p2Row"><div><span class="p2Cat">crop</span><div>' + P2.esc(c['name_' + L] || c.name_en) + '</div></div><button class="btn secondary" data-p2-guide="' + P2.esc(c.id) + '">' + P2.esc(P2.t('open')) + '</button></div>'; });
    (r.diseases || []).forEach((x) => { html += '<div class="p2Row"><div><span class="p2Cat">disease</span><div>' + P2.esc((x['name_' + L] || x.name_en) + ' (' + x.crop_id + ')') + '</div></div><button class="btn secondary" data-p2-dis="' + P2.esc(x.crop_id + '|' + x.id) + '">' + P2.esc(P2.t('open')) + '</button></div>'; });
    (r.products || []).forEach((p) => { html += '<div class="p2Row"><div><span class="p2Cat">product</span><div>' + P2.esc(p['name_' + L] || p.name_en) + '</div></div><button class="btn secondary" data-p2-prod="' + P2.esc(String(p.id)) + '">' + P2.esc(P2.t('open')) + '</button></div>'; });
    (r.guides || []).forEach((g) => { html += '<div class="p2Row"><div><span class="p2Cat">guide</span><div>' + P2.esc(g['title_' + L] || g.title_en) + '</div></div><button class="btn secondary" data-p2-guide="' + P2.esc(g.crop) + '">' + P2.esc(P2.t('open')) + '</button></div>'; });
    box.innerHTML = html || '<p>' + P2.esc(P2.t('noData')) + '</p>';
    st.textContent = '';
  } catch { st.textContent = P2.t('noData'); }
};
window.p2RefreshSaved = async () => {
  const box = P2.$('p2SavedList'); if (!box) return;
  try {
    const d = await P2.getJSON('/api/saved/diseases').catch(() => ({ saved: [] }));
    const g = await P2.getJSON('/api/saved/guides').catch(() => ({ saved: [] }));
    let html = '';
    (d.saved || []).forEach((x) => { html += '<div class="p2Card"><span class="p2Cat">disease</span><h4>' + P2.esc(x.crop + ' / ' + x.disease_key) + '</h4><button class="btn secondary" data-p2-dis="' + P2.esc(x.crop + '|' + x.disease_key) + '">' + P2.esc(P2.t('open')) + '</button></div>'; });
    (g.saved || []).forEach((x) => { html += '<div class="p2Card"><span class="p2Cat">guide</span><h4>' + P2.esc(x.crop) + '</h4><button class="btn secondary" data-p2-guide="' + P2.esc(x.crop) + '">' + P2.esc(P2.t('open')) + '</button></div>'; });
    box.innerHTML = html || '<p>' + P2.esc(P2.t('loginNeed')) + '</p>';
  } catch { box.innerHTML = '<p>' + P2.esc(P2.t('noData')) + '</p>'; }
};

