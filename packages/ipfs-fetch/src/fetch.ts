import type { IpfsUrl, IpfsGatewayTemplate } from './types'
import { DEFAULT_IPFS_GATEWAYS } from './constant'
import { ipfsToWeb2InfoList } from './utils'
import { IpfsFetchError, IpfsFetchErrorType } from './fetch-error'

export type IpfsToFastestWeb2UrlConfig = RequestInit & {
  gateways?: IpfsGatewayTemplate[]
}

const NEVER = new Promise<never>(() => {})

export function ipfsFetch(
  ipfsUrl: IpfsUrl,
  { gateways = DEFAULT_IPFS_GATEWAYS, signal, ...fetchConfig }: IpfsToFastestWeb2UrlConfig = {},
): Promise<Response> {
  const web2InfoList = ipfsToWeb2InfoList(ipfsUrl, gateways)
  const abortControllerSet = new Set<AbortController>()
  let failedRequestCount = 0

  return Promise.race(
    web2InfoList.map((info) => {
      const abortController = new AbortController()

      abortControllerSet.add(abortController)
      signal?.addEventListener('abort', () => abortController.abort())

      const checkIfAllRequestsFailed = (): Promise<never> => {
        failedRequestCount += 1

        if (failedRequestCount >= web2InfoList.length) {
          return Promise.reject(
            new IpfsFetchError(IpfsFetchErrorType.allFailed, ipfsUrl, web2InfoList),
          )
        } else {
          return NEVER
        }
      }

      return fetch(info.url, { ...fetchConfig, signal: abortController.signal })
        .then((response) => {
          // Only resolve successful requests
          if (response.status === 200) {
            // Remove current abortController to avoid unexpected abort behavior
            abortControllerSet.delete(abortController)

            return response
          } else {
            return checkIfAllRequestsFailed()
          }
        })
        .catch((err) => {
          if (err instanceof Error && err.name === 'AbortError') {
            return Promise.reject(err)
          } else {
            return checkIfAllRequestsFailed()
          }
        })
    }),
  ).finally(() => {
    abortControllerSet.forEach((abortController) => abortController.abort())
    abortControllerSet.clear()
  })
}
