const { withIpfsGateway } = require('@crossbell/ipfs-gateway-next')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withIpfsGateway({
  ...nextConfig,
  ipfsGateway: { disableServerGateway: true },
})
