import { Args } from "./args";
import { Log } from "./log";
import { createTimestampFolder, handleCommandError, formatDuration } from "./utils";
import { ParsimonyAnalysis } from "./parsimony";
import { performance } from "perf_hooks";
import { MAX_CONCURRENCY } from "./constants";

/**
 * Popsy pipeline executor
 * Responsible for orchestrating the entire pipeline.
 */
export class Popsy {
    public args: Args;
    private log: Log;

    constructor(log?: Log, args?: Args) {
        this.log = log ?? new Log();
        this.args = args ?? new Args(this.log);
    }

    /**
     * Executes the pipeline:
     * - Creates timestamped results folder
     * - Moves generated results into subfolders
     * - Logs duration and status
     */
    public async execute(): Promise<void> {
        const startTime = performance.now();

        // Create timestamped folder
        const relativeTimestampFolderPath = createTimestampFolder();

        this.log.info("Running Popsy with arguments:");
        this.log.info(`MSA file: ${this.args.msa}`);
        this.log.info(`Iterations: ${this.args.parsimonyIterations}`);
        this.args.maxConcurrency
            ? this.log.info(`Max concurrency: ${this.args.maxConcurrency} (${MAX_CONCURRENCY})`)
            : this.log.info(`Concurrency: ${this.args.concurrency}`);
        this.log.debug("DEBUG: Logger working");

        // Run parsimony analysis inside the timestamp folder
        const parsimonyFolderPath = `${relativeTimestampFolderPath}/parsimony`;

        const parsimony = new ParsimonyAnalysis(this.args, this.log);

        try {
            await parsimony.executeParsimonyAnalysis(parsimonyFolderPath);
        } catch (err) {
            handleCommandError(err, this.log, "Parsimony");
        }

        this.log.info(`All results written to: ${relativeTimestampFolderPath}`);
        this.log.info(`Pipeline completed in ${formatDuration(performance.now() - startTime)}`);
    }
}