import { DEFAULT_GATEWAY_PREFIX, DEFAULT_SW_FILENAME } from '@crossbell/ipfs-gateway-sw'
import {
  DEFAULT_IPFS_GATEWAYS,
  parseIpfsInfo,
  fillIpfsGatewayTemplate,
  Web2Url,
  IpfsUrl,
  IpfsGatewayTemplate,
  ipfsFetch,
  isIpfsUrl,
} from '@crossbell/ipfs-fetch'

import { registerServiceWorker, RegisterServiceWorkerConfig } from './sw-register'
import {
  isBrowser,
  markServiceWorkerAsRegistered,
  checkIfServiceWorkerRegisteredBefore,
  markServiceWorkerAsUnregistered,
} from './utils'

export type IpfsGatewayConfig = {
  gateways: IpfsGatewayTemplate[]
  serviceWorker: Omit<RegisterServiceWorkerConfig, 'gateways'> | null
}

export type IpfsGatewaySwStatus = 'disabled' | 'first-time-install' | 'pending-response' | 'ready'

const DEFAULT_CONFIG: IpfsGatewayConfig = {
  gateways: DEFAULT_IPFS_GATEWAYS,
  serviceWorker: {
    gatewayPrefix: DEFAULT_GATEWAY_PREFIX,
    serviceWorkerFilename: DEFAULT_SW_FILENAME,
  },
}

export class IpfsGateway {
  private readonly fallbackGateway: IpfsGatewayTemplate
  private readonly config: IpfsGatewayConfig

  readonly registration: Promise<boolean>

  private _swStatus: IpfsGatewaySwStatus

  get swStatus() {
    return this._swStatus
  }

  constructor(config: Partial<IpfsGatewayConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.fallbackGateway = this.config.gateways[0] ?? DEFAULT_IPFS_GATEWAYS[0]

    const swInfo = ((): { status: IpfsGatewaySwStatus; registration: Promise<boolean> } => {
      const { gateways, serviceWorker: swConfig } = this.config

      if (isBrowser && swConfig && 'serviceWorker' in navigator) {
        const registerConfig = { gateways, ...swConfig }
        return {
          status: checkIfServiceWorkerRegisteredBefore(swConfig.serviceWorkerFilename)
            ? 'pending-response'
            : 'first-time-install',

          registration: registerServiceWorker(registerConfig).then((isReady) => {
            if (isReady) {
              this._swStatus = 'ready'
              markServiceWorkerAsRegistered(swConfig.serviceWorkerFilename)
              return true
            } else {
              this._swStatus = 'disabled'
              markServiceWorkerAsUnregistered(swConfig.serviceWorkerFilename)
              return false
            }
          }),
        }
      } else {
        return {
          status: 'disabled',
          registration: Promise.resolve(false),
        }
      }
    })()

    this._swStatus = swInfo.status
    this.registration = swInfo.registration
  }

  async getWeb2Url(ipfsUrl: IpfsUrl): Promise<Web2Url>
  async getWeb2Url(ipfsUrl: string): Promise<Web2Url | null>
  async getWeb2Url(ipfsUrl: string): Promise<Web2Url | null> {
    const isSwReady = this.config.serviceWorker ? await this.registration : false
    const swWeb2Url = isSwReady ? this.getSwWeb2Url(ipfsUrl) : null

    return swWeb2Url ?? (await this.getFastestWeb2Url(ipfsUrl)) ?? this.getFallbackWeb2Url(ipfsUrl)
  }

  async getFastestWeb2Url(ipfsUrl: string): Promise<Web2Url | null> {
    if (!isIpfsUrl(ipfsUrl)) return null

    try {
      const res = await ipfsFetch(ipfsUrl, {
        redirect: 'error',
        gateways: this.config.gateways,
      })

      return res.url as Web2Url
    } catch (e) {
      console.error(e)
      return null
    }
  }

  getSwWeb2Url(ipfsUrl: IpfsUrl): Web2Url
  getSwWeb2Url(ipfsUrl: string): Web2Url | null
  getSwWeb2Url(ipfsUrl: string): Web2Url | null {
    const gatewayPrefix = this.config.serviceWorker?.gatewayPrefix ?? DEFAULT_GATEWAY_PREFIX
    const ipfsInfo = parseIpfsInfo(ipfsUrl)

    return ipfsInfo && fillIpfsGatewayTemplate(`${gatewayPrefix}{cid}{pathToResource}`, ipfsInfo)
  }

  getFallbackWeb2Url(ipfsUrl: IpfsUrl): Web2Url
  getFallbackWeb2Url(ipfsUrl: string): Web2Url | null
  getFallbackWeb2Url(ipfsUrl: string): Web2Url | null {
    const ipfsInfo = parseIpfsInfo(ipfsUrl)

    return ipfsInfo && fillIpfsGatewayTemplate(this.fallbackGateway, ipfsInfo)
  }
}
