const CACHE_NAME = "pwa-dynamic-cache";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Install event: Cache our basic files right away
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Network-First strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // 1. We got a response from the internet! 
        // Save a copy of it to the cache for later.
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        
        // Return the fresh file to the user
        return networkResponse;
      })
      .catch(() => {
        // 2. The network failed (the user is offline).
        // Fall back to the files we saved in the cache.
        return caches.match(event.request);
      })
  );
});