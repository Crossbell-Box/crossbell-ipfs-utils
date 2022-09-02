import { ipfsFetch, IpfsUrl } from '@crossbell/ipfs-fetch'

const typedSelf = self as unknown as ServiceWorkerGlobalScope

console.log('v1')

typedSelf.addEventListener('install', (event) => {
  event.waitUntil(typedSelf.skipWaiting())
})

typedSelf.addEventListener('activate', (event) => {
  event.waitUntil(typedSelf.clients.claim())
})

typedSelf.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/ipfs')) {
    event.respondWith(ipfsFetch(url.pathname.replace(/^\/ipfs\//, 'ipfs://') as IpfsUrl))
  }
})
