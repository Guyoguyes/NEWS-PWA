const staticAssets = [
  './',
  './app.js',
  './style.css',
  './node_modules/bootstrap/dist/css/bootstrap.min.css',
  './node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css',
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.min.js',
  './node_modules/@fortawesome/fontawesome-free/js/fontawesome.min.js',
  './fallback.json',
  './images/fetch-dog.jpg'
]

self.addEventListener('install', async event => {
  const cache = await caches.open('news-static');
  cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if(url.origin === location.origin){
      event.respondWith(cacheFirst(req));
  }else{
      event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req){
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req){
  const cache = await caches.open('news-dynamic');

  try {
      const res = await fetch(req);
      cache.put(req, res.clone());
      return res;
  }catch (error){
      const cachedResponse = await cache.match(req);
      return cachedResponse || await caches.match('./fallback.json');
  }
}