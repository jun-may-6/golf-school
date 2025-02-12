// public/service-worker.js

self.addEventListener('install', (event) => {
  // 설치 시 필요한 로직이 있다면 추가 (없으면 그냥 로그 남기기)
  console.log('Service Worker: Installed');
  self.skipWaiting(); // 새로운 SW가 바로 활성화되도록 함 (선택사항)
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // 기존 SW와 관련된 클린업 작업 등이 있다면 진행
});

self.addEventListener('fetch', (event) => {
  // 오프라인 캐싱 기능이 필요 없다면, 그냥 네트워크 요청을 그대로 전달
  return fetch(event.request);
});
