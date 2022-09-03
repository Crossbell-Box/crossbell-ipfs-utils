import type { GetStaticProps } from 'next'
import React from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'
import { IpfsGateway } from '@crossbell/ipfs-gateway'

import {
  DEFAULT_IPFS_GATEWAYS,
  fillIpfsGatewayTemplate,
  parseIpfsInfo,
} from '@crossbell/ipfs-fetch'

import { ImgCard } from '../../components'

const ipfsGateway = new IpfsGateway()

const Home = ({ cid }: { cid: string }) => {
  const ipfsUrl = `ipfs://${cid}` as const
  const ipfsInfo = parseIpfsInfo(ipfsUrl)!

  const [gatewayUrl, setGatewayUrl] = React.useState('')

  useIsomorphicLayoutEffect(() => {
    ipfsGateway.getFastestGatewayUrl(ipfsUrl).then(setGatewayUrl)
  }, [])

  return (
    <div className="grid gap-4 grid-cols-2 m-4 md:grid-cols-3 lg:grid-cols-4">
      <ImgCard cid={cid} src={gatewayUrl} key={gatewayUrl} />

      {DEFAULT_IPFS_GATEWAYS.map((gateway) => {
        const src = fillIpfsGatewayTemplate(gateway, ipfsInfo)
        return <ImgCard key={gateway} src={src} cid={cid} />
      })}
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: { cid: context.params?.cid },
  }
}

export default Home
