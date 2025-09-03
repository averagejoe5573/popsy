// tests/Args.test.ts
import { describe, it, expect } from 'vitest'
import { Args } from '../src/Args'

function mockArgv(args: string[]) {
    const originalArgv = process.argv
    process.argv = ['node', 'popsy', ...args]
    return () => { process.argv = originalArgv }
}

describe('Args', () => {
    it('parses msa and iterations correctly', () => {
        const restoreArgv = mockArgv(['--msa', 'alignment.fasta', '--iterations', '42'])
        const args = new Args()
        restoreArgv()

        expect(args.msa).toBe('alignment.fasta')
        expect(args.iterations).toBe(42)
    })

    it('defaults iterations to 100 when not provided', () => {
        const restoreArgv = mockArgv(['--msa', 'alignment.fasta'])
        const args = new Args()
        restoreArgv()

        expect(args.iterations).toBe(100)
    })

    it('throws an error if iterations <= 0', () => {
        const restoreArgv = mockArgv(['--msa', 'alignment.fasta', '--iterations', '0'])
        expect(() => new Args()).toThrow('Iterations must be greater than 0')
        restoreArgv()
    })
})
