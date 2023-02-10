import { Command } from 'commander'
import { build, context, analyzeMetafile, BuildOptions } from 'esbuild'

import packageInfo from './package.json'

const program = new Command()

program.option('--minify').option('--watch')
program.parse()

const options = program.opts()

const buildOptions: BuildOptions = {
  entryPoints: ['src/sw.ts'],
  outfile: 'dist/sw.js',
  format: 'iife',
  bundle: true,
  logLevel: 'info',
  minify: options.minify,
  define: {
    BUILD_TIME: JSON.stringify(
      new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZoneName: 'short',
      }).format(new Date()),
    ),
    PKG_VERSION: JSON.stringify(packageInfo.version),
  },
}

;(async () => {
  if (options.watch) {
    const ctx = await context(buildOptions)
    await ctx.watch()
  } else {
    const result = await build({ ...buildOptions, metafile: true })
    // eslint-disable-next-line no-console
    console.log(await analyzeMetafile(result.metafile))
  }
})()
