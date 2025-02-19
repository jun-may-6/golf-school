const CACHE_NAME = "golf-school-cache-v1"; // 캐시 버전을 변경
const urlsToCache = [
  "/golf-school/",
  "/golf-school/#/home",
  "/golf-school/logo.png",
  "/golf-school/main.js",
  "/golf-school/style.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  // 오래된 캐시를 삭제
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시된 파일이 있으면 사용, 없으면 네트워크 요청
      return response || fetch(event.request);
    })
  );
});
