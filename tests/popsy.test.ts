// tests/Popsy.test.ts
import { describe, it, expect, vi } from 'vitest'
import { Popsy } from '../src/Popsy'
import { Args } from '../src/Args'

describe('Popsy', () => {
    it('logs execution with args', async () => {
        const args = new Args({ msa: 'alignment.fasta', iterations: 5 })
        const popsy = new Popsy(args)

        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

        await popsy.execute()

        expect(logSpy).toHaveBeenCalledWith('Running Popsy with the following arguments:')
        expect(logSpy).toHaveBeenCalledWith('MSA file: alignment.fasta')
        expect(logSpy).toHaveBeenCalledWith('Iterations: 5')

        logSpy.mockRestore()
    })
})
