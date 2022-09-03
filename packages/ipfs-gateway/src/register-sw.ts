import qs from 'query-string'
import type { IpfsGatewayTemplate } from '@crossbell/ipfs-fetch'
import type { GatewayPrefix, ServiceWorkerFilename } from '@crossbell/ipfs-gateway-sw'

import { markServiceWorkerAsRegistered } from './utils'

export type RegisterServiceWorkerConfig = {
  gatewayPrefix: GatewayPrefix
  gateways: IpfsGatewayTemplate[]
  serviceWorkerFilename: ServiceWorkerFilename
}

export async function registerServiceWorker({
  serviceWorkerFilename,
  ...config
}: RegisterServiceWorkerConfig) {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker
      .register(`/${serviceWorkerFilename}?${qs.stringify(config)}`, {
        scope: '/',
      })
      .then(markServiceWorkerAsRegistered)
  }
}
