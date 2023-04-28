import { IpfsGatewayTemplate } from './types'

export const DEFAULT_IPFS_GATEWAYS: IpfsGatewayTemplate[] = [
  'https://4everland.xyz/ipfs/{cid}{pathToResource}',
  'https://w3s.link/ipfs/{cid}{pathToResource}',
  'https://ipfs.io/ipfs/{cid}{pathToResource}',
  'https://dweb.link/ipfs/{cid}{pathToResource}',
]
