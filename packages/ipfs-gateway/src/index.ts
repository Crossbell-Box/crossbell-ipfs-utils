import { DEFAULT_GATEWAY_PREFIX, DEFAULT_SW_FILENAME } from '@crossbell/ipfs-gateway-sw'
import {
  DEFAULT_IPFS_GATEWAYS,
  parseIpfsInfo,
  fillIpfsGatewayTemplate,
  Web2Url,
  IpfsUrl,
  IpfsGatewayTemplate,
} from '@crossbell/ipfs-fetch'

import { registerServiceWorker, RegisterServiceWorkerConfig } from './register-sw'
import { isBrowser, checkIfServiceWorkerRegistered } from './utils'

const DEFAULT_CONFIG: RegisterServiceWorkerConfig = {
  gatewayPrefix: DEFAULT_GATEWAY_PREFIX,
  gateways: DEFAULT_IPFS_GATEWAYS,
  serviceWorkerFilename: DEFAULT_SW_FILENAME,
}

export class IpfsGateway {
  private readonly fallbackGateway: IpfsGatewayTemplate
  private readonly config: RegisterServiceWorkerConfig

  constructor(config: Partial<RegisterServiceWorkerConfig> = {}) {
    this.config = { ...config, ...DEFAULT_CONFIG }
    this.fallbackGateway = this.config.gateways[0] ?? DEFAULT_IPFS_GATEWAYS[0]

    if (isBrowser) {
      registerServiceWorker(this.config)
    }
  }

  getLocalGatewayUrl = (ipfsUrl: IpfsUrl): Web2Url => {
    const ipfsInfo = parseIpfsInfo(ipfsUrl)

    if (!ipfsInfo) {
      throw new Error(`Invalid IPFS URL: ${ipfsUrl}`)
    }

    return fillIpfsGatewayTemplate(`${this.config.gatewayPrefix}{cid}{pathToResource}`, ipfsInfo)
  }

  getGatewayUrl = (ipfsUrl: IpfsUrl): Web2Url => {
    if (checkIfServiceWorkerRegistered()) {
      return this.getLocalGatewayUrl(ipfsUrl)
    }

    const ipfsInfo = parseIpfsInfo(ipfsUrl)

    if (!ipfsInfo) {
      throw new Error(`Invalid IPFS URL: ${ipfsUrl}`)
    }

    return fillIpfsGatewayTemplate(this.fallbackGateway, ipfsInfo)
  }
}
