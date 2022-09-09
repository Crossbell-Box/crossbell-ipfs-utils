import { rest } from 'msw'

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
  TIMEOUT_IPFS_GATEWAY,
] = DEFAULT_IPFS_GATEWAYS

export const handlers = [
  rest.get(fillIpfsGatewayTemplate(SUCCESS_A_IPFS_GATEWAY, IPFS_INFO), (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ name: 'A' })),
  ),

  rest.get(fillIpfsGatewayTemplate(SUCCESS_B_IPFS_GATEWAY, IPFS_INFO), (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({ name: 'B' }), ctx.delay(300)),
  ),

  rest.get(fillIpfsGatewayTemplate(ERROR_A_IPFS_GATEWAY, IPFS_INFO), (_req, res, ctx) =>
    res(ctx.status(404)),
  ),

  rest.get(fillIpfsGatewayTemplate(ERROR_B_IPFS_GATEWAY, IPFS_INFO), (_req, res, ctx) =>
    res(ctx.status(404), ctx.delay(1000)),
  ),

  rest.get(fillIpfsGatewayTemplate(TIMEOUT_IPFS_GATEWAY, IPFS_INFO), (_req, res, ctx) =>
    res(ctx.delay('infinite')),
  ),
]
