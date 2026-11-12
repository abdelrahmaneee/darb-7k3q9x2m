const V='darb-v2';
const SHELL=['./','./index.html','./fb.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const font=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin===location.origin){
    // network first (so updates arrive when online), cache fallback (works offline)
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
  }else if(font){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>{const n=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>m);return m||n})));
  }
});
