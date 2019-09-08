
const cacheName = 'v995'


/* Call the Install Event:
==>to do that we need to attach an event listner to the actual worker */
self.addEventListener('install' , (e)=>{
    console.log('Service Worker : Installed ');

});


/* call the Activate Event */
self.addEventListener('activate' , (e)=>{
    console.log('Service Worker : Activated ')
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
self.addEventListener('fetch', (e)=>{
    console.log('Service Worker: fetching')

    e.respondWith(
        fetch(e.request)
            .then((response)=>{
                const resClone = response.clone();
                caches
                    .open(cacheName)
                    .then((cache)=>{
                       return cache.put( e.request , resClone )
                    });
                    return response
            })
            .catch((err)=>{
                return caches.match(e.request)
                /* return the response  */
                .then(response => response)
            })
            /* or 
            .catch(error => caches.match(e.request).then(response =>response))*/
    )

})