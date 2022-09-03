import { IpfsGatewayTemplate } from './types'

export const DEFAULT_IPFS_GATEWAYS: IpfsGatewayTemplate[] = [
  'https://ipfs.io/ipfs/{cid}{pathToResource}',
  'https://{cid}.ipfs.dweb.link/{pathToResource}',
  'https://cloudflare-ipfs.com/ipfs/{cid}{pathToResource}',
  'https://{cid}.ipfs.cf-ipfs.com/{pathToResource}',
  'https://4everland.xyz/ipfs/{cid}{pathToResource}',
]
