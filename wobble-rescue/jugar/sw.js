// Wobble Rescue: funciona sin conexión después de la primera visita.
// Al publicar una versión nueva, subir VERSION para que los jugadores reciban los cambios.
const VERSION = 'wobble-web-1';
const CORE = ['./', 'index.html', 'levels.json', 'strings.json', 'planck.min.js', 'vrf_ads.js', 'manifest.json',
  'bloop_idle.png', 'bloop_anticipation.png', 'bloop_airborne.png', 'bloop_victory.png', 'bloop_fail.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).catch(() => {}));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;   // anuncios y fuentes: directo a la red
  const fresh = req.mode === 'navigate' || /\.(html|json|js)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (fresh) {
    // Primero la red (para recibir actualizaciones), si no hay conexión, lo guardado.
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return r; })
      .catch(() => caches.match(req).then((r) => r || caches.match('index.html'))));
  } else {
    // Arte y audio: lo guardado primero.
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
      if (r.ok) { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return r;
    })));
  }
});
