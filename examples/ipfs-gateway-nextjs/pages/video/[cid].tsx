import type { GetStaticProps } from 'next'
import React from 'react'
import { useWeb2Url } from '@crossbell/ipfs-react'

const Home = ({ cid }: { cid: string }) => {
  const ipfsUrl = `ipfs://${cid}` as const
  const gatewayUrl = useWeb2Url(ipfsUrl)

  return (
    <div className="grid gap-4 grid-cols-2 m-4 md:grid-cols-3 lg:grid-cols-4">
      <div className="bg-gray-500">
        <video src={gatewayUrl} autoPlay muted playsInline />
      </div>
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
