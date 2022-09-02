export type Web2Url = `${'https' | 'http'}://${string}`

export type IpfsUrl = `ipfs://${string}`

export type IpfsInfo = { cid: string; pathToResource: string }

// https://github.com/ipfs/in-web-browsers/blob/master/ADDRESSING.md#addressing-with-http-url
export type IpfsGatewayTemplate = `${Web2Url}{cid}${string}{pathToResource}`
