// store static cache name in a variable for future app updates
const staticCacheName = 'easylist-v1.0';

// install the service worker and cache the files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache =>
      cache.addAll([
        '/',
        '/index.html',
        '/index.bundle.js',
        '/CreateList.bundle.js',
        '/CreateList~EditList~List~ListCopy~SharedList~SignIn~SignUp~ViewLists.bundle.js',
        '/Donate.bundle.js',
        '/EditList.bundle.js',
        '/Home.bundle.js',
        '/List.bundle.js',
        '/ListCopy.bundle.js',
        '/NoMatch.bundle.js',
        '/SharedList.bundle.js',
        '/SignIn.bundle.js',
        '/SignUp.bundle.js',
        '/vendors~CreateList~EditList~List~ListCopy~SharedList~SignIn~SignUp~ViewLists.bundle.js',
        '/ViewLists.bundle.js',
        '/images/bold.svg',
        '/images/checkbox.svg',
        '/images/checkmark.svg',
        '/images/easylist-logo.svg',
        '/images/github.svg',
        '/images/italic.svg',
        '/images/link.svg',
        '/images/linkedin.svg',
        '/images/notify.svg',
        '/images/ol.svg',
        '/images/pantone.svg',
        '/images/paper.svg',
        '/images/save-icon.svg',
        '/images/twitter.svg',
        '/images/website.svg',
        '/images/our-pic-400.jpg',
        '/images/our-pic-600.jpg',
        '/images/our-pic-800.jpg',
        '/images/our-pic-1000.jpg',
        '/images/our-pic-1200.jpg',
        '/images/paypal-donate-400.jpg',
        '/images/paypal-donate-500.jpg'
      ])
    )
  );
});

// check the current version and delete old service workers
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cachesNames => {
      return Promise.all(
        cachesNames.filter(cacheName => {
          return cacheName.startsWith('easylist-') && cacheName != staticCacheName;
        }).map(cacheName => {
          // eslint-disable-next-line no-undef
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// fetch from the cache if available and then
// check network for new version to cache, otherwise get from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      event.request.clone();
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(staticCacheName)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return response;
      });
    })
  );
});