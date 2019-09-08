//make sure that Service workers are supported


/* i can also do this , because service worker is attached to navigator object

if(navigator.serviceWorker){

}  */

/* navigator ==> is basically the main browser object  */
if('serviceWorker' in navigator){
  /* we wanna register the service worker when the window loads */
  window.addEventListener('load' , ()=>{
    /* how we register the service worker
    1. write navigator.serviceWoker
    2. .register(fileName) 
    3. .register(fileName) returns a promise */
    navigator.serviceWorker
      .register('../sw_site_noComments.js')
      /* .register returns a promise */
      .then((response) =>{
        console.log('Service Worker: Registered')
      })
      .catch((error) => {
        console.log(`Service Workr: ${error}`)
      })
  })
}
