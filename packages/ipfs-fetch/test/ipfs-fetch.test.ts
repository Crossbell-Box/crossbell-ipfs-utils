import { expect, describe, it } from 'vitest'

import {
  IPFS_URL,
  ERROR_A_IPFS_GATEWAY,
  ERROR_B_IPFS_GATEWAY,
  SUCCESS_A_IPFS_GATEWAY,
  SUCCESS_B_IPFS_GATEWAY,
  INFINITE_IPFS_GATEWAY,
} from './mocks/handlers'

import { ipfsFetch, IpfsFetchError, IpfsFetchErrorType } from '../src'

describe.concurrent('ipfs-fetch', () => {
  it('should return first success response', async () => {
    const res = await ipfsFetch(IPFS_URL, {
      gateways: [
        ERROR_A_IPFS_GATEWAY,
        ERROR_B_IPFS_GATEWAY,
        INFINITE_IPFS_GATEWAY,
        SUCCESS_B_IPFS_GATEWAY,
        SUCCESS_A_IPFS_GATEWAY,
      ],
    })

    expect(await res.json()).toEqual({ name: 'A' })
    expect(res.status).toBe(200)
  })

  it('should throw error if no success request', async () => {
    try {
      await ipfsFetch(IPFS_URL, {
        gateways: [ERROR_A_IPFS_GATEWAY, ERROR_B_IPFS_GATEWAY],
      })
    } catch (e) {
      expect(e).instanceof(IpfsFetchError)
      expect((e as IpfsFetchError).message).toBe(IpfsFetchErrorType.allFailed)
    }
  })
})
