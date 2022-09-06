import type { Web2Url, IpfsUrl, IpfsInfo, IpfsGatewayTemplate } from './types'

import { DEFAULT_IPFS_GATEWAYS } from './constant'

export type Web2Info = { url: Web2Url; gateway: IpfsGatewayTemplate }

const ipfsUrlRegex = /^ipfs:\/\/([^/]+)(.*)$/

export function parseIpfsInfo(ipfsUrl: IpfsUrl): IpfsInfo
export function parseIpfsInfo(ipfsUrl: string): IpfsInfo | null
export function parseIpfsInfo(ipfsUrl: string): IpfsInfo | null {
  const [, cid = '', pathToResource = ''] = ipfsUrlRegex.exec(ipfsUrl) ?? []

  if (!cid) {
    return null
  }

  return {
    cid,
    pathToResource: pathToResource as IpfsInfo['pathToResource'],
  }
}

export function fillIpfsGatewayTemplate(gateway: IpfsGatewayTemplate, ipfsInfo: IpfsInfo): Web2Url {
  const formattedPath = (() => {
    if (ipfsInfo.pathToResource === '' || ipfsInfo.pathToResource.startsWith('/')) {
      return ipfsInfo.pathToResource
    } else {
      return `/${ipfsInfo.pathToResource}`
    }
  })()

  return gateway
    .replace(/{cid}/g, ipfsInfo.cid)
    .replace(/\/?{pathToResource}/g, formattedPath) as Web2Url
}

export function ipfsToWeb2InfoList(
  ipfsUrl: IpfsUrl,
  gateways: IpfsGatewayTemplate[] = DEFAULT_IPFS_GATEWAYS,
): Web2Info[] {
  const ipfsInfo = parseIpfsInfo(ipfsUrl)

  if (!ipfsInfo) {
    return []
  }

  return gateways.map((gateway) => ({
    gateway,
    url: fillIpfsGatewayTemplate(gateway, ipfsInfo),
  }))
}

export function isIpfsUrl(url: string): url is IpfsUrl {
  return ipfsUrlRegex.test(url)
}
