import type { NextConfig } from 'next'
import type { Rewrite } from 'next/dist/lib/load-custom-routes'
import CopyPlugin from 'copy-webpack-plugin'

export type WithIpfsGatewayConfig = NextConfig & {
  ipfsGateway?: Partial<{
    gatewayPath: `/${string}/:path*`
    fallbackGateway: `https://${string}/ipfs/:path*`
    serviceWorkerFilename: string
  }>
}

export function withIpfsGateway({
  ipfsGateway,
  ...userConfig
}: WithIpfsGatewayConfig = {}): NextConfig {
  const {
    gatewayPath = '/ipfs/:path*',
    fallbackGateway = 'https://cloudflare-ipfs.com/ipfs/:path*',
    serviceWorkerFilename = 'ipfs-gateway-sw.js',
  } = ipfsGateway ?? {}

  const swFilePath = `static/${serviceWorkerFilename}`

  return {
    webpack: (config, context) => {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: require.resolve('@crossbell/ipfs-gateway-sw/dist/sw.js'),
              to: swFilePath,
            },
          ],
        }),
      )

      return userConfig.webpack?.(config, context) ?? config
    },

    async rewrites(...params) {
      const userRewrites = (await userConfig.rewrites?.(...params)) ?? []
      const rewrite: Rewrite[] = [
        {
          source: `/${serviceWorkerFilename}`,
          destination: `/_next/${swFilePath}`,
          locale: false,
        },
        {
          // TODO: - Validate `gatewayPath` pattern
          source: gatewayPath,
          // TODO: - Validate `fallbackGateway` pattern
          destination: fallbackGateway,
        },
      ]

      if (Array.isArray(userRewrites)) {
        return [...userRewrites, ...rewrite]
      } else {
        return { ...userRewrites, fallback: [...(userRewrites.fallback ?? []), ...rewrite] }
      }
    },
  }
}

export default withIpfsGateway
