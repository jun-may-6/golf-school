// public/service-worker.js

self.addEventListener('install', (event) => {
  console.log('서비스 워커 설치');
  self.skipWaiting(); // 새 서비스 워커를 즉시 활성화
});

self.addEventListener('activate', (event) => {
  console.log('서비스 워커 활성화');
  event.waitUntil(
    clients.claim() // 활성화된 서비스 워커가 모든 클라이언트를 제어
  );
});
