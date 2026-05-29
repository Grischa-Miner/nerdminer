const CACHE = 'nerdminer-v2';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // API-Aufrufe NICHT abfangen – direkt ans Netzwerk durchlassen,
  // damit die Seite echte Live-Daten bzw. echte Fehler sieht.
  if (url.hostname === 'blitzpool.yourdevice.ch') {
    return;
  }
  // Cache-first nur für die App-Hülle (HTML, Manifest, Icons)
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
