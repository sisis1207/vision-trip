// 비전트립 PWA 서비스워커입니다.
// 앱 실행에 필요한 정적 파일을 캐시하여 오프라인에서도 사용할 수 있게 합니다.
// cacheVersion은 scripts/publish.js에서 배포 시 자동으로 갱신됩니다.

const cacheVersion = "v1782577479675";
const cacheName = `vision-trip-pwa-${cacheVersion}`;
// 오프라인 사용에 필요한 핵심 파일 목록입니다.
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
  "./data/hanmom.js",
  "./manifest.webmanifest",
  "./og-image.png",
  "./assets/icon.svg",
  "./assets/hanmom.png",
  "./assets/paper-texture.svg",
  "./assets/songs/flowers.png",
  "./assets/songs/more.png",
];

// 설치 단계: 핵심 파일을 캐시에 저장합니다.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assets)));
  self.skipWaiting();
});

// 활성화 단계: 현재 버전이 아닌 오래된 캐시를 삭제합니다.
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

// 요청 처리: 온라인이면 최신 파일을 받고, 실패하면 캐시를 사용합니다.
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
