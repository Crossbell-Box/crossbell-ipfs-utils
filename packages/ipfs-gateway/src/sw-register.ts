import type { IpfsGatewayTemplate } from '@crossbell/ipfs-fetch'
import type { GatewayPrefix, ServiceWorkerFilename } from '@crossbell/ipfs-gateway-sw'
import { CHECK_IPFS_GATEWAY_SW_STATUS, IPFS_GATEWAY_SW_IS_UP } from '@crossbell/ipfs-gateway-sw'
import qs from 'query-string'

export type RegisterServiceWorkerConfig = {
  gatewayPrefix: GatewayPrefix
  gateways: IpfsGatewayTemplate[]
  serviceWorkerFilename: ServiceWorkerFilename
}

export function registerServiceWorker({
  serviceWorkerFilename,
  ...config
}: RegisterServiceWorkerConfig): Promise<boolean> {
  navigator.serviceWorker.register(`/${serviceWorkerFilename}?${qs.stringify(config)}`, {
    scope: '/',
  })

  navigator.serviceWorker.ready.then((registration) => {
    return registration.active?.postMessage(CHECK_IPFS_GATEWAY_SW_STATUS)
  })

  return Promise.all([
    waitUntilServiceWorkerUp(),
    navigator.serviceWorker.register(`/${serviceWorkerFilename}?${qs.stringify(config)}`, {
      scope: '/',
    }),
  ])
    .then(() => true)
    .catch((error) => {
      console.error(error)
      return false
    })
}

function waitUntilServiceWorkerUp() {
  return new Promise<void>((resolve) => {
    const onMessage = (event: MessageEvent) => {
      if (event.data === IPFS_GATEWAY_SW_IS_UP) {
        navigator.serviceWorker.removeEventListener('message', onMessage)
        resolve()
      }
    }

    navigator.serviceWorker.addEventListener('message', onMessage)
  })
}
