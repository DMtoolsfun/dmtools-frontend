// DMTools.fun PWA Service Worker - ULTRA-ROBUST VERSION
const CACHE_NAME = 'dmtools-v1.0.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.html',
  '/pricing.html'
];

// Install event - cache files with error handling
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        // Cache files individually to avoid failing on 404s
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`[Service Worker] Failed to cache ${url}:`, err);
              return Promise.resolve();
            });
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] All available files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension URLs (browser extensions)
  if (requestUrl.protocol === 'chrome-extension:') {
    return;
  }

  // Skip chrome:// URLs
  if (requestUrl.protocol === 'chrome:') {
    return;
  }

  // Skip other browser-specific protocols
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
    return;
  }

  // Skip API calls - always use network
  if (requestUrl.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network unavailable' }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // Network first, fallback to cache strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }

        // Don't cache opaque responses (CORS)
        if (response.type === 'opaque') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the fetched response (with error handling)
        caches.open(CACHE_NAME)
          .then((cache) => {
            // Double-check URL protocol before caching
            const cacheUrl = new URL(event.request.url);
            if (cacheUrl.protocol === 'http:' || cacheUrl.protocol === 'https:') {
              cache.put(event.request, responseToCache).catch(err => {
                console.warn('[Service Worker] Failed to cache:', event.request.url, err);
              });
            }
          })
          .catch(err => {
            console.warn('[Service Worker] Cache open failed:', err);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // No cache available, return offline page
            return caches.match('/index.html');
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  if (event.tag === 'sync-responses') {
    event.waitUntil(syncResponses());
  }
});

async function syncResponses() {
  console.log('[Service Worker] Syncing responses...');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'dmtools-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('DMTools.fun', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[Service Worker] Loaded successfully');