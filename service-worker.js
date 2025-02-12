// src/service-worker.ts

// 아무 작업도 하지 않는 최소한의 Service Worker 예시
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate");
});

self.addEventListener("fetch", (event) => {
  // 오프라인 캐싱 등 어떤 작업도 안 함
  console.log("테스트")
});
