// Service Worker for Pariksha Result 2026 PWA & Push Notifications
// Version 2.1 - Network-First for Navigation to prevent white-screen on bundle updates

const CACHE_NAME = 'pariksha-result-v2.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-48x48.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png'
];

// Install Event - Pre-cache core static shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Pre-cache non-fatal error:', err);
      });
    })
  );
});

// Activate Event - Clean Up ALL Old Caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network-First for HTML navigation; Stale-While-Revalidate for static assets; Bypass for APIs
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Completely bypass API endpoints, sitemaps, robots, and Vite dev scripts
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/@vite') ||
    url.pathname.startsWith('/@fs') ||
    url.pathname.startsWith('/src') ||
    url.pathname.endsWith('.xml') ||
    url.pathname.endsWith('.txt') ||
    url.protocol.startsWith('chrome-extension') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // 2. Navigation (HTML Pages) -> Network-First with Offline Fallback
  // This prevents white-screen when script bundle hashes change on server
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback: serve cached index.html
          return caches.match('/index.html').then((cachedIndex) => {
            return cachedIndex || caches.match('/');
          });
        })
    );
    return;
  }

  // 3. Static Assets (JS, CSS, Images, Fonts) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Do NOT return index.html for failed JS/CSS requests (prevents syntax error)
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push Event - Show Instant Job/Result Notification
self.addEventListener('push', (event) => {
  let data = {
    title: '🚨 Pariksha Result Alert',
    body: 'New Government Job / Exam Update Published!',
    url: '/',
    icon: '/favicon.ico',
    tag: 'pariksha-job-alert'
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    tag: data.tag || 'pariksha-notification',
    renotify: true,
    actions: [
      { action: 'open', title: '👁️ View Update' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle Messages from Web App (e.g., Trigger Test Notification or Skip Waiting)
self.addEventListener('message', (event) => {
  if (event.data) {
    if (event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    } else if (event.data.type === 'SHOW_TEST_NOTIFICATION') {
      const { title, body, url } = event.data.payload || {};
      self.registration.showNotification(title || '🚨 SSC CGL 2026 Notification', {
        body: body || 'Official recruitment notification released! Tap to apply online.',
        icon: '/favicon.ico',
        vibrate: [100, 50, 100],
        data: { url: url || '/' },
        tag: 'test-job-alert',
        actions: [
          { action: 'open', title: 'Open Pariksha Result' }
        ]
      });
    }
  }
});
