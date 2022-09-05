import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { IpfsGateway } from '@crossbell/ipfs-gateway'
import { IpfsGatewayContext } from '@crossbell/ipfs-react'

const ipfsGateway = new IpfsGateway()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IpfsGatewayContext.Provider value={ipfsGateway}>
      <Component {...pageProps} />
    </IpfsGatewayContext.Provider>
  )
}

export default MyApp
