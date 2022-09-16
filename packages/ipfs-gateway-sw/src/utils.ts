import type { IpfsUrl } from '@crossbell/ipfs-fetch'
import escapeStringRegexp from 'escape-string-regexp'

export function swGatewayUrlToIpfsUrl(gatewayPrefix: string, urlStr: string): IpfsUrl | null {
  try {
    const url = urlStr.startsWith('http') ? new URL(urlStr) : null
    const pathname = url?.pathname ?? urlStr
    const isValidOrigin = url ? url.origin === location.origin : true
    const isSwGatewayUrl = isValidOrigin && pathname.startsWith(gatewayPrefix)

    return isSwGatewayUrl
      ? (pathname.replace(
          new RegExp(`^${escapeStringRegexp(gatewayPrefix)}`),
          'ipfs://',
        ) as IpfsUrl)
      : null
  } catch {
    return null
  }
}
