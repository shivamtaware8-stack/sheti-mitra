/* Phase2-B: camera direct scan + re-scan (existing /api/scan reused). */
(() => {
  let stream = null;
  const stopCam = () => {
    if (stream) { stream.getTracks().forEach((x) => x.stop()); stream = null; }
    const v = P2.$('camVideo'); if (v) v.srcObject = null;
    if (P2.$('camWrap')) P2.$('camWrap').style.display = 'none';
    if (P2.$('camShot')) P2.$('camShot').style.display = 'none';
    if (P2.$('camVideo')) P2.$('camVideo').style.display = 'block';
    if (P2.$('camRetakeBtn')) P2.$('camRetakeBtn').style.display = 'none';
  };
  const openCam = async () => {
    const err = P2.$('camError');
    if (err) { err.style.display = 'none'; err.textContent = ''; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (err) { err.textContent = P2.t('camNo'); err.style.display = 'block'; }
      document.getElementById('cameraFile')?.click();
      return;
    }
    try {
      stopCam();
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      P2.$('camWrap').style.display = 'block';
      const v = P2.$('camVideo'); v.srcObject = stream;
      await v.play().catch(() => {});
    } catch {
      if (err) { err.textContent = P2.t('camNo'); err.style.display = 'block'; }
      document.getElementById('cameraFile')?.click();
    }
  };
  const capture = () => {
    const v = P2.$('camVideo'), c = P2.$('camCanvas'), img = P2.$('camShot');
    if (!v || !v.videoWidth) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    c.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      img.src = url; img.style.display = 'block'; v.style.display = 'none';
      P2.$('camRetakeBtn').style.display = 'inline-flex';
      const dt = new DataTransfer();
      dt.items.add(new File([b], 'camera-capture.jpg', { type: 'image/jpeg' }));
      const f = document.getElementById('file'); if (f) f.files = dt.files;
      const prev = document.getElementById('preview');
      if (prev) { prev.src = url; prev.style.display = 'block'; }
      const fn = document.getElementById('fileName'); if (fn) fn.textContent = 'camera-capture.jpg';
    }, 'image/jpeg', 0.92);
  };
  window.addEventListener('DOMContentLoaded', () => {
    if (P2.$('camOpenBtn')) P2.$('camOpenBtn').onclick = openCam;
    if (P2.$('camCaptureBtn')) P2.$('camCaptureBtn').onclick = capture;
    if (P2.$('camCloseBtn')) P2.$('camCloseBtn').onclick = stopCam;
    if (P2.$('camRetakeBtn')) P2.$('camRetakeBtn').onclick = () => {
      P2.$('camShot').style.display = 'none';
      P2.$('camVideo').style.display = 'block';
      P2.$('camRetakeBtn').style.display = 'none';
      const f = document.getElementById('file'); if (f) f.value = '';
    };
    const rescan = P2.$('rescanBtn');
    if (rescan) rescan.onclick = () => {
      stopCam();
      const f = document.getElementById('file'); if (f) f.value = '';
      const cf = document.getElementById('cameraFile'); if (cf) cf.value = '';
      const pv = document.getElementById('preview');
      if (pv) { pv.removeAttribute('src'); pv.style.display = 'none'; }
      const r = document.getElementById('result'); if (r) r.innerHTML = '';
      const fn = document.getElementById('fileName'); if (fn) fn.textContent = '';
      rescan.style.display = 'none';
      document.getElementById('scan')?.scrollIntoView({ behavior: 'smooth' });
    };
    const r = document.getElementById('result');
    if (r && rescan) new MutationObserver(() => {
      if (r.innerHTML.trim()) rescan.style.display = 'inline-flex';
    }).observe(r, { childList: true });
  });
})();
