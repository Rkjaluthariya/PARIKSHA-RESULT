// Service Worker for Pariksha Result 2026 PWA & Push Notifications

const CACHE_NAME = 'pariksha-result-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event - Cache Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean Up Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache First with Network Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update to keep cache fresh
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline fallback handling */});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        return networkResponse;
      }).catch(() => {
        return caches.match('/index.html');
      });
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

// Handle Messages from Web App (e.g., Trigger Test Notification)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_TEST_NOTIFICATION') {
    const { title, body, url } = event.data.payload || {};
    self.registration.showNotification(title || '🚨 SSC CGL 2026 Notification', {
      body: body || 'Official recruitment notification for 17,727 posts released! Tap to apply online.',
      icon: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: { url: url || '/' },
      tag: 'test-job-alert',
      actions: [
        { action: 'open', title: 'Open Pariksha Result' }
      ]
    });
  }
});
