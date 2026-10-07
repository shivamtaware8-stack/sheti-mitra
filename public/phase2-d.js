/* Phase2-D: delegated clicks + language + boot (append-only). */
document.addEventListener('click', async (e) => {
  const g = e.target.closest('[data-p2-guide]');
  if (g) { window.p2OpenGuide(g.dataset.p2Guide); return; }
  const dp = e.target.closest('[data-p2-dis]');
  if (dp) { const p = dp.dataset.p2Dis.split('|'); window.p2OpenDisease(p[0], p[1]); return; }
  const pr = e.target.closest('[data-p2-prod]');
  if (pr) { window.openProductDetails(pr.dataset.p2Prod); return; }
  const sd = e.target.closest('[data-p2-save-disease]');
  if (sd) {
    const p = sd.dataset.p2SaveDisease.split('|');
    try {
      await P2.getJSON('/api/saved/diseases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ crop: p[0], diseaseKey: p[1] }) });
      window.p2RefreshSaved();
    } catch { alert(P2.t('loginNeed')); }
    return;
  }
  const sg = e.target.closest('[data-p2-save-guide]');
  if (sg) {
    try {
      await P2.getJSON('/api/saved/guides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ crop: sg.dataset.p2SaveGuide }) });
      window.p2RefreshSaved();
    } catch { alert(P2.t('loginNeed')); }
  }
});
const p2ApplyLang = () => {
  if (P2.$('camOpenText')) P2.$('camOpenText').textContent = P2.t('camOpen');
  if (P2.$('camCaptureText')) P2.$('camCaptureText').textContent = P2.t('capture');
  if (P2.$('camRetakeText')) P2.$('camRetakeText').textContent = P2.t('retake');
  if (P2.$('camCloseText')) P2.$('camCloseText').textContent = P2.t('close');
  if (P2.$('rescanText')) P2.$('rescanText').textContent = P2.t('rescan');
  if (P2.$('p2SearchInput')) P2.$('p2SearchInput').placeholder = P2.t('searchPh');
  if (P2.$('p2SearchBtnText')) P2.$('p2SearchBtnText').textContent = P2.t('search');
  if (P2.$('p2GuidesTitle')) P2.$('p2GuidesTitle').textContent = P2.t('guides');
  if (P2.$('p2SavedTitle')) P2.$('p2SavedTitle').textContent = P2.t('saved');
};
window.addEventListener('DOMContentLoaded', () => {
  if (P2.$('p2SearchBtn')) P2.$('p2SearchBtn').onclick = window.p2RunSearch;
  if (P2.$('p2SearchInput')) P2.$('p2SearchInput').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') window.p2RunSearch(); });
  document.getElementById('lang')?.addEventListener('change', () => { p2ApplyLang(); window.p2LoadGuides(); });
  p2ApplyLang(); window.p2LoadGuides(); window.p2RefreshSaved();
});
