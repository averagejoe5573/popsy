import { spawn } from "child_process";
import { Log } from "../common/log";

/** Command execution result */
export interface CommandResult {
    stdout: string;
    stderr: string;
    code: number;
}

/** Custom error for commands */
export class CommandError extends Error {
    constructor(
        message: string,
        public stdout: string = "",
        public stderr: string = "",
        public code: number = 1
    ) { super(message); }
}

/** Execute a shell command asynchronously */
export async function executeCommand(
    cmd: string,
    args: string[] = [],
    { log = true, cwd }: { log?: boolean; cwd?: string } = {}
): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
        let stdout = "", stderr = "";

        const child = spawn(cmd, args, { stdio: "pipe", shell: true, cwd });

        child.stdout.on("data", (data) => { stdout += data.toString(); if (log) process.stdout.write(data); });
        child.stderr.on("data", (data) => { stderr += data.toString(); if (log) process.stderr.write(data); });

        child.on("close", (code) => code === 0
            ? resolve({ stdout, stderr, code: code ?? 0 })
            : reject(new CommandError("Process failed", stdout, stderr, code ?? 1))
        );

        child.on("error", (err: Error) => reject(new CommandError(err.message, stdout, stderr, 1)));
    });
}

/** Handle errors from executeCommand */
export function handleCommandError(err: unknown, log: Log, context: string): never {
    if (err instanceof CommandError) {
        log.error(`[${context}] Failed with code ${err.code}`);
        if (err.stdout) log.error(`STDOUT: ${err.stdout}`);
        if (err.stderr) log.error(`STDERR: ${err.stderr}`);
    } else {
        log.error(`[${context}] Unexpected error: ${(err as Error).message}`);
    }
    throw err;
}