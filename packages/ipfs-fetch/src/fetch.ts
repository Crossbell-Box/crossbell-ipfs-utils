import type { IpfsUrl, IpfsGatewayTemplate } from './types'
import { DEFAULT_IPFS_GATEWAYS } from './constant'
import { ipfsToWeb2InfoList } from './utils'
import { IpfsFetchError, IpfsFetchErrorType } from './fetch-error'

export type IpfsToFastestWeb2UrlConfig = RequestInit & {
  gateways?: IpfsGatewayTemplate[]
  timeout?: number
}

const NEVER = new Promise<never>(() => {})

export function ipfsFetch(
  ipfsUrl: IpfsUrl,
  {
    gateways = DEFAULT_IPFS_GATEWAYS,
    timeout,
    signal,
    ...fetchConfig
  }: IpfsToFastestWeb2UrlConfig = {},
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const web2InfoList = ipfsToWeb2InfoList(ipfsUrl, gateways)
    const abortControllerSet = new Set<AbortController>()
    let failedRequestCount = 0

    const onAllRequestsFailed = () => {
      reject(new IpfsFetchError(IpfsFetchErrorType.allFailed, ipfsUrl, web2InfoList))
      cleanup()
    }

    const onTimeout = () => {
      reject(new IpfsFetchError(IpfsFetchErrorType.timeout, ipfsUrl, web2InfoList))
      cleanup()
    }

    const onOutsideAbort = () => {
      reject(new IpfsFetchError(IpfsFetchErrorType.abort, ipfsUrl, web2InfoList))
      cleanup()
    }

    const onSuccess = (res: Response) => {
      resolve(res)
      cleanup()
    }

    const timeoutId = typeof timeout === 'number' ? setTimeout(onTimeout, timeout) : null

    signal?.addEventListener('abort', onOutsideAbort)

    Promise.race(
      web2InfoList.map((info) => {
        const abortController = new AbortController()

        abortControllerSet.add(abortController)

        function markSuccess(response: Response): Promise<Response> {
          // Remove current abortController to avoid unexpected abort behavior
          abortControllerSet.delete(abortController)

          return Promise.resolve(response)
        }

        function markFailed(): Promise<never> {
          failedRequestCount += 1

          if (failedRequestCount >= web2InfoList.length) {
            onAllRequestsFailed()
          }

          return NEVER
        }

        return (
          fetch(info.url, { ...fetchConfig, signal: abortController.signal })
            .then((response) => {
              // Only resolve successful requests
              if (response.status === 200) {
                return markSuccess(response)
              } else {
                return markFailed()
              }
            })
            // Ignore fetch errors
            .catch(() => markFailed())
        )
      }),
    )
      .then(onSuccess)
      .finally(cleanup)

    function cleanup() {
      abortControllerSet.forEach((abortController) => abortController.abort())
      abortControllerSet.clear()

      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  })
}
