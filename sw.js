/* Hunter System: Offline-Start. Immer zuerst das Netz, damit Updates sofort ankommen. */
const CACHE='hunter-v21';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res&&res.status===200){const c=res.clone();caches.open(CACHE).then(ch=>ch.put(r,c)).catch(()=>{})}
      return res;
    }).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):undefined)))
  );
});
