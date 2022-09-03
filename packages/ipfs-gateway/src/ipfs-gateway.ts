import {
  DEFAULT_IPFS_GATEWAYS,
  ipfsFetch,
  Web2Url,
  IpfsUrl,
  IpfsGatewayTemplate,
} from '@crossbell/ipfs-fetch'

export class IpfsGateway {
  constructor(private readonly gateways: IpfsGatewayTemplate[] = DEFAULT_IPFS_GATEWAYS) {}

  getFastestGatewayUrl = async (ipfsUrl: IpfsUrl): Promise<Web2Url> => {
    const res = await ipfsFetch(ipfsUrl, {
      method: 'head',
      redirect: 'error',
      gateways: this.gateways,
    })

    return res.url as Web2Url
  }
}
