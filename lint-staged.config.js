module.exports = {
  '**/package.json': ['yarn format:package'],
  '*.{ts,tsx,html,json}': () => ['yarn format:code', 'yarn lint'],
}
