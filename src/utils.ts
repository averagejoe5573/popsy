import { spawn } from "child_process";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";
import { RESULTS_PATH } from "./constants";
import { Log } from "./log";

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

/** Returns timestamp: HH-MM-SS_DD-MM-YYYY */
export function getTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}_${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
}

/** Create timestamped folder for results */
export function createTimestampFolder(): string {
    const timestamp = getTimestamp();
    const relativeTimestampFolderPath = join(RESULTS_PATH, timestamp);
    const timestampFolderPath = join(process.cwd(), RESULTS_PATH, timestamp);

    if (!existsSync(timestampFolderPath)) {
        mkdirSync(join(timestampFolderPath, "parsimony"), { recursive: true });
        mkdirSync(join(timestampFolderPath, "likelihood"), { recursive: true });
    }

    return relativeTimestampFolderPath;
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

/** Convert ms to HH:MM:SS */
export function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
