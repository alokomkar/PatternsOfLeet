/* Guru Sweet Mart — mockup service worker.
   Caches the app shell for installability + offline browsing of static
   pages. This is a design mockup: there is no real backend, cart, or
   payment traffic to manage here. */

const CACHE_VERSION = "gsm-sortedqueue-v1";
const APP_SHELL = [
  "/gurusweetmart/",
  "/gurusweetmart/index.html",
  "/gurusweetmart/shop.html",
  "/gurusweetmart/story.html",
  "/gurusweetmart/order.html",
  "/gurusweetmart/visit.html",
  "/gurusweetmart/offline.html",
  "/gurusweetmart/css/style.css",
  "/gurusweetmart/js/app.js",
  "/gurusweetmart/manifest.webmanifest",
  "/gurusweetmart/icons/icon-192.png",
  "/gurusweetmart/icons/icon-512.png",
  "/gurusweetmart/icons/maskable-192.png",
  "/gurusweetmart/icons/maskable-512.png",
  "/gurusweetmart/icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Navigations: network-first, fall back to cache, then offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/gurusweetmart/offline.html")))
    );
    return;
  }

  // Static assets: cache-first, refresh in background.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
