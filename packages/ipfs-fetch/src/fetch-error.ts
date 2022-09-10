import type { IpfsUrl } from './types'
import type { Web2Info } from './utils'

export enum IpfsFetchErrorType {
  abort = 'ipfsFetch abort',
  allFailed = 'ipfsFetch all failed',
}

export class IpfsFetchError extends Error {
  name = 'IpfsFetchError'

  constructor(
    type: IpfsFetchErrorType,
    public readonly url: IpfsUrl,
    public readonly web2InfoList: Web2Info[],
  ) {
    super(type)
  }
}
