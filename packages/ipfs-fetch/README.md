# @crossbell/ipfs-fetch

<p align="left">
  <a href="https://github.com/Crossbell-Box/crossbell-monorepo/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@crossbell/ipfs-fetch?colorA=373737&colorB=0A70E9&style=flat" alt="GitHub license" />
  </a>
  <a href="https://www.npmjs.com/package/@crossbell/ipfs-fetch">
    <img src="https://img.shields.io/npm/v/@crossbell/ipfs-fetch?colorA=373737&colorB=0A70E9&style=flat" alt="NPM version" />
  </a>
  <a href="https://bundlephobia.com/result?p=@crossbell/ipfs-fetch">
    <img src="https://img.shields.io/bundlephobia/min/@crossbell/ipfs-fetch?label=bundle%20size&colorA=373737&colorB=0A70E9&style=flat" alt="Bundle size" />
  </a>
</p>

⚡ Fetch [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System) contents through the fastest gateway by sending requests to multiple gateways simultaneously.
<a href="https://codesandbox.io/embed/wonderful-matsumoto-jf2sjv?hidenavigation=1">Try on CodeSandbox</a>.

## Installation

##### Using [yarn](https://yarn.pm/@crossbell/ipfs-fetch):

```bash
yarn add @crossbell/ipfs-fetch
```

##### Or via [npm](https://www.npmjs.com/package/@crossbell/ipfs-fetch):

```bash
npm install @crossbell/ipfs-fetch --save
```

##### Or via [pnpm](https://pnpm.io):

```bash
pnpm add @crossbell/ipfs-fetch
```

## Examples

##### Basic fetch

```typescript
import { ipfsFetch } from '@crossbell/ipfs-fetch'

ipfsFetch('ipfs://bafkreic5k3zvarbsondfrowy7kpbj6xo7cj25hobksgileqbbupjvvmkoq')
```

##### Custom gateways

```typescript
import { ipfsFetch, IpfsGatewayTemplate } from '@crossbell/ipfs-fetch'

// Default gateways: https://github.com/Crossbell-Box/crossbell-monorepo/blob/main/packages/ipfs-fetch/src/constant.ts
const gateways: IpfsGatewayTemplate[] = [
  'https://{cid}.ipfs.cf-ipfs.com/{pathToResource}',
  'https://ipfs.io/ipfs/{cid}{pathToResource}',
]

ipfsFetch('ipfs://bafkreic5k3zvarbsondfrowy7kpbj6xo7cj25hobksgileqbbupjvvmkoq', {
  gateways,
})
```

##### Custom timeout

```typescript
import { ipfsFetch } from '@crossbell/ipfs-fetch'

ipfsFetch('ipfs://bafkreic5k3zvarbsondfrowy7kpbj6xo7cj25hobksgileqbbupjvvmkoq', {
  timeout: 10000,
})
```
