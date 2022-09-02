import { ipfsFetch, IpfsUrl } from '@crossbell/ipfs-fetch'

const typedSelf = self as unknown as ServiceWorkerGlobalScope

declare const PKG_VERSION: string // Injected in build phase
declare const BUILD_TIME: string // Injected in build phase

// eslint-disable-next-line no-console
console.log(`version: ${PKG_VERSION}; build at: ${BUILD_TIME}`)

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
