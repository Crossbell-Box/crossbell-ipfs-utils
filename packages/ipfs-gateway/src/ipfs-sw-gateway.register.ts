import qs from 'query-string'
import type { IpfsGatewayTemplate } from '@crossbell/ipfs-fetch'
import type { GatewayPrefix, ServiceWorkerFilename } from '@crossbell/ipfs-gateway-sw'
import { CHECK_IPFS_GATEWAY_SW_STATUS, IPFS_GATEWAY_SW_IS_UP } from '@crossbell/ipfs-gateway-sw'

import { markServiceWorkerAsRegistered } from './utils'

export type RegisterServiceWorkerConfig = {
  gatewayPrefix: GatewayPrefix
  gateways: IpfsGatewayTemplate[]
  serviceWorkerFilename: ServiceWorkerFilename
}

export function registerServiceWorker({
  serviceWorkerFilename,
  ...config
}: RegisterServiceWorkerConfig) {
  return new Promise<boolean>((resolve) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(`/${serviceWorkerFilename}?${qs.stringify(config)}`, {
          scope: '/',
        })
        .then((registration) => {
          markServiceWorkerAsRegistered()
          registration.active?.postMessage(CHECK_IPFS_GATEWAY_SW_STATUS)
        })

      const onMessage = (event: MessageEvent) => {
        if (event.data === IPFS_GATEWAY_SW_IS_UP) {
          navigator.serviceWorker.removeEventListener('message', onMessage)
          resolve(true)
        }
      }

      navigator.serviceWorker.addEventListener('message', onMessage)
    } else {
      resolve(false)
    }
  })
}
