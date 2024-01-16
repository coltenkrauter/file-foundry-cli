import {expect, test } from '@oclif/test'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/test-cli')

describe('list-movies', () => {
	test
		.stdout()
		.loadConfig({root})
		.command(['list-movies', './test/data', '--json'])
		.it('runs list-movies command with default args and flags', (ctx) => {
			const json = JSON.parse(ctx.stdout)
			expect(json?.total === 8).to.be.true;
		})
})
