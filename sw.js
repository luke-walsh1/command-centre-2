/* Network first: online you always get the newest version; offline you get the last saved copy.
   Supabase API calls are never touched. */
const CACHE = 'cc-shell-v1';
const EXTRA_HOSTS = ['cdn.jsdelivr.net', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const same = u.origin === self.location.origin;
  if (!same && !EXTRA_HOSTS.includes(u.hostname)) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(same ? r.url : r, same ? { cache: 'no-cache' } : undefined);
      if (res && (res.ok || res.type === 'opaque')) {
        const c = await caches.open(CACHE);
        c.put(r, res.clone()).catch(() => {});
      }
      return res;
    } catch (err) {
      const hit = await caches.match(r);
      if (hit) return hit;
      if (r.mode === 'navigate') {
        const home = (await caches.match('./index.html')) || (await caches.match('./'));
        if (home) return home;
      }
      throw err;
    }
  })());
});
