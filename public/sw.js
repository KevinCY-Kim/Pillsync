const CACHE_NAME = 'pillsync-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/pillsync_icon_192.png',
  '/pillsync_icon_512.png'
];

// Install Service Worker and cache essential shell assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first(최신성 우선) + 동일 출처 GET 성공 응답을 런타임 캐시에 저장.
// 앱 셸(index.html)만 캐시하고 해시된 JS/CSS 번들은 캐시하지 않으면 오프라인 시
// 셸이 떠도 부팅에 필요한 번들이 없어 빈 화면이 된다. 런타임 캐싱으로 이를 막는다.
self.addEventListener('fetch', (e) => {
  const req = e.request;

  // 비-GET(예: Supabase POST/로깅)·교차 출처(Supabase API·폰트/아이콘 CDN)은
  // 동적이거나 캐싱이 부적절하므로 손대지 않고 기본 네트워크 동작에 맡긴다.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  e.respondWith(
    fetch(req)
      .then((res) => {
        // 정상(200) 응답만 캐시에 저장한다(불투명/에러 응답 제외).
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => {
        // 오프라인: 캐시에 있으면 반환, 없으면 셸(index.html)로 폴백.
        return caches.match(req).then((cached) => cached || caches.match('/index.html'));
      })
  );
});
