const cacheName = 'taj-calc-v11'; // Har baar update par v3 se v4, v5 karte rehna
const assets = [
  './',
  './index.html',
  './style.css',
   './script.js',
  './manifest.json'
];

// 1. Install Event: Files ko cache mein save karna
self.addEventListener('install', e => {
  self.skipWaiting(); // Purane service worker ko foran khatam karo
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. Activate Event: Purane cache ko delete karna (Ye bohat zaroori hai)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Fetch Event: Pehle Network se check karo, agar internet nahi hai to Cache se uthao
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});


// --- Notification & Background Alert Logic ---

// 4. Notification Click: Jab user notification par click kare to app khule
self.addEventListener('notificationclick', e => {
  e.notification.close(); // Notification band karo
  
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Agar app pehle se khuli hai to us par focus karo
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      // Agar nahi khuli to index.html open karo
      return clients.openWindow('./');
    })
  );
});

// 5. Background Push (Optional: Future use ke liye)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || "Taj Calculator Alert";
  const options = {
    body: data.body || "Time is Completed Now!",
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png'
  };
  e.waitUntil(self.registration.showNotification(title, options));
});



