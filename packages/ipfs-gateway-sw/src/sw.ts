import { ipfsFetch, IpfsGatewayTemplate } from '@crossbell/ipfs-fetch'

import {
  CHECK_IPFS_GATEWAY_SW_STATUS,
  IPFS_GATEWAY_SW_IS_UP,
  DEFAULT_GATEWAY_PREFIX,
  GatewayPrefix,
} from './const'

const typedSelf = self as unknown as ServiceWorkerGlobalScope

declare const PKG_VERSION: string // Injected in build phase
declare const BUILD_TIME: string // Injected in build phase

let gateways: IpfsGatewayTemplate[] = []
let gatewayPrefix = DEFAULT_GATEWAY_PREFIX

// eslint-disable-next-line no-console
console.log(`version: ${PKG_VERSION}; build at: ${BUILD_TIME}`)

typedSelf.addEventListener('install', (event) => {
  const params = new URL(location as URL).searchParams

  gatewayPrefix = (params.get('gatewayPrefix') as GatewayPrefix) ?? gatewayPrefix
  gateways = (params.getAll('gateways') as IpfsGatewayTemplate[]) ?? []

  event.waitUntil(typedSelf.skipWaiting())
})

typedSelf.addEventListener('activate', (event) => {
  event.waitUntil(typedSelf.clients.claim())
  broadcastStatus()
})

typedSelf.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (url.origin === typedSelf.location.origin && url.pathname.startsWith(gatewayPrefix)) {
    event.respondWith(
      ipfsFetch(`ipfs://${url.pathname.substring(gatewayPrefix.length)}`, {
        gateways: gateways.length > 0 ? gateways : undefined,
        headers: event.request.headers,
        cache: event.request.cache,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
        referrerPolicy: event.request.referrerPolicy,
        signal: event.request.signal,
      }),
    )
  }
})

typedSelf.addEventListener('message', (event) => {
  if (event.data === CHECK_IPFS_GATEWAY_SW_STATUS) {
    broadcastStatus()
  }
})

function broadcastStatus() {
  typedSelf.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage(IPFS_GATEWAY_SW_IS_UP))
  })
}
