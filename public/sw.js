// public/sw.js

const CACHE_NAME = "eztechmovie-streamlist-v1";
const OFFLINE_URLS = ["/", "/index.html", "/manifest.webmanifest"];

// Install event: pre-cache important files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );

  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch event — network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Handle only GET requests
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try network
        const networkResponse = await fetch(request);

        // Cache a copy of the response
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());

        return networkResponse;
      } catch (error) {
        console.warn("Service Worker fetch failed:", error);

        // Return cached version if available
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Last resort: load offline home page
        return caches.match("/");
      }
    })()
  );
});
