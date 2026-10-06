/* =============================================================================
   ShetiMitra AI — Service Worker

   Caches the static frontend shell ONLY (HTML/CSS/JS/images) so the app shell
   loads fast and survives brief network drops.

   IMPORTANT HONESTY RULE: AI inference (/api/scan) runs server-side with an
   ONNX model — it does NOT work offline. API requests are never cached here;
   they always go to the network, and failures surface as the app's normal
   "service unavailable" messages. This worker must never be extended to fake
   an offline AI result.
   ============================================================================= */

const CACHE_NAME = 'sheti-mitra-shell-v1';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/img/bio.svg',
  '/img/copper.svg',
  '/img/mancozeb.svg',
  '/img/metalaxyl.svg',
  '/img/mix.svg',
  '/img/propiconazole.svg',
  '/img/sulphur.svg',
  '/img/tebuconazole.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept API calls — scans, auth and history must hit the server.
  if (url.pathname.startsWith('/api/')) return;

  if (url.origin !== self.location.origin) return;

  // Static shell: cache-first, refresh in background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
