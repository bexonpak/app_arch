console.log('In service worker.')
const HOST_NAME = location.host
// web app version
const VERSION_NAME = 'CJ-v4'

// data version
const DATA_VERSION_NAME = 'DATA-v4'
const CACHE_NAME = HOST_NAME + '-' + VERSION_NAME
const DATA_CACHE_NAME = HOST_NAME + '-' + DATA_VERSION_NAME

this.addEventListener('install', (event) => {
    console.log('Install success, version:', VERSION_NAME)
    event.waitUntil(
        caches.open(VERSION_NAME).then(function (cache) {
            return cache.addAll([
                './',
                './index.html',
                './vue.min.js',
                './axios.min.js',
                './axios.min.map',
                './main.js'
            ])
        })
    )
    event.waitUntil(
        caches.open(DATA_VERSION_NAME).then(function (cache) {
            return cache.addAll([
                './cj.json',
                './big5_unicode.json'
            ])
        })
    )
})

this.addEventListener('activate', (event) => {
    console.log('Activated')
    console.log('UPDATE CACHE...')
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all([
                    // delete old version
                    cacheNames.map((cacheName) => {
                        cacheNameStringArray = cacheName.split('-')
                        if (cacheNameStringArray[0] === 'CJ') {
                            if (CACHE_NAME.indexOf(cacheName) === -1) {
                                return caches.delete(cacheName)
                            }
                        } else if (cacheNameStringArray[0] === 'DATA') {
                            if (DATA_CACHE_NAME.indexOf(cacheName) === -1) {
                                return caches.delete(cacheName)
                            }
                        }
                    })
                ])
            })
    )
    console.log('✅Done!')
})

this.addEventListener('fetch', (event) => {
    console.log('onFetch')
    event.respondWith(
        caches.match(event.request)
    )
})