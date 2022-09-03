import type { GetStaticProps } from 'next'
import React from 'react'

import {
  DEFAULT_IPFS_GATEWAYS,
  fillIpfsGatewayTemplate,
  parseIpfsInfo,
} from '@crossbell/ipfs-fetch'

import { ipfsSwGateway } from '../../ipfs-gateway'
import { ImgCard } from '../../components'

const Home = ({ cid }: { cid: string }) => {
  const ipfsUrl = `ipfs://${cid}` as const
  const ipfsInfo = parseIpfsInfo(ipfsUrl)!

  return (
    <div className="grid gap-4 grid-cols-2 m-4 md:grid-cols-3 lg:grid-cols-4">
      <ImgCard cid={cid} src={ipfsSwGateway.getSwGatewayUrl(ipfsUrl)} />

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
