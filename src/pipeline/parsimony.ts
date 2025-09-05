import { executeCommand, CommandResult, } from "../system/commands";
import { moveFiles, concatFiles } from "../system/files";
import { libPath, mpbootPath, LogLevel, MAX_CONCURRENCY } from "../common/constants";
import { join } from "path";
import { Args } from "../cli/args";
import { Log } from "../common/log";
import pLimit from "p-limit";

/** Result type for a single iteration */
export type ParsimonyResult =
    | CommandResult
    | { error: Error; job: number; stdout?: string; stderr?: string };

/**
 * Handles parallel execution of MPBoot parsimony jobs
 */
export class ParsimonyAnalysis {
    constructor(private args: Args, private log: Log) { }

    public async executeParsimonyAnalysis(folderPath: string): Promise<ParsimonyResult[]> {
        const parsimonyPath = join(process.cwd(), libPath, mpbootPath);
        const concurrency = this.args.maxConcurrency ? MAX_CONCURRENCY : this.args.concurrency;
        const limit = pLimit(concurrency);
        const shouldLog = this.args.logLevel === LogLevel.DEBUG;
        const results: ParsimonyResult[] = [];
        const iterations = Array.from({ length: this.args.parsimonyIterations }, (_, i) => [
            "-s", this.args.msa,
            `-pre`, `iteration${i + 1}`
        ]);

        // Execute jobs in parallel with concurrency limit
        await Promise.all(iterations.map((cmdArgs, i) =>
            limit(async () => {
                try {
                    this.log.debug(`[Parsimony] Starting job ${i + 1}`);
                    const result = await executeCommand(parsimonyPath, cmdArgs, { log: shouldLog });
                    this.log.debug(`[Parsimony] Finished job ${i + 1}`);
                    results.push(result);
                } catch (err: any) {
                    this.log.error(`[Parsimony] Job ${i + 1} failed`);
                    results.push({
                        error: err.error ?? err,
                        job: i + 1,
                        stdout: err.stdout,
                        stderr: err.stderr
                    });
                }
            })
        ));
        await concatFiles("iteration*.treefile", join(folderPath,
            "parsimony_combined.treefile"), this.log);
        await moveFiles("iteration.*", folderPath, this.log, this.args.concurrency);
        // await moveFiles("iteration.*\\.treefile", folderPath, this.log, this.args.concurrency);
        this.log.info("[Parsimony] All jobs complete.");
        return results;
    }
}