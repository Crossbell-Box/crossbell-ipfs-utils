import type { NextConfig } from 'next'
import type { Rewrite, Redirect } from 'next/dist/lib/load-custom-routes'

import CopyPlugin from 'copy-webpack-plugin'
import { DEFAULT_IPFS_GATEWAYS, fillIpfsGatewayTemplate, Web2Url } from '@crossbell/ipfs-fetch'

type GatewayPath = `/${string}/:cid/:pathToResource*`
type FallbackGateway = `${Web2Url}:cid${string}:pathToResource*`

export type WithIpfsGatewayConfig = NextConfig & {
  ipfsGateway?: Partial<{
    gatewayPath: GatewayPath
    fallbackGateway: FallbackGateway
    serviceWorkerFilename: string
    disableServerGateway: boolean
  }>
}

const defaultFallbackGateway = fillIpfsGatewayTemplate(DEFAULT_IPFS_GATEWAYS[0], {
  cid: ':cid',
  pathToResource: ':pathToResource*',
}) as FallbackGateway

export function withIpfsGateway({
  ipfsGateway,
  ...userConfig
}: WithIpfsGatewayConfig = {}): NextConfig {
  const gatewayPath: GatewayPath = ipfsGateway?.gatewayPath ?? '/ipfs/:cid/:pathToResource*'
  const fallbackGateway: FallbackGateway = ipfsGateway?.fallbackGateway ?? defaultFallbackGateway
  const serviceWorkerFilename = ipfsGateway?.serviceWorkerFilename ?? 'ipfs-gateway-sw.js'
  const disableServerGateway = ipfsGateway?.disableServerGateway ?? false
  const swFilePath = `static/${serviceWorkerFilename}`

  return {
    ...userConfig,

    webpack: (config, context) => {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: require.resolve('@crossbell/ipfs-gateway-sw/sw.js'),
              to: swFilePath,
            },
          ],
        }),
      )

      return userConfig.webpack?.(config, context) ?? config
    },

    async rewrites(...params) {
      const userRewrites = (await userConfig.rewrites?.(...params)) ?? []
      const rewrite: Rewrite = {
        source: `/${serviceWorkerFilename}`,
        destination: `/_next/${swFilePath}`,
        locale: false,
      }

      if (Array.isArray(userRewrites)) {
        return [...userRewrites, rewrite]
      } else {
        return { ...userRewrites, fallback: [...(userRewrites.fallback ?? []), rewrite] }
      }
    },

    async redirects(...params) {
      const userRedirects = (await userConfig.redirects?.(...params)) ?? []

      if (disableServerGateway) {
        return userRedirects
      } else {
        const redirect: Redirect = {
          permanent: false,
          // TODO: - Validate `gatewayPath` pattern
          source: gatewayPath,
          // TODO: - Validate `fallbackGateway` pattern
          destination: fallbackGateway,
        }

        return [...userRedirects, redirect]
      }
    },
  }
}

export default withIpfsGateway
