const { Command } = require('commander')
const packageInfo = require('./package.json')

const program = new Command()

program.option('--minify').option('--watch')
program.parse()

const options = program.opts()

require('esbuild').build({
  entryPoints: ['src/sw.ts'],
  outfile: 'dist/sw.js',
  format: 'iife',
  bundle: true,
  logLevel: 'info',
  minify: options.minify,
  watch: options.watch,
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
})
