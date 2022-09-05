import type { IpfsUrl, Web2Url } from '@crossbell/ipfs-fetch'
import type { IpfsGateway } from '@crossbell/ipfs-gateway'

import { useEffect, useState, useRef } from 'react'

import { useIpfsGateway } from './use-ipfs-gateway'

export function useWeb2Url(ipfsUrl: IpfsUrl): Web2Url | null
export function useWeb2Url(ipfsUrl: IpfsUrl, getDefaultUrl: () => Web2Url): Web2Url
export function useWeb2Url(ipfsUrl: IpfsUrl, getDefaultUrl: () => Web2Url | null): Web2Url | null
export function useWeb2Url(ipfsUrl: IpfsUrl, getDefaultUrl?: () => Web2Url | null): Web2Url | null {
  const ipfsGateway = useIpfsGateway()

  const web2Url = usePromiseUrl(ipfsGateway, ipfsUrl)

  return web2Url ?? getDefaultUrl?.() ?? ipfsGateway.getFallbackWeb2Url(ipfsUrl)
}

function usePromiseUrl(ipfsGateway: IpfsGateway, ipfsUrl: IpfsUrl): Web2Url | null {
  const [url, setUrl] = useState<Web2Url | null>(null)
  const ipfsUrlRef = useRef(ipfsUrl)

  if (ipfsUrlRef.current !== ipfsUrl) {
    ipfsUrlRef.current = ipfsUrl

    if (ipfsGateway.swStatus === 'pending-response' || ipfsGateway.swStatus === 'ready') {
      setUrl(ipfsGateway.getSwWeb2Url(ipfsUrl))
    } else {
      setUrl(null)
    }
  }

  useEffect(() => {
    if (url !== null) return

    let isCanceled = false

    ipfsGateway.getWeb2Url(ipfsUrl).then((fastestUrl) => {
      if (!isCanceled && fastestUrl !== url) {
        setUrl(fastestUrl)
      }
    })

    return () => {
      isCanceled = true
    }
  }, [ipfsUrl, url])

  return url
}
