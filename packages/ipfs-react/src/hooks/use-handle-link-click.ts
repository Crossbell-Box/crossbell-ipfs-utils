import { isIpfsUrl, swGatewayUrlToIpfsUrl } from '@crossbell/ipfs-gateway'
import React from 'react'

import { useIpfsGateway } from './use-ipfs-gateway'

export function useHandleLinkClick() {
  const ipfsGateway = useIpfsGateway()

  return React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const elm = event.currentTarget
      const link = elm.href
      const gatewayPrefix = ipfsGateway.config.serviceWorker?.gatewayPrefix
      const ipfsUrl = (() => {
        if (isIpfsUrl(link)) {
          return link
        } else if (gatewayPrefix) {
          return swGatewayUrlToIpfsUrl(gatewayPrefix, link)
        } else {
          return null
        }
      })()

      if (ipfsUrl) {
        const newWindow = window.open()

        if (newWindow) {
          event.preventDefault()

          ipfsGateway
            .getFastestWeb2Url(ipfsUrl)
            .catch(() => null)
            .then((url) => url ?? ipfsGateway.getFallbackWeb2Url(ipfsUrl))
            .then((url) => (newWindow.location.href = url))
        }
      }
    },
    [ipfsGateway],
  )
}
