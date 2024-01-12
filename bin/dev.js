#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import {printIntro, printOutro, printGracefulOutro} from './helpers.js'

async function main() {
  printIntro()
  const {execute} = await import('@oclif/core')
  await execute({development: true, dir: import.meta.url})
  printOutro()
}

process.on('SIGINT', () => {
  printGracefulOutro();
  process.exit(0);
});

await main()
