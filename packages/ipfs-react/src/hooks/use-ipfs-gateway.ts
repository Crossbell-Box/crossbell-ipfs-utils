import type { IpfsGateway } from '@crossbell/ipfs-gateway'
import { useContext } from 'react'

import { IpfsGatewayContext } from '../context'

export function useIpfsGateway(): IpfsGateway {
  const ipfsGateway = useContext(IpfsGatewayContext)

  if (!ipfsGateway) {
    throw new Error('No IpfsGateway found.')
  }

  return ipfsGateway
}
