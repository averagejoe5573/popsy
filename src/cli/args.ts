import { Command } from "commander";
import { PARSIMONY_ITERATIONS, LogLevel, CONCURRENCY } from "../common/constants";
import { Log } from "../common/log";

/**
 * CLI and programmatic arguments handler for Popsy.
 * Ensures validation and applies defaults.
 */
export class Args {
    public msa: string;
    public parsimonyIterations: number;
    public logLevel: LogLevel;
    public concurrency: number;
    public maxConcurrency: boolean;

    constructor(
        private log: Log,
        options?: {
            msa: string;
            parsimonyIterations: number;
            logLevel: LogLevel;
            concurrency: number;
            maxConcurrency: boolean;
        }
    ) {
        if (options) {
            // Programmatic options
            this.msa = options.msa;
            this.parsimonyIterations = options.parsimonyIterations;
            this.logLevel = options.logLevel;
            this.concurrency = options.concurrency;
            this.maxConcurrency = options.maxConcurrency ?? false;
        } else {
            // CLI options
            const program = new Command();
            program
                .name("Popsy")
                .description("CLI wrapper for piping phylogenetic analysis")
                .option("--msa <string>", "path to the multiple sequence alignment file")
                .option(
                    "--parsimony-iterations <number>",
                    "number of parsimony trees to be generated",
                    (val: string) => parseInt(val, 10),
                    PARSIMONY_ITERATIONS
                )
                .option("--log-level <level>", "logging level (error, warn, info, debug)", "info")
                .option(
                    "--concurrency <number>",
                    "maximum number of iterations to be performed in parallel",
                    (val: string) => parseInt(val, 10),
                    CONCURRENCY
                )
                .option("--max-concurrency", "set concurrency to max number of processors", false);

            program.parse(process.argv);

            const cliOptions = program.opts<{
                msa: string;
                parsimonyIterations: number;
                logLevel: string;
                concurrency: number;
                maxConcurrency: boolean;
            }>();

            this.msa = cliOptions.msa;
            this.parsimonyIterations = cliOptions.parsimonyIterations;
            this.logLevel = this.validateLogLevel(cliOptions.logLevel);
            this.concurrency = cliOptions.concurrency;
            this.maxConcurrency = cliOptions.maxConcurrency ?? false;
        }

        // Always validate, regardless of CLI or programmatic options
        this.validateRequiredArgs();
        this.validateArgs();
    }

    /** Ensure required arguments are present */
    private validateRequiredArgs(): void {
        if (typeof this.msa !== "string" || this.msa.trim().length === 0) {
            throw new Error("Missing required argument: --msa (must be a valid file path).");
        }
    }

    /** Validate numeric values and apply defaults if invalid */
    private validateArgs() {
        if (this.parsimonyIterations <= 0 || Number.isNaN(this.parsimonyIterations)) {
            this.log.warn(
                `Parsimony iterations must be greater than 0, setting to default (${PARSIMONY_ITERATIONS})`
            );
            this.parsimonyIterations = PARSIMONY_ITERATIONS;
        }
        if (this.concurrency <= 0 || Number.isNaN(this.concurrency)) {
            this.log.warn(`Concurrency must be greater than 0, setting to default (${CONCURRENCY})`);
            this.concurrency = CONCURRENCY;
        }
    }

    /** Validate and convert log level string to enum */
    private validateLogLevel(level: string): LogLevel {
        switch (level.toLowerCase()) {
            case "error":
                return LogLevel.ERROR;
            case "warn":
                return LogLevel.WARN;
            case "info":
                return LogLevel.INFO;
            case "debug":
                return LogLevel.DEBUG;
            default:
                this.log.warn(`Unknown log level: "${level}", setting to default (INFO)`);
                return LogLevel.INFO;
        }
    }
}
