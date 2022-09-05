import type { IpfsGateway } from '@crossbell/ipfs-gateway'

import React from 'react'

export const IpfsGatewayContext = React.createContext<IpfsGateway | null>(null)
