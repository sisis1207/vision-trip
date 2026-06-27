const cacheVersion = "v1782560688098";
const cacheName = `vision-trip-pwa-${cacheVersion}`;
const assets = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./data/index.js",
  "./data/info.js",
  "./data/schedule.js",
  "./data/songs.js",
  "./data/words.js",
  "./manifest.webmanifest",
  "./og-image.png",
  "./assets/icon.svg",
  "./assets/paper-texture.svg",
  "./assets/songs/flowers.png",
  "./assets/songs/more.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assets)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== cacheName)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches
            .open(cacheName)
            .then((cache) => cache.put(event.request, copy))
            .catch(() => {});
        }

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return undefined;
        });
      }),
  );
});
