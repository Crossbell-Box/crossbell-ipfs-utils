import { DEFAULT_GATEWAY_PREFIX, DEFAULT_SW_FILENAME } from '@crossbell/ipfs-gateway-sw'
import {
  DEFAULT_IPFS_GATEWAYS,
  parseIpfsInfo,
  fillIpfsGatewayTemplate,
  ipfsFetch,
  Web2Url,
  IpfsUrl,
  IpfsGatewayTemplate,
} from '@crossbell/ipfs-fetch'

import { registerServiceWorker, RegisterServiceWorkerConfig } from './register-sw'
import { isBrowser, checkIfServiceWorkerRegistered } from './utils'

export type IpfsGatewayConfig = RegisterServiceWorkerConfig & {
  noServiceWorker: boolean
}

const DEFAULT_CONFIG: IpfsGatewayConfig = {
  noServiceWorker: false,
  gatewayPrefix: DEFAULT_GATEWAY_PREFIX,
  gateways: DEFAULT_IPFS_GATEWAYS,
  serviceWorkerFilename: DEFAULT_SW_FILENAME,
}

export class IpfsGateway {
  private readonly fallbackGateway: IpfsGatewayTemplate
  private readonly config: IpfsGatewayConfig

  readonly registration: Promise<boolean>

  constructor(config: Partial<IpfsGatewayConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.fallbackGateway = this.config.gateways[0] ?? DEFAULT_IPFS_GATEWAYS[0]
    this.registration =
      isBrowser && !this.config.noServiceWorker
        ? registerServiceWorker(this.config)
        : Promise.resolve(false)
  }

  getLocalGatewayUrl = (ipfsUrl: IpfsUrl): Web2Url => {
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
      return this.getLocalGatewayUrl(ipfsUrl)
    } else {
      return this.getFallbackGatewayUrl(ipfsUrl)
    }
  }

  getFastestGatewayUrl = async (ipfsUrl: IpfsUrl): Promise<Web2Url> => {
    const res = await ipfsFetch(ipfsUrl, { method: 'head', redirect: 'error' })

    return res.url as Web2Url
  }
}
