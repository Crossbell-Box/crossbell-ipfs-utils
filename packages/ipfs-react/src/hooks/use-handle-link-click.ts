import React from 'react'

import { useIpfsGateway } from './use-ipfs-gateway'

export function useHandleLinkClick(onClick?: React.MouseEventHandler<HTMLAnchorElement>) {
  const ipfsGateway = useIpfsGateway()
  const onClickRef = React.useRef(onClick)

  onClickRef.current = onClick

  return React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onClickRef.current?.(event)

      if (!event.defaultPrevented) {
        const ipfsUrl = ipfsGateway.convertToIpfsUrl(event.currentTarget.href)

        if (ipfsUrl) {
          event.preventDefault()
          ipfsGateway.openIpfsUrl(ipfsUrl)
        }
      }
    },
    [ipfsGateway],
  )
}
