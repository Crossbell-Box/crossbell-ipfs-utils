export const CHECK_IPFS_GATEWAY_SW_STATUS = 'CHECK_IPFS_GATEWAY_WS_STATUS'
export const IPFS_GATEWAY_SW_IS_UP = 'IPFS_GATEWAY_WS_IS_UP'

export type GatewayPrefix = `/${string}/`
export const DEFAULT_GATEWAY_PREFIX: GatewayPrefix = '/ipfs/'

export type ServiceWorkerFilename = `${string}.js`
export const DEFAULT_SW_FILENAME: ServiceWorkerFilename = 'ipfs-gateway-sw.js'
