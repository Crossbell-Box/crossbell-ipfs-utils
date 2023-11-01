import { http, delay, HttpResponse } from 'msw'

import { IpfsUrl } from '../../src'
import { DEFAULT_IPFS_GATEWAYS } from '../../src/constant'
import { parseIpfsInfo, fillIpfsGatewayTemplate } from '../../src/utils'

export const IPFS_URL: IpfsUrl =
  'ipfs://bafkreiarfgti3xpv2oznl7rzanfbzm7gvklvcwn5poqb53wlhi3n4cwp2a'

export const IPFS_INFO = parseIpfsInfo(IPFS_URL)

export const [
  SUCCESS_A_IPFS_GATEWAY,
  SUCCESS_B_IPFS_GATEWAY,
  ERROR_A_IPFS_GATEWAY,
  ERROR_B_IPFS_GATEWAY,
] = DEFAULT_IPFS_GATEWAYS

export const INFINITE_IPFS_GATEWAY = 'https://localhost.com/ipfs/{cid}{pathToResource}'

export const handlers = [
  http.get(fillIpfsGatewayTemplate(SUCCESS_A_IPFS_GATEWAY, IPFS_INFO), () => {
    return HttpResponse.json({ name: 'A' })
  }),

  http.get(fillIpfsGatewayTemplate(SUCCESS_B_IPFS_GATEWAY, IPFS_INFO), async () => {
    await delay(300)
    return HttpResponse.json({ name: 'B' })
  }),

  http.get(fillIpfsGatewayTemplate(ERROR_A_IPFS_GATEWAY, IPFS_INFO), () => {
    return new HttpResponse(null, { status: 404 })
  }),

  http.get(fillIpfsGatewayTemplate(ERROR_B_IPFS_GATEWAY, IPFS_INFO), async () => {
    await delay(1000)
    return new HttpResponse(null, { status: 404 })
  }),

  http.get(fillIpfsGatewayTemplate(INFINITE_IPFS_GATEWAY, IPFS_INFO), async () => {
    await delay('infinite')
  }),
]
