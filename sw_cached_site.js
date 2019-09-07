/* it's called sw_cached_site 
because that's what we're we are caching the whole site intead of making an array of the files.

==> the caching will not happen in the Intall Event it will happen in the fetch

==> Activate Event: will still the same  because we still want to remove any old cache.

==> we gonna do the real work at the fetch event
*/


/*

***********B.how to cache the entire response(site, pages) we get**************

usually the value called v1 , v2 ..etc
refer to which version of caching to be easy to differentiate */
const cacheName = 'v995'


/* Call the Install Event:
==>to do that we need to attach an event listner to the actual worker */
self.addEventListener('install' , (e)=>{
    console.log('Service Worker : Installed ');

});


/* call the Activate Event */
self.addEventListener('activate' , (e)=>{
    console.log('Service Worker : Activated ')

    /* remove unwanted caches */
    e.waitUntil(
        /* caches is storage API
        ==> what we are doing here ? caches.keys()
        we gonna loop through the caches & we gonna have a condition that says : if the current cache isn't the cache we are looping through in the current iteration we want to delete it 
        
        ==> caches.keys() returns a promise , and return array of cached keys
        remove unwanted cache
        */
        caches.keys()
        /* cacheNames represent each version of the cache v1 , v2*/
        .then((cacheNames) =>{
             return Promise.all(
                 /* .map() is a higher order function included in vanilla 
                 JS
                 
                 ==> cache: represent each (cacheName: v1 - v2 ...etc )
                 */
                  cacheNames.map((cache)=>{
                        if(cache !== cacheName){
                            console.log('Service Worker: clearing old cache');
                            /* 
                            Caches: the storage API
                            delete(): delete method
                            cache: the current cache that isn't equal 
                            to cacheName.
                            */
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
 
    /* first we need to check if the live site is available.
    if not we need to laod the cached version
   	respondWith:
	 =>This tells the browsers that we gonna handle this request outselves. & I am intercepting all fetches
    => returns a promise */
    /**************way 1  ************************/
    e.respondWith(
        /* fetch our initial request.
        ==> e.request: returns a promise  */
        fetch(e.request)
            /* 
                what we need to do here is to make a copy of the response we get ( elly hoa response parameter inside then callback function) from the server 
            */
            .then((response)=>{
                /* make copy/clone of the response */
                const resClone = response.clone();
                /* open a cache: we are doing it in the fetch Event not in the Install like the way(sw_cached_pages) 

                caches: Storage API

                open(): creates a new cache
                open(cacheName): cacheName is the variable (v1) top of the file.

                 ==>.open() returns a promise.
                */
                
                caches
                    .open(cacheName)
                    .then((cache)=>{
                        /* add response to cache(cache if the parameter in the callback function of then) 
                        
                        put(): put items to cache
                        parameter1: we use this put method we take the initial request(elly goa kosin fetch fo2).
                        parameter2:  the clone of the response, variable above
                        */
                       return cache.put( e.request , resClone )
                    });
                    /* return the response -elly bizahar el haga fel browser offline*/
                    return response
            })
            /* if the connection drops */
            .catch((err)=>{
                /* e.request: gaia men el fetch bin el kosin 
                caches: storage API
                
                cache.match(): get something out of the cache , this will return a promise for a matching response if one is found or Null otherwise.
                
                caches.match(): does the same but it tries to find a match in any cache starting with the oldest 

                ==>e.request: where the data come from? 
                as long as the user went to the site once then it should be in the cache.

                ==>caches.match ==> returns a promise & search all caches for a match.

                ==> I must use return if I add curley braces around the catch
                */
                return caches.match(e.request)
                /* return the response  */
                .then(response => response)
            })
    )
    /**********************Way2  ********************/
  /*  
          e.respondWith(
                caches.match(e.request)
                .then((response)=>{
                    if(response){
                        return response;
                    }
                return fetch(e.request)
                })
        )
  
  */

})