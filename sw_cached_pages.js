/* we gonna cache all of our pages we gonna need 
1. the assets(css - js - images ..etc)
2. HTML pages 
There are 2 ways to do it 
    A. how to cache the indidual pages 
    B. how to cache the entire response(entire site, pages) we get 
*/


/*

***********A.how to cache the indidual pages**************

usually the value called v1 , v2 ..etc
refers to which version of caching to be easy to differentiate */
const cacheName = 'v1111111111111'

/* here we gonna create an array holding all of our assets 
array of all of our pages.
take care  of the path of the files to be written correctly.

==> since there aren't many files in the sites this is a fine method to do it.

==> if we have a ton of pages then we gonna do the second way , basically taking the entire response and caching it.

in the Install Event where we wanna handle caching these assets 
*/
const cacheAssets = [
    'index.html',
    'about.html',
    '/css/style.css',
    '/js/main.js',
    '/'
]

 

/* Call the Install Event:
==>to do that we need to attach an event listner(install) to the actual worker */
self.addEventListener('install' , (e)=>{
    console.log('Service Worker : Installed ');

    /*Caching Assets
        which is basically telling the browser to wait until the promise is finished until 
        it get rids of the service worker */
    e.waitUntil(
        /* 
        ==>here we gonna use "caches" storage API.
        
        ==>.open() creates a new cache.
        inside .open(cacheName) we want to pass our cacheName
        ??cacheName : is the variable we defined on top of the file "v1".

        ==>.open() returns a promise.
          */
        caches 
        .open(cacheName)
        /* success of promise */
        .then((cache)=>{
            console.log('Service Worker : caching files');
            /* cache word below is the parameter inside then callback func.
            
            ==> we gonna use methond called .addAll() then we gonna pass all of our assets (the array above)
           addAll also returns a promise
            */

            cache.addAll(cacheAssets)
        })
        /* we just gonna add another .then() so whenever everything is all set we can skip waiting */
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
        /* caches is storage API
        ==> what we are doing here ? caches.keys()
        we gonna loop through the caches & we gonna have a condition that says : if the current cache isn't the cache we are looping through in the current iteration we want to delete it 
        
        ==> caches.keys() returns a promise , and return array of cached keys
        */
        caches.keys()
        /* cacheNames represent all version of the cache v1 , v2*/
        .then((cacheNames) =>{
             return Promise.all(
                 /* .map() is a higher order function included in vanilla 
                 JS
                 
                 ==> cache: represent each (cacheName: v1 - v2 ...etc )
                 cacheName : the variable above ( v1)
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
    => returns a promise*/
    e.respondWith(
        /* what we wanna fetch is the initial request.
        we can get that with the event parameter (e).request.
        if there is no connection this gonna fail.
        ==> it returns a (promise) if it fails 
        
        ==>I must use return if I add curley braces around the catch
         */
        fetch(e.request)
            /* 
            cache.match(): get something out of the cache , this will return a promise for a matching response if one is found or Null otherwise.  
            caches.match(): does the same but it tries to find a match in any cache starting with the oldest             
            caches : Storage API
            match(): is what i wanna load from the cache.
            e.request : will load the data from the cache, the file whatefer we're looking for: index.html , about.html will load it from the cache 
            */
        .catch(()=>caches.match(e.request))
    )

})