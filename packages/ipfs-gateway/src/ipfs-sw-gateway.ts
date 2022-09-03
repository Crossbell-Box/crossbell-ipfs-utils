import { DEFAULT_GATEWAY_PREFIX, DEFAULT_SW_FILENAME } from '@crossbell/ipfs-gateway-sw'
import {
  DEFAULT_IPFS_GATEWAYS,
  parseIpfsInfo,
  fillIpfsGatewayTemplate,
  Web2Url,
  IpfsUrl,
  IpfsGatewayTemplate,
} from '@crossbell/ipfs-fetch'

import { registerServiceWorker, RegisterServiceWorkerConfig } from './ipfs-sw-gateway.register'
import { isBrowser, checkIfServiceWorkerRegistered } from './utils'

export type IpfsSwGatewayConfig = RegisterServiceWorkerConfig

const DEFAULT_CONFIG: RegisterServiceWorkerConfig = {
  gatewayPrefix: DEFAULT_GATEWAY_PREFIX,
  gateways: DEFAULT_IPFS_GATEWAYS,
  serviceWorkerFilename: DEFAULT_SW_FILENAME,
}

export class IpfsSwGateway {
  private readonly fallbackGateway: IpfsGatewayTemplate
  private readonly config: IpfsSwGatewayConfig

  readonly registration: Promise<boolean>

  constructor(config: Partial<IpfsSwGatewayConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.fallbackGateway = this.config.gateways[0] ?? DEFAULT_IPFS_GATEWAYS[0]
    this.registration = isBrowser ? registerServiceWorker(this.config) : Promise.resolve(false)
  }

  getSwGatewayUrl = (ipfsUrl: IpfsUrl): Web2Url => {
    const ipfsInfo = parseIpfsInfo(ipfsUrl)

    if (!ipfsInfo) {
      throw new Error(`Invalid IPFS URL: ${ipfsUrl}`)
    }

    return fillIpfsGatewayTemplate(`${this.config.gatewayPrefix}{cid}{pathToResource}`, ipfsInfo)
  }

  getFallbackGatewayUrl = (ipfsUrl: IpfsUrl): Web2Url => {
    const ipfsInfo = parseIpfsInfo(ipfsUrl)

    if (!ipfsInfo) {
      throw new Error(`Invalid IPFS URL: ${ipfsUrl}`)
    }

    return fillIpfsGatewayTemplate(this.fallbackGateway, ipfsInfo)
  }

  getGatewayUrl = (ipfsUrl: IpfsUrl): Web2Url => {
    if (checkIfServiceWorkerRegistered()) {
      return this.getSwGatewayUrl(ipfsUrl)
    } else {
      return this.getFallbackGatewayUrl(ipfsUrl)
    }
  }
}
