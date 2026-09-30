const CACHE_NAME = "safecircle-shell-v14";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./mediation-engine.js",
  "./emergency.js",
  "./manifest.webmanifest",
  "./assets/logo-mark.svg",
  "./assets/brand-hero-v1.webp",
  "./assets/brand-keyvisual-v1.png",
  "./assets/icon-speak.svg",
  "./assets/icon-listen.svg",
  "./assets/icon-together.svg",
  "./assets/icon-safety.svg",
  "./assets/icon-info.svg",
  "./fixtures/mediation-cases.json",
  "./fixtures/emergency-bundle.json",
  "./fixtures/context-patterns.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

async function fetchAndRefresh(request) {
  const response = await fetch(request);
  if (response && response.ok) {
    const copy = response.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, copy);
  }
  return response;
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isEmergency = url.pathname.endsWith("/fixtures/emergency-bundle.json");

  if (isEmergency) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetchAndRefresh(event.request)
      )
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetchAndRefresh(event.request).catch(async () =>
        (await caches.match(event.request)) || caches.match("./index.html")
      )
    );
    return;
  }

  if (isSameOrigin) {
    event.respondWith(
      fetchAndRefresh(event.request).catch(async () =>
        (await caches.match(event.request)) || Response.error()
      )
    );
  }
});