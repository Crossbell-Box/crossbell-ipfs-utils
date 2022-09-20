import type { IpfsGateway, IpfsUrl, Web2Url } from '@crossbell/ipfs-gateway'

import { useEffect, useState, useRef, useCallback } from 'react'

import { useIpfsGateway } from './use-ipfs-gateway'

export function useWeb2Url(ipfsUrl: IpfsUrl): Web2Url
export function useWeb2Url(ipfsUrl: string, getDefaultUrl: () => Web2Url): Web2Url
export function useWeb2Url(ipfsUrl: string, getDefaultUrl?: () => Web2Url | null): Web2Url | null
export function useWeb2Url(ipfsUrl: string, getDefaultUrl?: () => Web2Url | null): Web2Url | null {
  const ipfsGateway = useIpfsGateway()

  const web2Url = usePromiseUrl(ipfsGateway, ipfsUrl)

  return web2Url ?? getDefaultUrl?.() ?? ipfsGateway.getFallbackWeb2Url(ipfsUrl)
}

function usePromiseUrl(ipfsGateway: IpfsGateway, ipfsUrl: string): Web2Url | null {
  const forceUpdate = useForceUpdate()
  const ipfsUrlRef = useRef(ipfsUrl)
  const urlRef = useRef<Web2Url | null>(null)

  // Using ref to avoid unnecessary re-render.
  if (ipfsUrlRef.current !== ipfsUrl) {
    ipfsUrlRef.current = ipfsUrl

    if (ipfsGateway.swStatus === 'pending-response' || ipfsGateway.swStatus === 'ready') {
      urlRef.current = ipfsGateway.getSwWeb2Url(ipfsUrl)
    } else {
      urlRef.current = null
    }
  }

  useEffect(() => {
    if (urlRef.current !== null) return

    let isCanceled = false

    ipfsGateway.getWeb2Url(ipfsUrl).then((fastestUrl) => {
      if (!isCanceled && fastestUrl !== urlRef.current) {
        urlRef.current = fastestUrl
        forceUpdate()
      }
    })

    return () => {
      isCanceled = true
    }
  }, [ipfsUrl])

  return urlRef.current
}

function useForceUpdate() {
  const [, forceUpdate] = useState(0)

  return useCallback(() => forceUpdate((count) => count + 1), [forceUpdate])
}
