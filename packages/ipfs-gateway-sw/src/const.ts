export type GatewayPrefix = `/${string}/`
export const DEFAULT_GATEWAY_PREFIX: GatewayPrefix = '/ipfs/'

export type ServiceWorkerFilename = `${string}.js`
export const DEFAULT_SW_FILENAME: ServiceWorkerFilename = 'ipfs-gateway-sw.js'
