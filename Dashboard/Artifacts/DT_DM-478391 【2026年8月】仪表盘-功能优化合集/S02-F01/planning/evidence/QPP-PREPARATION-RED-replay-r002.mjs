import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../..')
const sourcePath = path.join(
  repoRoot,
  'core/core-frontend/src/custom-component/filter-copy/query-product-paste-preparation.ts'
)
const runnerPath = path.join(
  repoRoot,
  'core/core-frontend/tests/filter-copy-query-reference/query-product-paste-preparation.test.ts'
)
const source = readFileSync(sourcePath, 'utf8')
const sourceSha256 = createHash('sha256').update(source).digest('hex')
const expectedSourceSha256 = '5adbb83d363b260a6996709696df322e6a77d851e4bb86a391f22bb32a1093d3'
if (sourceSha256 !== expectedSourceSha256) {
  throw new Error(`baseline source drift: expected ${expectedSourceSha256}, got ${sourceSha256}`)
}
const anchor = 'export const prepareQueryProductPaste = (inputValue: unknown) => {'
if (source.split(anchor).length !== 2) throw new Error('mutant anchor is missing or ambiguous')
const mutantPath = path.join(path.dirname(sourcePath), `query-product-paste-preparation.red-${process.pid}.ts`)
const mutant = source.replace(
  anchor,
  `let qppRedReplayCalls = 0\n${anchor}\n  if (++qppRedReplayCalls === 2) return fail('TARGET', 'TARGET_VERSION_MISMATCH')`
)
writeFileSync(mutantPath, mutant, { flag: 'wx' })
try {
  const result = spawnSync(process.execPath, [runnerPath, mutantPath], { encoding: 'utf8' })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  process.stdout.write(output)
  if (result.status !== 1 || !output.includes('FAIL 1/31') || !output.includes('QPP-001')) {
    throw new Error(`expected only QPP-001 assertion failure; runner exit=${result.status}`)
  }
  process.stdout.write(`RED_REPLAY_VERIFIED runner_exit=${result.status} failed_case=QPP-001\n`)
} finally {
  unlinkSync(mutantPath)
}
