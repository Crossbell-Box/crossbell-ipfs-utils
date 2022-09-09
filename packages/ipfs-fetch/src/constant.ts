import { IpfsGatewayTemplate } from './types'

export const DEFAULT_IPFS_GATEWAYS: IpfsGatewayTemplate[] = [
  'https://4everland.xyz/ipfs/{cid}{pathToResource}',
  'https://{cid}.ipfs.w3s.link/{pathToResource}',
  'https://ipfs.io/ipfs/{cid}{pathToResource}',
  'https://{cid}.ipfs.dweb.link/{pathToResource}',
  'https://{cid}.ipfs.cf-ipfs.com/{pathToResource}',
]
