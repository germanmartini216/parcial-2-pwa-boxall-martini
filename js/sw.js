const ALMACEN ='chaches';
const LISTA_ARCHIVOS_CACHEADOS = [
    '../js/main.js',
    '../js/scripts.js',
    '../index.html',
    '../views/contacto.html',
    '../views/catalogo.html',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
]

self.addEventListener('install', (e) => {
    console.log("Instalando...");
    e.waitUntil(
        caches.has(ALMACEN).then(estaInstalado => {
            if(!estaInstalado) {
                return caches.open(ALMACEN).then(cache => {
                    cache.addAll(LISTA_ARCHIVOS_CACHEADOS);
                })        
            }
        })
    );
})

self.addEventListener('activate', () => {
    console.log("Soy un service worker. Y me estoy activado");
});

self.addEventListener('fetch-only', (e) => {
    console.log("cache only")
    const consulta = e.request;
    const respuestaCacheada = caches.match(consulta).then((respuesta) => {
        console.log("responde", respuesta)
        if(respuesta) return respuesta;
        return fetch(consulta).then((respuesta) => {
            return respuesta;
        })
    })
    e.respondWith(respuestaCacheada);
})
self.addEventListener('fetch', (e) => {
    console.log("cache dinamica")
    const consulta = e.request;
    const respuestaCacheada = caches.match(consulta).then(async (respuesta) => {
        if(respuesta) return respuesta;
        const nuevaRespuesta = await fetch(consulta) //si no está cacheado, lo busca
        const cache = await caches.open(ALMACEN) //busco el almacen
        await cache.put(consulta, nuevaRespuesta.clone()) //guardo lo que encontró con fetch
        return nuevaRespuesta;
    })
    e.respondWith(respuestaCacheada);
})