import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeCommand, CommandResult } from '../src/utils/commands';
import { createTimestampFolder } from '../src/utils/files';

import { spawn } from 'child_process';

// Mock fs functions
vi.mock('fs', () => ({
    mkdirSync: vi.fn(),
    existsSync: vi.fn().mockReturnValue(false),
}));

// Mock child_process
vi.mock('child_process', () => ({
    spawn: vi.fn(),
}));

describe('utils', () => {
    describe('createTimestampFolder', () => {
        it('should return a string path containing "results"', () => {
            const relativeTimestampFolderPath: string = createTimestampFolder();
            expect(typeof relativeTimestampFolderPath).toBe('string');
            expect(relativeTimestampFolderPath).toContain('results');
        });
    });

    describe('executeCommand', () => {
        beforeEach(() => {
            vi.restoreAllMocks();
        });

        it('resolves with stdout/stderr when command succeeds', async () => {
            const mockStdout = 'output';
            const mockStderr = '';

            const mockChild = {
                stdout: { on: vi.fn((event, cb) => { if (event === 'data') cb(Buffer.from(mockStdout)); }) },
                stderr: { on: vi.fn((event, cb) => { if (event === 'data') cb(Buffer.from(mockStderr)); }) },
                on: vi.fn((event, cb) => { if (event === 'close') cb(0); }),
            };
            (spawn as unknown as vi.Mock).mockReturnValue(mockChild);

            const result: CommandResult = await executeCommand('echo', ['hello'], { log: false });
            expect(result.stdout).toContain(mockStdout);
            expect(result.stderr).toBe(mockStderr);
            expect(result.code).toBe(0);
        });

        it('rejects with CommandError when command fails', async () => {
            const mockStdout = '';
            const mockStderr = 'error';
            const mockChild = {
                stdout: { on: vi.fn() },
                stderr: { on: vi.fn((event, cb) => { if (event === 'data') cb(Buffer.from(mockStderr)); }) },
                on: vi.fn((event, cb) => { if (event === 'close') cb(1); }),
            };
            (spawn as unknown as vi.Mock).mockReturnValue(mockChild);

            await expect(executeCommand('fail', [], { log: false })).rejects.toHaveProperty('stderr', mockStderr);
        });
    });
});
