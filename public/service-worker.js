// Service worker for MindSync PWA

const CACHE_NAME = 'mindsync-cache-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, then cache with offline fallback
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests differently (don't cache but still fetch)
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we got a valid response, cache a copy
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network request fails, try to get from cache
        return caches.match(event.request)
          .then((response) => {
            // Return cached response or the offline page
            return response || caches.match('/offline');
          });
      })
  );
});

// Listen for push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  // Enhanced options for different notification types
  const options = {
    body: data.body || 'New notification from MindSync',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: data.type === 'reminder' ? [200, 100, 200, 100, 200] : [100, 50, 100],
    requireInteraction: data.type === 'reminder' ? true : false,
    silent: false,
    renotify: data.type === 'reminder' ? true : false,
    tag: data.tag || 'general',
    data: {
      url: data.url || '/',
      type: data.type || 'general',
      reminderId: data.reminderId || null
    },
    actions: data.type === 'reminder' ? [
      {
        action: 'snooze',
        title: 'Snooze 5 min',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/icon-72x72.png'
      }
    ] : []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'MindSync', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data || {};
  
  // Handle reminder notification actions
  if (data.type === 'reminder' && event.action) {
    if (event.action === 'snooze') {
      // Send message to client to handle snooze
      event.waitUntil(
        clients.matchAll().then(clientList => {
          if (clientList.length > 0) {
            clientList[0].postMessage({
              type: 'snooze-reminder',
              reminderId: data.reminderId,
              minutes: 5
            });
          }
        })
      );
      return;
    } else if (event.action === 'dismiss') {
      // Send message to client to handle dismiss
      event.waitUntil(
        clients.matchAll().then(clientList => {
          if (clientList.length > 0) {
            clientList[0].postMessage({
              type: 'dismiss-reminder',
              reminderId: data.reminderId
            });
          }
        })
      );
      return;
    }
  }
  
  // Default behavior - open the app
  event.waitUntil(
    clients.openWindow(data.url || '/')
  );
});

// Handle background sync for offline reminder scheduling
self.addEventListener('sync', (event) => {
  if (event.tag === 'reminder-sync') {
    event.waitUntil(
      // Sync reminders when connection is restored
      clients.matchAll().then(clientList => {
        if (clientList.length > 0) {
          clientList[0].postMessage({
            type: 'sync-reminders'
          });
        }
      })
    );
  }
}); 