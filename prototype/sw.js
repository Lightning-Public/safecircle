const CACHE_NAME = "safecircle-shell-v9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./emergency.js",
  "./manifest.webmanifest",
  "./assets/logo-mark.svg",
  "./assets/brand-keyvisual-v1.webp",
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

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isEmergency = url.pathname.endsWith("/fixtures/emergency-bundle.json");

  if (isEmergency) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request);
    }).catch(() => {
      if (event.request.mode === "navigate") return caches.match("./index.html");
      return Response.error();
    })
  );
});