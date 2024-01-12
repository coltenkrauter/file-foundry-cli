#!/usr/bin/env node

import {printIntro, printOutro} from './helpers.js'

async function main() {
  printIntro()
  const {execute} = await import('@oclif/core')
  await execute({dir: import.meta.url})
  printOutro()
}

await main()
