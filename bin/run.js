#!/usr/bin/env node

import {printIntro, printOutro, printGracefulOutro} from './helpers.js'

async function main() {
  printIntro()
  const {execute} = await import('@oclif/core')
  await execute({dir: import.meta.url})
  printOutro()
}

process.on('SIGINT', () => {
  printGracefulOutro();
  process.exit(0);
});

await main()
