const CACHE_NAME = 'movie-app-cache-v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll([
                    '/',
                    '../index.html',
                    '../views/catalogo.html',
                    '../views/registrarse.html',
                    '../views/contacto.html',
                    '../views/iniciarSesion.html',
                    '../views/favoritos.html',
                    '/js/main.js',
                    '/js/scripts.js',
                    '/js/contacto.js',
                    '../css/styles.css',
                    '../icons/icon-192x192.png',
                    '../icons/icon-512x512.png',
                    "https://fonts.googleapis.com/icon?family=Material+Icons",
                    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
                    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
                    "https://code.jquery.com/jquery-3.6.0.min.js"
                ]);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(response => {
                if (response) {
                    return response;
                }

                const fetchRequest = request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});
