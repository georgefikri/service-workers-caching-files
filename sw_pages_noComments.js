const cacheName = 'v222222'

const cacheAssets = [
    'index.html',
    'about.html',
    '/css/style.css',
    '/js/main.js',
    '/'
]

 
self.addEventListener('install' , (e)=>{
    console.log('Service Worker : Installed ');
    e.waitUntil(
        caches 
        .open(cacheName)
        .then((cache)=>{
            console.log('Service Worker : caching files');
            cache.addAll(cacheAssets)
        })
        .then(()=>{
            self.skipWaiting()
        })
     )
});


/* call the Activate Event */
self.addEventListener('activate' , (e)=>{
    console.log('Service Worker : Activated ')

    /* remove unwanted caches */
    e.waitUntil(
        caches.keys()
        .then((cacheNames) =>{
             return Promise.all(
                  cacheNames.map((cache)=>{
                        if(cache !== cacheName){
                            console.log('Service Worker: clearing old cache');

                             return caches.delete(cache)
                        }
                  })
             )
        })
    )
}); 

/* We need to be able to show our cached files if we are offline that happened in the fetch event */
self.addEventListener('fetch', (e)=>{
    console.log('Service Worker: fetching')

    e.respondWith(
        fetch(e.request)
        .catch(()=>caches.match(e.request))
    )

})