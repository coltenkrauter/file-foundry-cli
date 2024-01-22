
import {printGracefulOutro, printIntro, printOutro, setLogLevel} from './helpers.js'

async function main() {
  printIntro()
  setLogLevel()
  const {execute} = await import('@oclif/core')
  await execute({development: true, dir: import.meta.url})
  printOutro()
}

process.on('SIGINT', () => {
  printGracefulOutro();
  // eslint-disable-next-line no-process-exit
  process.exit(0);
});

await main()
