import qs from 'query-string'
import type { IpfsGatewayTemplate } from '@crossbell/ipfs-fetch'
import type { GatewayPrefix, ServiceWorkerFilename } from '@crossbell/ipfs-gateway-sw'

export type RegisterServiceWorkerConfig = {
  gatewayPrefix: GatewayPrefix
  gateways: IpfsGatewayTemplate[]
  serviceWorkerFilename: ServiceWorkerFilename
}

export function registerServiceWorker({
  serviceWorkerFilename,
  ...config
}: RegisterServiceWorkerConfig) {
  navigator.serviceWorker.register(`/${serviceWorkerFilename}?${qs.stringify(config)}`, {
    scope: '/',
  })

  return navigator.serviceWorker.ready
}
